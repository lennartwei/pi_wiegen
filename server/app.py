from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from scale import Scale
from battery import BatteryMonitor
import json

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize hardware
scale = Scale()
battery = BatteryMonitor()

# Game state
game_state = {
    'currentPlayer': None,
    'dice1': 0,
    'dice2': 0,
    'phase': 'rolling',
    'attempts': 0,
    'targetWeight': 0
}

def broadcast_state():
    """Broadcast the current game state to all connected clients"""
    socketio.emit('gameState', game_state)

@socketio.on('connect')
def handle_connect():
    """Send current state to newly connected clients"""
    emit('gameState', game_state)

@socketio.on('updateGameState')
def handle_state_update(new_state):
    """Handle game state updates from clients"""
    game_state.update(new_state)
    broadcast_state()

@app.route('/weight')
def get_weight():
    try:
        weight = scale.get_weight()
        socketio.emit('weight', {'weight': weight})  # Broadcast weight to all clients
        return jsonify({'weight': weight})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/battery')
def get_battery():
    try:
        status = battery.get_status()
        socketio.emit('battery', status)  # Broadcast battery status to all clients
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
        socketio.run(app, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True, debug=True, use_reloader=False)
    finally:
        scale.cleanup()
        battery.cleanup()