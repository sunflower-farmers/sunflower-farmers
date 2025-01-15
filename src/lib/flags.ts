import type { GameState } from "features/game/types/game";
import { CONFIG } from "lib/config";

const adminFeatureFlag = ({ wardrobe, inventory }: GameState) =>
  CONFIG.NETWORK === "amoy" ||
  (!!((wardrobe["Gift Giver"] ?? 0) > 0) && !!inventory["Beta Pass"]?.gt(0));

const defaultFeatureFlag = ({ inventory }: GameState) =>
  CONFIG.NETWORK === "amoy" || !!inventory["Beta Pass"]?.gt(0);

const testnetFeatureFlag = () => CONFIG.NETWORK === "amoy";

const timeBasedFeatureFlag = (date: Date) => () => {
  return testnetFeatureFlag() || Date.now() > date.getTime();
};

const betaTimeBasedFeatureFlag = (date: Date) => (game: GameState) => {
  return defaultFeatureFlag(game) || Date.now() > date.getTime();
};

const timePeriodFeatureFlag =
  ({ start, end }: { start: Date; end: Date }) =>
  () => {
    return Date.now() > start.getTime() && Date.now() < end.getTime();
  };

// Used for testing production features
export const ADMIN_IDS = [1, 3, 51, 39488, 128727];
/**
 * Adam: 1
 * Spencer: 3
 * Sacul: 51
 * Craig: 39488
 * Elias: 128727
 */

export type FeatureFlag = (game: GameState) => boolean;

export type ExperimentName = "ONBOARDING_CHALLENGES" | "GEM_BOOSTS";

/*
 * How to Use:
 * Add the feature name to this list when working on a new feature.
 * When the feature is ready for public release, delete the feature from this list.
 *
 * Do not delete JEST_TEST.
 */
const featureFlags = {
  CHORE_BOARD: betaTimeBasedFeatureFlag(new Date("2024-11-01T00:00:00Z")),
  ONBOARDING_REWARDS: (game: GameState) =>
    game.experiments.includes("ONBOARDING_CHALLENGES"),
  SEASONAL_TIERS: timeBasedFeatureFlag(new Date("2024-11-01T00:00:00Z")),
  CROP_QUICK_SELECT: () => false,
  PORTALS: testnetFeatureFlag,
  JEST_TEST: defaultFeatureFlag,
  EASTER: () => false, // To re-enable next easter
  SKILLS_REVAMP: adminFeatureFlag,
  FSL: betaTimeBasedFeatureFlag(new Date("2024-10-10T00:00:00Z")),
  ANIMAL_BUILDINGS: betaTimeBasedFeatureFlag(new Date("2024-11-04T00:00:00Z")),
  BARLEY: betaTimeBasedFeatureFlag(new Date("2024-11-04T00:00:00Z")),
  CHICKEN_GARBO: betaTimeBasedFeatureFlag(new Date("2024-11-04T00:00:00Z")),
  CRAFTING_BOX: betaTimeBasedFeatureFlag(new Date("2024-11-04T00:00:00Z")),
  FLOWER_BOUNTIES: timeBasedFeatureFlag(new Date("2024-11-01T00:00:00Z")),
  BEDS: timeBasedFeatureFlag(new Date("2024-11-04T00:00:00Z")),
  BULL_RUN_PLAZA: betaTimeBasedFeatureFlag(new Date("2024-11-01T00:00:00Z")),
  BALE_AOE_END: betaTimeBasedFeatureFlag(new Date("2024-11-04T00:00:00Z")),
  HALLOWEEN_2024: defaultFeatureFlag,
  CHRISTMAS_2024: timePeriodFeatureFlag({
    start: new Date("2024-12-12T00:00:00Z"),
    end: new Date("2024-12-28T00:00:00Z"),
  }),
  ANIMAL_COMPETITION: betaTimeBasedFeatureFlag(
    new Date("2024-12-18T00:00:00Z"),
  ),
  TEMPERATE_SEASON: testnetFeatureFlag,
  PIZZA_SPEED_UP_RESTRICTION: timePeriodFeatureFlag({
    start: new Date("2024-12-18T00:00:00Z"),
    end: new Date("2025-01-31T00:00:00Z"),
  }),
  WEATHER_SHOP: testnetFeatureFlag,
  FRUIT_PATCH_QUICK_SELECT: defaultFeatureFlag,
  SEASONAL_EVENTS_NOTIFICATIONS: testnetFeatureFlag,
  SEASONAL_SEEDS: testnetFeatureFlag,
} satisfies Record<string, FeatureFlag>;

export type FeatureName = keyof typeof featureFlags;

export const hasFeatureAccess = (game: GameState, featureName: FeatureName) => {
  return featureFlags[featureName](game);
};
