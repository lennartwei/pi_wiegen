import eventlet
eventlet.monkey_patch()

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
from scale import Scale
import json
import signal
import sys
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, 
    cors_allowed_origins="*",
    async_mode='eventlet',
    logger=True,
    engineio_logger=True
)

# Initialize scale
scale = Scale()

# Store active sessions
sessions = {}

def signal_handler(sig, frame):
    logger.info('\nCleaning up...')
    scale.cleanup()
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

@app.route('/weight')
def get_weight():
    try:
        weight = scale.get_weight()
        return jsonify({'weight': weight})
    except Exception as e:
        logger.error(f"Error getting weight: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/tare', methods=['POST'])
def tare_scale():
    try:
        scale.tare()
        return jsonify({'success': True, 'message': 'Scale tared successfully'})
    except Exception as e:
        logger.error(f"Error taring scale: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/reset', methods=['POST'])
def reset_scale():
    try:
        success = scale.reset_calibration()
        if success:
            return jsonify({'success': True, 'message': 'Scale reset to factory defaults'})
        return jsonify({'success': False, 'message': 'Failed to reset scale'})
    except Exception as e:
        logger.error(f"Error resetting scale: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/calibrate', methods=['POST'])
def calibrate():
    try:
        data = request.get_json()
        step = data.get('step')
        known_weight = data.get('known_weight', 100.0)
        
        if step == 1:
            scale.tare()
            return jsonify({
                'success': True,
                'message': 'Zero point set. Please place the calibration weight.'
            })
        
        elif step == 2:
            scale.calibrate_with_known_weight(known_weight)
            return jsonify({
                'success': True,
                'message': 'Scale calibrated. Please remove the weight.'
            })
        
        elif step == 3:
            scale.tare()
            return jsonify({
                'success': True,
                'message': 'Calibration complete!'
            })
        
        return jsonify({'success': False, 'message': 'Invalid step'}), 400
    
    except Exception as e:
        logger.error(f"Error during calibration: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@socketio.on('connect')
def handle_connect():
    logger.info(f'Client connected: {request.sid}')
    emit('connect_response', {'status': 'connected', 'sid': request.sid})

@socketio.on('disconnect')
def handle_disconnect():
    logger.info(f'Client disconnected: {request.sid}')
    # Clean up any sessions this client was part of
    for session_id, session in list(sessions.items()):
        if request.sid in session['players']:
            handle_leave_session({'sessionId': session_id})

@socketio.on('create_session')
def handle_create_session(data):
    session_id = data.get('sessionId')
    if not session_id:
        emit('error', 'Invalid session ID')
        return

    if session_id in sessions:
        emit('error', 'Session already exists')
        return

    sessions[session_id] = {
        'host': request.sid,
        'players': [request.sid],
        'game_state': None
    }
    join_room(session_id)
    emit('session_created', {'sessionId': session_id}, room=session_id)
    logger.info(f'Session created: {session_id}')

@socketio.on('join_session')
def handle_join_session(data):
    session_id = data.get('sessionId')
    if not session_id or session_id not in sessions:
        emit('error', 'Invalid session ID')
        return

    session = sessions[session_id]
    if request.sid not in session['players']:
        session['players'].append(request.sid)
    
    join_room(session_id)
    emit('session_joined', {
        'sessionId': session_id,
        'isHost': request.sid == session['host']
    })
    logger.info(f'Client {request.sid} joined session {session_id}')
    
    # Send current game state to the new player
    if session['game_state']:
        emit('session_state', session['game_state'])

@socketio.on('leave_session')
def handle_leave_session(data):
    session_id = data.get('sessionId')
    if not session_id or session_id not in sessions:
        return

    leave_room(session_id)
    session = sessions[session_id]
    
    if request.sid in session['players']:
        session['players'].remove(request.sid)
    
    if request.sid == session['host']:
        # Host left, notify all players and clean up
        emit('session_ended', room=session_id)
        del sessions[session_id]
        logger.info(f'Session ended: {session_id}')
    else:
        logger.info(f'Client {request.sid} left session {session_id}')

@socketio.on('update_state')
def handle_state_update(data):
    session_id = data.get('sessionId')
    update = data.get('update')
    
    if not session_id or session_id not in sessions:
        emit('error', 'Invalid session ID')
        return

    session = sessions[session_id]
    if request.sid != session['host']:
        emit('error', 'Only host can update game state')
        return

    session['game_state'] = {
        **(session['game_state'] or {}),
        **update
    }
    emit('session_state', session['game_state'], room=session_id)
    logger.info(f'Game state updated for session {session_id}')

if __name__ == '__main__':
    try:
        logger.info('Server initialized for eventlet.')
        socketio.run(app, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True, debug=True, use_reloader=False)
    finally:
        scale.cleanup()