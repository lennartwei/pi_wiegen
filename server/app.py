from flask import Flask, jsonify, request
from flask_cors import CORS
from scale import Scale
import json

app = Flask(__name__)
CORS(app)

# Initialize scale
scale = Scale()

@app.route('/weight')
def get_weight():
    try:
        weight = scale.get_weight()
        return jsonify({'weight': weight})
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