import RPi.GPIO as GPIO
import time
from threading import Thread, Event

class JoystickController:
    JOYSTICK = {
        'up': 6,
        'down': 19,
        'left': 5,
        'right': 26
    }

    def __init__(self, callback=None):
        self.current_direction = 'right'
        self.callback = callback
        self.stop_event = Event()
        self._setup_gpio()
        self.thread = None

    def _setup_gpio(self):
        for pin in self.JOYSTICK.values():
            GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)

    def read_joystick(self):
        last_direction = None
        debounce_time = 0.2  # 200ms debounce
        last_emit_time = 0

        while not self.stop_event.is_set():
            new_direction = None
            current_time = time.time()
            
            if not GPIO.input(self.JOYSTICK['up']):
                new_direction = 'up'
            elif not GPIO.input(self.JOYSTICK['down']):
                new_direction = 'down'
            elif not GPIO.input(self.JOYSTICK['left']):
                new_direction = 'left'
            elif not GPIO.input(self.JOYSTICK['right']):
                new_direction = 'right'
            
            if (new_direction and 
                new_direction != last_direction and 
                current_time - last_emit_time >= debounce_time):
                self.current_direction = new_direction
                last_direction = new_direction
                last_emit_time = current_time
                if self.callback:
                    self.callback(new_direction)
            
            time.sleep(0.05)  # Reduced sleep time for better responsiveness

    def start(self):
        if not self.thread or not self.thread.is_alive():
            self.stop_event.clear()
            self.thread = Thread(target=self.read_joystick, daemon=True)
            self.thread.start()

    def stop(self):
        self.stop_event.set()
        if self.thread:
            self.thread.join()

    def cleanup(self):
        self.stop()
        # Don't cleanup GPIO here as it's shared with other components