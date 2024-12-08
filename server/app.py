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

@app.route('/calibrate', methods=['POST'])
def calibrate():
    try:
        step = request.json.get('step')
        
        if step == 1:
            scale.tare()
            return jsonify({
                'success': True,
                'message': 'Zero point set. Please place the calibration weight.'
            })
        
        elif step == 2:
            scale.calibrate_with_known_weight()
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
        app.run(host='0.0.0.0', port=5000, use_reloader = False, debug=True)
    finally:
        scale.cleanup()