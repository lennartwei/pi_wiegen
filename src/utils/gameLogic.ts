// Utility functions for game logic
export function isValidWeight(measured: number, target: number, margin: number): boolean {
    const difference = Math.abs(Math.abs(measured) - target);
    return difference <= margin;
  }