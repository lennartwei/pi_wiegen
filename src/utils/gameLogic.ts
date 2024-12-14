import { GameSettings, RoundScore } from '../types';

export function isValidWeight(measured: number, target: number, margin: number): boolean {
  const difference = Math.abs(Math.abs(measured) - target);
  return difference <= margin;
}

export function calculateScore(measured: number, target: number, settings: GameSettings): RoundScore {
  const deviation = Math.abs(Math.abs(measured) - target);
  const isPerfect = deviation === 0;
  let score = 0;

  if (isPerfect) {
    score = settings.scoring.perfectScore;
  } else if (deviation <= settings.margin) {
    // Within margin: Perfect score minus penalty per gram deviation
    score = settings.scoring.perfectScore - (deviation * settings.scoring.marginPenalty);
  } else {
    // Outside margin: Negative points based on how far off
    score = -(deviation * settings.scoring.failurePenalty);
  }

  // Ensure score doesn't go below minimum
  score = Math.max(score, settings.scoring.minScore);

  return {
    score: Math.round(score), // Round to nearest integer
    isPerfect,
    deviation
  };
}