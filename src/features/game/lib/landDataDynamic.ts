import Decimal from "decimal.js-light";
import { Bumpkin, GameState } from "../types/game";
import { LEVEL_EXPERIENCE } from "./level";
import { BumpkinLevel } from "features/game/lib/level";
import { INITIAL_BUMPKIN_LEVEL, INITIAL_EXPANSIONS } from "./bumpkinData";
import { getEnabledNodeCount } from "../expansion/lib/expansionNodes";
import { TEST_BUMPKIN } from "./bumpkinData";
import { STATIC_OFFLINE_FARM } from "./landDataStatic";
import { getBuildingBumpkinLevelRequired } from "../expansion/lib/buildingRequirements";
import { INITIAL_RESOURCES } from "./constants";

function getInitialNodes(name: string) {
  let count = getEnabledNodeCount(INITIAL_BUMPKIN_LEVEL as BumpkinLevel, name);
  let x = -1;
  let y = 9;

  if (INITIAL_EXPANSIONS < 4) {
    count = name === "Stone Rock" ? 2 : 0;
    x = 3;
    y = 7;
  }
  if (INITIAL_EXPANSIONS >= 9) {
    x = -7;
  }

  if (count === 0) return {};

  if (name === "Iron Rock") x += 1;
  if (name === "Gold Rock") x += 2;

  return [...Array(count).keys()].reduce(
    (acc, _, i) => ({
      ...acc,
      [i + 1]: {
        stone: { amount: 1, minedAt: 0 },
        x: x,
        y: y - i,
        height: 1,
        width: 1,
      },
    }),
    {},
  );
}

function getBuildings() {
  const buildings = {
    ...STATIC_OFFLINE_FARM["buildings"],
  };

  // Add and pre-fill built composters 1 level after unlock.
  if (
    INITIAL_BUMPKIN_LEVEL >=
    1 + getBuildingBumpkinLevelRequired("Compost Bin")
  ) {
    buildings["Compost Bin"] = [
      {
        coordinates: { x: 2, y: 8 },
        createdAt: 0,
        id: "123",
        readyAt: 0,
        requires: {
          Sunflower: 5,
        },
        producing: {
          items: { "Fruitful Blend": 10, "Red Wiggler": 3 },

          readyAt: Date.now() + 30000,
          startedAt: Date.now() - 50000 - 8 * 60 * 60 * 1000,
        },
      },
    ];
  }
  if (
    INITIAL_BUMPKIN_LEVEL >=
    1 + getBuildingBumpkinLevelRequired("Turbo Composter")
  ) {
    buildings["Turbo Composter"] = [
      {
        coordinates: { x: 0, y: 8 },
        createdAt: 0,
        id: "123",
        readyAt: 0,
        requires: { Apple: 1 },
        producing: {
          items: { "Fruitful Blend": 10, "Red Wiggler": 3 },

          readyAt: Date.now() + 30000,
          startedAt: Date.now() - 50000 - 8 * 60 * 60 * 1000,
        },
      },
    ];
  }
  if (
    INITIAL_BUMPKIN_LEVEL >=
    1 + getBuildingBumpkinLevelRequired("Premium Composter")
  ) {
    buildings["Premium Composter"] = [
      {
        coordinates: { x: -2, y: 8 },
        createdAt: 0,
        id: "123",
        readyAt: 0,
        producing: {
          items: { "Rapid Root": 10, Grub: 3 },

          readyAt: Date.now() + 30000,
          startedAt: Date.now() - 50000 - 12 * 60 * 60 * 1000,
        },
      },
    ];
  }

  return buildings;
}

function getInventory() {
  const inventory = {
    ...STATIC_OFFLINE_FARM["inventory"],
  };

  // Add composters to inventory as soon as they unlock.
  if (INITIAL_BUMPKIN_LEVEL >= getBuildingBumpkinLevelRequired("Compost Bin")) {
    inventory["Compost Bin"] = new Decimal(1);
  }
  if (
    INITIAL_BUMPKIN_LEVEL >= getBuildingBumpkinLevelRequired("Turbo Composter")
  ) {
    inventory["Turbo Composter"] = new Decimal(1);
  }
  if (
    INITIAL_BUMPKIN_LEVEL >=
    getBuildingBumpkinLevelRequired("Premium Composter")
  ) {
    inventory["Premium Composter"] = new Decimal(1);
  }

  return inventory;
}

const DYNAMIC_INITIAL_RESOURCES: Pick<
  GameState,
  "crops" | "trees" | "stones" | "iron" | "gold" | "fruitPatches"
> = {
  ...INITIAL_RESOURCES,
  stones: getInitialNodes("Stone Rock"),
  iron: getInitialNodes("Iron Rock"),
  gold: getInitialNodes("Gold Rock"),
};

const DYNAMIC_INITIAL_BUMPKIN: Bumpkin = {
  ...TEST_BUMPKIN,
  experience: LEVEL_EXPERIENCE[INITIAL_BUMPKIN_LEVEL as BumpkinLevel],
};

export const DYNAMIC_OFFLINE_FARM: GameState = {
  ...STATIC_OFFLINE_FARM,
  ...DYNAMIC_INITIAL_RESOURCES,
  buildings: getBuildings(),
  bumpkin: DYNAMIC_INITIAL_BUMPKIN,
  inventory: getInventory(),
};
