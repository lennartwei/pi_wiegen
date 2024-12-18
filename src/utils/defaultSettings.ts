import { GameSettingPreset } from '../types';

export const DEFAULT_PRESETS: GameSettingPreset[] = [
  {
    id: 'beginner',
    name: 'Beginner',
    description: 'Larger margin and more retries for new players',
    margin: 8,
    maxRetries: 3,
    scoring: {
      perfectScore: 1000,
      marginPenalty: 50,
      failurePenalty: 100,
      minScore: -200
    }
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Balanced settings for casual play',
    margin: 5,
    maxRetries: 2,
    scoring: {
      perfectScore: 1000,
      marginPenalty: 100,
      failurePenalty: 200,
      minScore: -500
    }
  },
  {
    id: 'expert',
    name: 'Expert',
    description: 'Smaller margin and fewer retries for skilled players',
    margin: 3,
    maxRetries: 1,
    scoring: {
      perfectScore: 2000,
      marginPenalty: 200,
      failurePenalty: 400,
      minScore: -1000
    }
  }
];