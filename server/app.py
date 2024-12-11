from flask import Flask, jsonify, request
from flask_cors import CORS
from scale import Scale
from battery import BatteryMonitor
from session_manager import SessionManager
import json
import secrets
import time

app = Flask(__name__)
CORS(app)

# Initialize hardware and managers
scale = Scale()
battery = BatteryMonitor()
session_manager = SessionManager()

@app.route('/sessions', methods=['GET'])
def list_sessions():
    """List all active sessions"""
    sessions = session_manager.list_sessions()
    return jsonify(sessions)

@app.route('/sessions', methods=['POST'])
def create_session():
    """Create a new session"""
    data = request.get_json()
    session_id = secrets.token_urlsafe(8)
    
    # Create initial session with default settings
    session_data = {
        'id': session_id,
        'name': data['name'],
        'owner': data['owner'],
        'created_at': time.time(),
        'last_updated': time.time(),
        'settings': {
            'margin': 5,
            'maxRetries': 2,
            'players': [],
            'scoring': {
                'perfectScore': 1000,
                'marginPenalty': 100,
                'failurePenalty': 200,
                'minScore': -500
            }
        },
        'game_state': {
            'currentPlayerIndex': 0,
            'dice1': 0,
            'dice2': 0,
            'targetWeight': 0,
            'phase': 'setup',
            'attempts': 0
        }
    }
    
    session = session_manager.create_session(session_data)
    return jsonify(session.to_dict())

@app.route('/sessions/<session_id>', methods=['GET'])
def get_session(session_id):
    """Get session details"""
    session = session_manager.get_session(session_id)
    if not session:
        return jsonify({'error': 'Session not found'}), 404
    return jsonify(session)

@app.route('/sessions/<session_id>', methods=['PUT'])
def update_session(session_id):
    """Update session settings or game state"""
    data = request.get_json()
    session = session_manager.get_session(session_id)
    
    if not session:
        return jsonify({'error': 'Session not found'}), 404
        
    update_data = {}
    if 'settings' in data:
        update_data['settings'] = data['settings']
    if 'game_state' in data:
        update_data['game_state'] = data['game_state']
    
    update_data['last_updated'] = time.time()
    success = session_manager.update_session(session_id, update_data)
    
    if not success:
        return jsonify({'error': 'Failed to update session'}), 500
        
    return jsonify(session_manager.get_session(session_id))

@app.route('/sessions/<session_id>', methods=['DELETE'])
def delete_session(session_id):
    """Delete a session"""
    success = session_manager.delete_session(session_id)
    if not success:
        return jsonify({'error': 'Session not found'}), 404
    return jsonify({'success': True})

############################################

@app.route('/weight')
def get_weight():
    try:
        weight = scale.get_weight()
        return jsonify({'weight': weight})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/battery')
def get_battery():
    try:
        status = battery.get_status()
        return jsonify(status)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/tare', methods=['POST'])
def tare_scale():
    try:
        scale.tare()
        return jsonify({'success': True, 'message': 'Scale tared successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/reset', methods=['POST'])
def reset_scale():
    try:
        success = scale.reset_calibration()
        if success:
            return jsonify({'success': True, 'message': 'Scale reset to factory defaults'})
        return jsonify({'success': False, 'message': 'Failed to reset scale'})
    except Exception as e:
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
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    try:
        app.run(host='0.0.0.0', port=5000, debug=True)
    finally:
        scale.cleanup()
        battery.cleanup()