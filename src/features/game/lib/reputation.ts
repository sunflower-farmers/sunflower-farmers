import { getKeys } from "../types/decorations";
import { GameState } from "../types/game";
import { getBumpkinLevel } from "./level";
import { hasVipAccess } from "./vipAccess";

export enum Reputation {
  Beginner = 0,
  Sprout = 1,
  Seedling = 2,
  Grower = 3,
  Cropkeeper = 4,
  GrandHarvester = 5,
}

export const REPUTATION_NAME: Record<Reputation, string> = {
  [Reputation.Beginner]: "Beginner",
  [Reputation.Sprout]: "Sprout",
  [Reputation.Seedling]: "Seedling",
  [Reputation.Grower]: "Grower",
  [Reputation.Cropkeeper]: "Cropkeeper",
  [Reputation.GrandHarvester]: "Grand Harvester",
};

export const REPUTATION_TIERS: Record<Reputation, number> = {
  [Reputation.Beginner]: 0,
  [Reputation.Sprout]: 100,
  [Reputation.Seedling]: 250,
  [Reputation.Grower]: 350,
  [Reputation.Cropkeeper]: 600,
  [Reputation.GrandHarvester]: 1000,
};

export const REPUTATION_POINTS = {
  SpringIsland: 100,
  DesertIsland: 50,
  VolcanoIsland: 50,
  Discord: 100,
  ProofOfHumanity: 100,
  Level100: 150,
  Bud: 300,
  VIP: 600,
};

export const REPUTATION_TASKS: Record<
  keyof typeof REPUTATION_POINTS,
  ({ game }: { game: GameState }) => boolean
> = {
  SpringIsland: ({ game }) => game.island.type !== "basic",
  DesertIsland: ({ game }) =>
    game.island.type !== "basic" && game.island.type !== "spring",
  VolcanoIsland: ({ game }) =>
    game.island.type !== "basic" &&
    game.island.type !== "spring" &&
    game.island.type !== "desert",
  Discord: ({ game }) => !!game.wardrobe["Companion Cap"],
  ProofOfHumanity: ({ game }) => false, // TODO
  Level100: ({ game }) => getBumpkinLevel(game.bumpkin.experience) >= 100,
  Bud: ({ game }) => getKeys(game.buds ?? {}).length > 0,
  VIP: ({ game }) => hasVipAccess(game.inventory),
};

export function getReputationPoints({ game }: { game: GameState }): number {
  let points = 0;

  for (const [key, task] of Object.entries(REPUTATION_TASKS)) {
    if (task({ game })) {
      points += REPUTATION_POINTS[key as keyof typeof REPUTATION_POINTS];
    }
  }

  return points;
}

export function getReputation({ game }: { game: GameState }): Reputation {
  const points = getReputationPoints({ game });

  // Get the highest tier that the player has reached
  const tier = getKeys(REPUTATION_TIERS)
    .reverse()
    .find(
      (tier) => points >= REPUTATION_TIERS[tier as Reputation],
    ) as Reputation;

  return tier || Reputation.Sprout;
}

export function hasReputation({
  game,
  reputation,
}: {
  game: GameState;
  reputation: Reputation;
}) {
  const playerReputation = getReputation({ game });
  return playerReputation >= reputation;
}

export function getRemainingTrades({ game }: { game: GameState }) {
  const playerReputation = getReputation({ game });

  // 3 Trades in Total
  if (playerReputation <= Reputation.Sprout) {
    return 0;
  }

  // 10 Trades in Total
  if (playerReputation <= Reputation.Seedling) {
    return 0;
  }

  // 3 Trades per day
  if (playerReputation <= Reputation.Grower) {
    return 0;
  }

  // 20 Trades in Total
  if (playerReputation <= Reputation.Cropkeeper) {
    return 0;
  }

  // Infinite Trades
  return 0;
}
