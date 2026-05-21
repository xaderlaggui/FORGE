import { workoutTypeToSpriteMap } from './sprite-map';

export class WorkoutSpriteMapper {
  /**
   * Retrieves the designated static sprite ID for a given workout type.
   * If a workout type has multiple valid sprites, it randomly selects one,
   * but for consistency within a session, we usually want it deterministic.
   */
  public getSpriteForWorkout(workoutType: string): string {
    const typeLower = workoutType.toLowerCase().replace(' ', '_');

    if (typeLower.includes('push')) return 'overhead-press';
    if (typeLower.includes('pull')) return 'pull-ups';
    if (typeLower.includes('leg')) return 'leg-press';

    const validSprites = workoutTypeToSpriteMap[typeLower];

    if (validSprites && validSprites.length > 0) {
      // Pick the first one deterministically for zero-movement consistency
      return validSprites[0];
    }

    // Default fallback for unknown workout types
    return 'flex';
  }
}

export const workoutSpriteMapper = new WorkoutSpriteMapper();
