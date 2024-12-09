import RPi.GPIO as GPIO
import time
import statistics
import json
import os
from hx711 import HX711

class Scale:
    CALIBRATION_FILE = 'calibration.json'
    NUM_READINGS = 5  # Default number of readings
    
    def __init__(self, dout_pin=5, pd_sck_pin=6):
        self.dout_pin = dout_pin
        self.pd_sck_pin = pd_sck_pin
        self.calibration = self._load_calibration()
        self.init_scale()

    def _load_calibration(self):
        try:
            if os.path.exists(self.CALIBRATION_FILE):
                with open(self.CALIBRATION_FILE, 'r') as f:
                    return json.load(f)
        except Exception as e:
            print(f"Error loading calibration: {e}")
        return {'reference_unit': -320795.0 / 803.2, 'offset': 0}

    def _save_calibration(self):
        try:
            with open(self.CALIBRATION_FILE, 'w') as f:
                json.dump({
                    'reference_unit': self.hx.get_reference_unit(),
                    'offset': self.hx.get_offset()
                }, f)
        except Exception as e:
            print(f"Error saving calibration: {e}")

    def init_scale(self):
        try:
            self.hx = HX711(self.dout_pin, self.pd_sck_pin)
            self.hx.set_reading_format("MSB", "MSB")
            self.hx.set_reference_unit(self.calibration['reference_unit'])
            self.hx.set_offset(self.calibration['offset'])
            self.hx.reset()
            time.sleep(0.1)
        except Exception as e:
            print(f"Error initializing scale: {e}")
            raise

    def get_weight(self, num_readings=None):
        try:
            # Take multiple readings for stability using read_median
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
            # First tare the scale
            self.tare()
            time.sleep(1)  # Allow the scale to settle
            
            # Take multiple readings of the known weight
            val = self.hx.get_weight(self.NUM_READINGS)
            
            if val is None or abs(val) > 10000:
                raise Exception("Invalid reading during calibration")

            # Calculate and set new reference unit
            new_reference = (self.hx.get_reference_unit() * known_weight) / val
            self.hx.set_reference_unit(new_reference)
            self._save_calibration()
            
        except Exception as e:
            print(f"Error during calibration: {e}")
            self.init_scale()
            raise

    def cleanup(self):
        try:
            GPIO.cleanup()
        except:
            pass