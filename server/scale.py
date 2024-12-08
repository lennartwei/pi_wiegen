from hx711 import HX711
import time
import statistics
import json
import os
import RPi.GPIO as GPIO

class Scale:
    CALIBRATION_FILE = 'calibration.json'
    
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
        return {'reference_unit': 1, 'offset': 0}

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

    def get_weight(self, num_readings=5):
        values = []
        retries = 3
        
        while retries > 0 and len(values) < num_readings:
            try:
                # Use read_median for stable readings
                val = self.hx.get_weight(times=3)
                if val is not None and -10000 < val < 10000:  # Basic sanity check
                    values.append(val)
                time.sleep(0.1)
            except Exception as e:
                print(f"Error reading weight: {e}")
                retries -= 1
                if retries == 0:
                    self.init_scale()
                time.sleep(0.5)

        if not values:
            raise Exception("Unable to get stable reading")

        # Use median filtering to remove outliers
        if len(values) >= 3:
            mean = statistics.mean(values)
            stdev = statistics.stdev(values)
            filtered = [x for x in values if abs(x - mean) <= 2 * stdev]
            if filtered:
                return round(statistics.median(filtered), 1)

        return round(statistics.median(values), 1)

    def tare(self):
        try:
            self.hx.tare(times=15)  # Use built-in tare with 15 readings
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
            readings = []
            for _ in range(10):
                val = self.hx.get_weight(times=3)
                if val is not None and -10000 < val < 10000:
                    readings.append(val)
                time.sleep(0.1)

            if not readings:
                raise Exception("Unable to get stable calibration readings")

            # Calculate new reference unit using median reading
            median_reading = statistics.median(readings)
            new_reference = (self.hx.get_reference_unit() * known_weight) / median_reading
            
            # Update reference unit and save calibration
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