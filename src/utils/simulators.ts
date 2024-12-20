// Simulated battery values
let simulatedBatteryLevel = 85;
let simulatedCharging = false;

// Simulated weight values
let simulatedWeight = 0;
let isTared = false;
const baseNoise = () => (Math.random() - 0.5) * 0.4;

export function simulateBatteryStatus() {
  // Randomly adjust battery level
  if (!simulatedCharging) {
    simulatedBatteryLevel -= Math.random() * 0.1;
  } else {
    simulatedBatteryLevel += Math.random() * 0.2;
    if (simulatedBatteryLevel > 100) simulatedBatteryLevel = 100;
  }

  // Occasionally toggle charging state
  if (Math.random() < 0.01) {
    simulatedCharging = !simulatedCharging;
  }

  return {
    voltage: 3.7 + (simulatedBatteryLevel / 100) * 0.8,
    capacity: Math.round(simulatedBatteryLevel),
    is_plugged: simulatedCharging,
    is_low: simulatedBatteryLevel < 15,
    is_full: simulatedBatteryLevel > 95
  };
}

export function simulateWeight(withNoise = true) {
  if (withNoise) {
    return simulatedWeight + baseNoise();
  }
  return simulatedWeight;
}

export function simulateTare() {
  isTared = true;
  simulatedWeight = 0;
  return true;
}

export function simulateAddWeight(weight: number) {
  simulatedWeight = weight;
}