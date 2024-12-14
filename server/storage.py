from flask import jsonify
import json
import os
from pathlib import Path

class StorageManager:
    def __init__(self, base_path="/home/pi/pi_wiegen_by_bolt/data"):
        self.base_path = Path(base_path)
        self.base_path.mkdir(parents=True, exist_ok=True)
    
    def save_data(self, filename: str, data: dict) -> bool:
        try:
            file_path = self.base_path / filename
            with open(file_path, 'w') as f:
                json.dump(data, f, indent=2)
            return True
        except Exception as e:
            print(f"Error saving data: {e}")
            return False
    
    def load_data(self, filename: str) -> dict:
        try:
            file_path = self.base_path / filename
            if not file_path.exists():
                return None
            with open(file_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading data: {e}")
            return None

storage_manager = StorageManager()

def init_storage_routes(app):
    @app.route('/storage/save', methods=['POST'])
    def save_storage():
        try:
            data = request.get_json()
            filename = data.get('filename')
            content = data.get('data')
            
            if not filename or not content:
                return jsonify({'error': 'Missing filename or data'}), 400
            
            success = storage_manager.save_data(filename, content)
            if success:
                return jsonify({'success': True})
            return jsonify({'error': 'Failed to save data'}), 500
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/storage/load', methods=['GET'])
    def load_storage():
        try:
            filename = request.args.get('filename')
            if not filename:
                return jsonify({'error': 'Missing filename'}), 400
            
            data = storage_manager.load_data(filename)
            if data is None:
                return jsonify({'error': 'File not found'}), 404
            
            return jsonify(data)
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500