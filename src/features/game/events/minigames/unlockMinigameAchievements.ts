import { GameState } from "features/game/types/game";
import {
  MinigameName,
  SUPPORTED_MINIGAMES,
} from "features/game/types/minigames";

import cloneDeep from "lodash.clonedeep";

export type UnlockMinigameAchievementsAction = {
  type: "minigame.achievementsUnlocked";
  id: MinigameName;
  achievementNames: string[];
};

type Options = {
  state: Readonly<GameState>;
  action: UnlockMinigameAchievementsAction;
  createdAt?: number;
};

export function unlockMinigameAchievements({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep<GameState>(state);

  if (!SUPPORTED_MINIGAMES.includes(action.id)) {
    throw new Error(`${action.id} is not a valid minigame`);
  }

  const minigames = (game.minigames ?? {}) as Required<GameState>["minigames"];

  const minigame = minigames.games[action.id] ?? {
    history: {},
    highscore: 0,
  };

  // Filter out achievements that have already been unlocked and log an error for each one
  const alreadyUnlockedAchievements = action.achievementNames.filter(
    (achievementName) => minigame.achievements?.[achievementName],
  );
  alreadyUnlockedAchievements.forEach((achievementName) => {
    // eslint-disable-next-line no-console
    console.error(`Achievement "${achievementName}" already unlocked`);
  });

  // if all achievements have already been unlocked, return early
  const newAchievements = action.achievementNames.filter(
    (achievementName) => !minigame.achievements?.[achievementName],
  );
  if (newAchievements.length === 0) return game;

  // unlock all new achievements
  newAchievements.forEach((achievementName) => {
    minigame.achievements = {
      ...(minigame?.achievements ?? {}),
      [achievementName]: {
        unlockedAt: createdAt,
      },
    };
  });
  minigames.games[action.id] = minigame;

  return game;
}
