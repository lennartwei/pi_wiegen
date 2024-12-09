import RPi.GPIO as GPIO
import time
import statistics
import json
import os
from hx711 import HX711

class Scale:
    CALIBRATION_FILE = os.path.join(os.path.dirname(__file__), 'calibration.json')
    NUM_READINGS = 5  # Default number of readings
    DEFAULT_CALIBRATION = {
        'reference_unit': -399.3961653,
        'offset':  626476.6
    }
    
    def __init__(self, dout_pin=5, pd_sck_pin=6):
        self.dout_pin = dout_pin
        self.pd_sck_pin = pd_sck_pin
        self.calibration = self._load_calibration()
        self.init_scale()

    def _load_calibration(self):
        try:
            if os.path.exists(self.CALIBRATION_FILE):
                with open(self.CALIBRATION_FILE, 'r') as f:
                    data = json.load(f)
                    # Validate calibration data
                    if 'reference_unit' in data and 'offset' in data:
                        return data
        except Exception as e:
            print(f"Error loading calibration: {e}")
        
        # If file doesn't exist or is invalid, create it with default values
        self._save_calibration(self.DEFAULT_CALIBRATION)
        return self.DEFAULT_CALIBRATION

    def _save_calibration(self, calibration_data=None):
        try:
            if calibration_data is None:
                calibration_data = {
                    'reference_unit': self.hx.get_reference_unit(),
                    'offset': self.hx.get_offset()
                }
            
            # Ensure the directory exists
            os.makedirs(os.path.dirname(self.CALIBRATION_FILE), exist_ok=True)
            
            with open(self.CALIBRATION_FILE, 'w') as f:
                json.dump(calibration_data, f, indent=2)
        except Exception as e:
            print(f"Error saving calibration: {e}")

    def init_scale(self):
        try:
            self.hx = HX711(self.dout_pin, self.pd_sck_pin)
            self.hx.set_reference_unit(self.calibration['reference_unit'])
            self.hx.set_offset(self.calibration['offset'])
            self.hx.reset()
            time.sleep(0.1)
        except Exception as e:
            print(f"Error initializing scale: {e}")
            raise

    def get_weight(self, num_readings=None):
        try:
            val = self.hx.get_weight(self.NUM_READINGS)
            if val is not None and -10000 < val < 10000:  # Basic sanity check
                return round(val, 1)
            return 0
        except Exception as e:
            print(f"Error reading weight: {e}")
            self.init_scale()  # Try reinitializing on error
            return 0

    def tare(self):
        try:
            self.hx.tare(times=self.NUM_READINGS)
            time.sleep(0.2)  # Small delay for stability
            #self._save_calibration()
        except Exception as e:
            print(f"Error during tare: {e}")
            self.init_scale()
            raise

    def calibrate_with_known_weight(self, known_weight=100.0):
        try:
            # Take multiple readings of the known weight
            val = self.hx.get_weight(self.NUM_READINGS)
            
            if val is None or abs(val) < 1 or abs(val) > 10000:
                raise Exception("Invalid reading during calibration")

            # Calculate and set new reference unit
            current_ref = self.hx.get_reference_unit()
            new_ref = (current_ref * known_weight) / val
            self.hx.set_reference_unit(new_ref)
            
            # Save calibration
            self._save_calibration()
            
        except Exception as e:
            print(f"Error during calibration: {e}")
            self.init_scale()
            raise

    def reset_calibration(self):
        try:
            # Reset to default values
            self.hx.set_reference_unit(self.DEFAULT_CALIBRATION['reference_unit'])
            self.hx.set_offset(self.DEFAULT_CALIBRATION['offset'])
            self._save_calibration(self.DEFAULT_CALIBRATION)
            self.init_scale()
            return True
        except Exception as e:
            print(f"Error resetting calibration: {e}")
            return False

    def cleanup(self):
        try:
            GPIO.cleanup()
        except:
            pass