import struct
import smbus
import RPi.GPIO as GPIO
from threading import Lock

class BatteryMonitor:
    CW2015_ADDRESS = 0X62
    CW2015_REG_VCELL = 0X02
    CW2015_REG_SOC = 0X04
    CW2015_REG_MODE = 0X0A
    POWER_DETECT_PIN = 4

    def __init__(self):
        self._bus = smbus.SMBus(1)
        self._lock = Lock()
        
        # Initialize GPIO
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        GPIO.setup(self.POWER_DETECT_PIN, GPIO.IN)
        
        # Initialize CW2015
        self._quick_start()

    def _quick_start(self):
        """Wake up the CW2015 and initialize fuel-gauge calculations"""
        with self._lock:
            self._bus.write_word_data(self.CW2015_ADDRESS, self.CW2015_REG_MODE, 0x30)

    def read_voltage(self):
        """Read battery voltage"""
        with self._lock:
            try:
                read = self._bus.read_word_data(self.CW2015_ADDRESS, self.CW2015_REG_VCELL)
                swapped = struct.unpack("<H", struct.pack(">H", read))[0]
                return round(swapped * 0.305 / 1000, 2)
            except:
                return 0.0

    def read_capacity(self):
        """Read battery capacity percentage"""
        with self._lock:
            try:
                read = self._bus.read_word_data(self.CW2015_ADDRESS, self.CW2015_REG_SOC)
                swapped = struct.unpack("<H", struct.pack(">H", read))[0]
                return round(swapped / 256)
            except:
                return 0

    def is_power_plugged(self):
        """Check if power adapter is plugged in"""
        return GPIO.input(self.POWER_DETECT_PIN) == GPIO.HIGH

    def get_status(self):
        """Get complete battery status"""
        voltage = self.read_voltage()
        capacity = self.read_capacity()
        is_plugged = self.is_power_plugged()
        
        return {
            'voltage': voltage,
            'capacity': capacity,
            'is_plugged': is_plugged,
            'is_low': capacity < 5,
            'is_full': capacity >= 100
        }

    def cleanup(self):
        """Cleanup GPIO resources"""
        GPIO.cleanup(self.POWER_DETECT_PIN)