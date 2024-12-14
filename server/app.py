from flask import Flask, jsonify, request
from flask_cors import CORS
from scale import Scale
from battery import BatteryMonitor
import json
import os

app = Flask(__name__)
CORS(app)

# Initialize hardware
scale = Scale()
battery = BatteryMonitor()

# Data file paths
DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
PLAYER_STATS_FILE = os.path.join(DATA_DIR, 'player_stats.json')
SETTINGS_FILE = os.path.join(DATA_DIR, 'settings.json')

# Ensure data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

def load_data():
    try:
        if os.path.exists(PLAYER_STATS_FILE):
            with open(PLAYER_STATS_FILE, 'r') as f:
                player_stats = json.load(f)
        else:
            player_stats = []
            
        if os.path.exists(SETTINGS_FILE):
            with open(SETTINGS_FILE, 'r') as f:
                settings = json.load(f)
        else:
            settings = {
                "margin": 5,
                "players": [],
                "maxRetries": 2,
                "scoring": {
                    "perfectScore": 1000,
                    "marginPenalty": 100,
                    "failurePenalty": 200,
                    "minScore": -500
                }
            }
            
        return player_stats, settings
    except Exception as e:
        print(f"Error loading data: {e}")
        return [], {}

def save_data(player_stats, settings):
    try:
        with open(PLAYER_STATS_FILE, 'w') as f:
            json.dump(player_stats, f, indent=2)
        with open(SETTINGS_FILE, 'w') as f:
            json.dump(settings, f, indent=2)
        return True
    except Exception as e:
        print(f"Error saving data: {e}")
        return False

@app.route('/sync', methods=['GET', 'POST'])
def sync_data():
    if request.method == 'POST':
        try:
            data = request.get_json()
            save_data(data['playerStats'], data['settings'])
            return jsonify({'success': True})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        try:
            player_stats, settings = load_data()
            return jsonify({
                'playerStats': player_stats,
                'settings': settings
            })
        except Exception as e:
            return jsonify({'error': str(e)}), 500

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
        app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)
    finally:
        scale.cleanup()
        battery.cleanup()