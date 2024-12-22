from flask_socketio import SocketIO
from threading import Lock

class WebSocketManager:
    def __init__(self):
        self.socketio = SocketIO()
        self._lock = Lock()
        
    def init_app(self, app):
        self.socketio.init_app(app, cors_allowed_origins="*")
        
    def emit_joystick(self, direction):
        with self._lock:
            self.socketio.emit('joystick_event', {'direction': direction})
            
    def emit_weight(self, weight):
        with self._lock:
            self.socketio.emit('weight_update', {'weight': weight})
            
    def run(self, app, host='0.0.0.0', port=5000):
        self.socketio.run(app, host=host, port=port)