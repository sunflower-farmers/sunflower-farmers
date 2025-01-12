import Decimal from "decimal.js-light";
import { fromWei } from "web3-utils";
import {
  Bumpkin,
  GameState,
  Inventory,
  ExpansionConstruction,
  PlacedItem,
  BB_TO_GEM_RATIO,
  InventoryItemName,
} from "../types/game";
import { getKeys } from "../types/craftables";
import { BumpkinParts, tokenUriBuilder } from "lib/utils/tokenUriBuilder";
import { Equipped } from "../types/bumpkin";
import { SeedName } from "../types/seeds";
import { INITIAL_REWARDS } from "../types/rewards";
import { makeAnimalBuilding } from "./animals";
import { ChoreBoard } from "../types/choreBoard";
import { getSeasonalTicket } from "../types/seasons";

// Our "zoom" factor
export const PIXEL_SCALE = 2.625;

// How many pixels a raw green square is
export const SQUARE_WIDTH = 16;

export const GRID_WIDTH_PX = PIXEL_SCALE * SQUARE_WIDTH;

export const CHICKEN_TIME_TO_EGG = 1000 * 60 * 60 * 24 * 2; // 48 hours
export const MUTANT_CHICKEN_BOOST_AMOUNT = 0.1;
export const HEN_HOUSE_CAPACITY = 10;
export const CHICKEN_COOP_MULTIPLIER = 1.5;

export const POPOVER_TIME_MS = 1000;

export const makeMegaStoreAvailableDates = () => {
  const now = new Date();

  const currentMonthStart = new Date(now);
  const nextMonthStart = new Date(now);

  // Set "from" as the first day of the current month
  currentMonthStart.setUTCDate(1);
  currentMonthStart.setUTCHours(0, 0, 0, 0);

  // Set "to" as the first day of the next month
  nextMonthStart.setUTCMonth(nextMonthStart.getMonth() + 1);
  nextMonthStart.setUTCDate(1);
  nextMonthStart.setUTCHours(0, 0, 0, 0);

  return {
    from: currentMonthStart.getTime(),
    to: nextMonthStart.getTime(),
  };
};

export function isBuildingReady(building: PlacedItem[]) {
  return building.some((b) => b.readyAt <= Date.now());
}

export type StockableName = Extract<
  InventoryItemName,
  | "Axe"
  | "Pickaxe"
  | "Stone Pickaxe"
  | "Iron Pickaxe"
  | "Gold Pickaxe"
  | "Oil Drill"
  | "Rod"
  | "Sunflower Seed"
  | "Potato Seed"
  | "Pumpkin Seed"
  | "Carrot Seed"
  | "Cabbage Seed"
  | "Soybean Seed"
  | "Beetroot Seed"
  | "Cauliflower Seed"
  | "Parsnip Seed"
  | "Eggplant Seed"
  | "Corn Seed"
  | "Radish Seed"
  | "Wheat Seed"
  | "Kale Seed"
  | "Barley Seed"
  | "Grape Seed"
  | "Olive Seed"
  | "Rice Seed"
  | "Tomato Seed"
  | "Blueberry Seed"
  | "Orange Seed"
  | "Apple Seed"
  | "Banana Plant"
  | "Lemon Seed"
  | "Sunpetal Seed"
  | "Bloom Seed"
  | "Lily Seed"
  | "Sand Shovel"
  | "Sand Drill"
>;

export const INITIAL_STOCK = (
  state?: GameState,
): Record<StockableName, Decimal> => {
  const tools = {
    Axe: new Decimal(200),
    Pickaxe: new Decimal(60),
    "Stone Pickaxe": new Decimal(20),
    "Iron Pickaxe": new Decimal(5),
    "Gold Pickaxe": new Decimal(5),
    Rod: new Decimal(50),
    "Oil Drill": new Decimal(5),
  };

  // increase in 50% tool stock if you have a toolshed
  if (state?.buildings.Toolshed && isBuildingReady(state.buildings.Toolshed)) {
    getKeys(tools).forEach(
      (tool) =>
        (tools[tool] = new Decimal(Math.ceil(tools[tool].mul(1.5).toNumber()))),
    );
  }

  // increase Axe stock by 50 if player has More Axes skill
  if (state?.bumpkin?.skills["More Axes"]) {
    tools.Axe = new Decimal(Math.ceil(tools.Axe.toNumber() + 50));
  }

  if (state?.bumpkin?.skills["More Picks"]) {
    tools.Pickaxe = tools.Pickaxe.add(new Decimal(70));
    tools["Stone Pickaxe"] = tools["Stone Pickaxe"].add(new Decimal(20));
    tools["Iron Pickaxe"] = tools["Iron Pickaxe"].add(new Decimal(7));
  }

  const seeds: Record<SeedName, Decimal> = {
    "Sunflower Seed": new Decimal(400),
    "Potato Seed": new Decimal(200),
    "Pumpkin Seed": new Decimal(150),
    "Carrot Seed": new Decimal(100),
    "Cabbage Seed": new Decimal(90),
    "Soybean Seed": new Decimal(90),
    "Beetroot Seed": new Decimal(80),
    "Cauliflower Seed": new Decimal(80),
    "Parsnip Seed": new Decimal(60),
    "Eggplant Seed": new Decimal(50),
    "Corn Seed": new Decimal(50),
    "Radish Seed": new Decimal(40),
    "Wheat Seed": new Decimal(40),
    "Kale Seed": new Decimal(30),
    "Barley Seed": new Decimal(30),

    "Grape Seed": new Decimal(10),
    "Olive Seed": new Decimal(10),
    "Rice Seed": new Decimal(10),

    "Tomato Seed": new Decimal(10),
    "Blueberry Seed": new Decimal(10),
    "Orange Seed": new Decimal(10),
    "Apple Seed": new Decimal(10),
    "Banana Plant": new Decimal(10),
    "Lemon Seed": new Decimal(10),

    "Sunpetal Seed": new Decimal(16),
    "Bloom Seed": new Decimal(8),
    "Lily Seed": new Decimal(4),
  };

  if (
    state?.buildings.Warehouse &&
    isBuildingReady(state.buildings.Warehouse)
  ) {
    // Multiply each seed quantity by 1.2 and round up
    getKeys(seeds).forEach(
      (seed) =>
        (seeds[seed] = new Decimal(Math.ceil(seeds[seed].mul(1.2).toNumber()))),
    );
  }

  return {
    // Tools
    ...tools,

    "Sand Shovel": new Decimal(50),
    "Sand Drill": new Decimal(10),
    // Seeds
    ...seeds,
  };
};

export const INVENTORY_LIMIT = (state?: GameState): Inventory => {
  const seeds: Record<SeedName, Decimal> = {
    "Sunflower Seed": new Decimal(1000),
    "Potato Seed": new Decimal(500),
    "Pumpkin Seed": new Decimal(400),
    "Carrot Seed": new Decimal(250),
    "Cabbage Seed": new Decimal(240),
    "Soybean Seed": new Decimal(240),
    "Beetroot Seed": new Decimal(220),
    "Cauliflower Seed": new Decimal(200),
    "Parsnip Seed": new Decimal(150),
    "Eggplant Seed": new Decimal(120),
    "Corn Seed": new Decimal(120),
    "Radish Seed": new Decimal(100),
    "Wheat Seed": new Decimal(100),
    "Kale Seed": new Decimal(80),
    "Barley Seed": new Decimal(80),

    "Tomato Seed": new Decimal(50),
    "Lemon Seed": new Decimal(45),
    "Blueberry Seed": new Decimal(40),
    "Orange Seed": new Decimal(33),
    "Apple Seed": new Decimal(25),
    "Banana Plant": new Decimal(25),

    "Rice Seed": new Decimal(50),
    "Grape Seed": new Decimal(50),
    "Olive Seed": new Decimal(50),

    "Sunpetal Seed": new Decimal(40),
    "Bloom Seed": new Decimal(20),
    "Lily Seed": new Decimal(10),
  };

  if (
    state?.buildings["Warehouse"] &&
    isBuildingReady(state?.buildings["Warehouse"])
  ) {
    // Multiply each seed quantity by 1.2 and round up
    getKeys(seeds).forEach(
      (seed) =>
        (seeds[seed] = new Decimal(Math.ceil(seeds[seed].mul(1.2).toNumber()))),
    );
  }

  if (state?.bumpkin.skills["Crime Fruit"]) {
    seeds["Tomato Seed"] = seeds["Tomato Seed"].add(10);
    seeds["Lemon Seed"] = seeds["Lemon Seed"].add(10);
  }

  return seeds;
};

export const INITIAL_GOLD_MINES: GameState["gold"] = {
  0: {
    stone: {
      amount: 0.1,
      minedAt: 0,
    },
    x: -4,
    y: 2,
    height: 1,
    width: 1,
  },
};

export const INITIAL_EXPANSION_IRON: GameState["iron"] = {
  0: {
    stone: {
      amount: 0.1,
      minedAt: 0,
    },
    x: 2,
    y: -1,
    height: 1,
    width: 1,
  },
};

export const GENESIS_LAND_EXPANSION: ExpansionConstruction = {
  createdAt: 1,
  readyAt: 0,
};

export const TREE_RECOVERY_TIME = 2 * 60 * 60;
export const STONE_RECOVERY_TIME = 4 * 60 * 60;
export const IRON_RECOVERY_TIME = 8 * 60 * 60;
export const GOLD_RECOVERY_TIME = 24 * 60 * 60;
export const CRIMSTONE_RECOVERY_TIME = 24 * 60 * 60;
export const SUNSTONE_RECOVERY_TIME = 3 * 24 * 60 * 60;

export const INITIAL_RESOURCES: Pick<
  GameState,
  | "crops"
  | "trees"
  | "stones"
  | "iron"
  | "gold"
  | "fruitPatches"
  | "flowers"
  | "crimstones"
  | "sunstones"
  | "beehives"
  | "oilReserves"
> = {
  crops: {},
  trees: {
    1: {
      createdAt: Date.now(),
      wood: {
        amount: 2,
        choppedAt: 0,
      },
      x: -3,
      y: 3,
      height: 2,
      width: 2,
    },
    2: {
      createdAt: Date.now(),
      wood: {
        amount: 1,
        choppedAt: 0,
      },
      x: 5,
      y: 0,
      height: 2,
      width: 2,
    },

    3: {
      createdAt: Date.now(),
      wood: {
        amount: 2,
        choppedAt: 0,
      },
      x: 7,
      y: 9,
      height: 2,
      width: 2,
    },
  },
  stones: {
    1: {
      createdAt: Date.now(),
      stone: {
        amount: 1,
        minedAt: 0,
      },
      x: 7,
      y: 5,
      height: 1,
      width: 1,
    },
    2: {
      createdAt: Date.now(),
      stone: {
        amount: 1,
        minedAt: 0,
      },
      x: 3,
      y: 6,
      height: 1,
      width: 1,
    },
  },
  fruitPatches: {},
  gold: {},
  iron: {},
  crimstones: {},
  flowers: {
    discovered: {},
    flowerBeds: {},
  },
  sunstones: {},
  beehives: {},
  oilReserves: {},
};

export const INITIAL_EXPANSIONS = 3;

export const INITIAL_EQUIPMENT: BumpkinParts = {
  background: "Farm Background",
  body: "Beige Farmer Potion",
  hair: "Basic Hair",
  shoes: "Black Farmer Boots",
  pants: "Farmer Overalls",
  tool: "Farmer Pitchfork",
  shirt: "Red Farmer Shirt",
};

export const INITIAL_BUMPKIN: Bumpkin = {
  equipped: INITIAL_EQUIPMENT as Equipped,
  experience: 0,

  id: 1,
  skills: {},
  tokenUri: `1_${tokenUriBuilder(INITIAL_EQUIPMENT)}`,
  achievements: {},

  activity: {},
};

export const INITIAL_CHORE_BOARD: ChoreBoard = {
  chores: {
    "pumpkin' pete": {
      name: "CHOP_1_TREE",
      reward: { items: { [getSeasonalTicket()]: 1 } },
      initialProgress: 0,
      startedAt: Date.now(),
    },
    betty: {
      name: "CHOP_2_TREE",
      reward: { items: { [getSeasonalTicket()]: 2 } },
      initialProgress: 0,
      startedAt: Date.now(),
    },
    finley: {
      name: "CHOP_1_TREE",
      reward: { items: { [getSeasonalTicket()]: 2 } },
      initialProgress: 0,
      startedAt: Date.now(),
    },
  },
};

export const INITIAL_FARM: GameState = {
  coins: 0,
  balance: new Decimal(0),
  previousBalance: new Decimal(0),
  inventory: {
    Marty: new Decimal(2),
    Miffy: new Decimal(2),
    Morty: new Decimal(2),
    Mog: new Decimal(2),
    "Lifetime Farmer Banner": new Decimal(1),
    "Town Center": new Decimal(1),
    Market: new Decimal(1),
    Workbench: new Decimal(1),
    "Basic Land": new Decimal(INITIAL_EXPANSIONS),
    "Crop Plot": new Decimal(getKeys(INITIAL_RESOURCES.crops).length),
    Tree: new Decimal(getKeys(INITIAL_RESOURCES.trees).length),
    "Stone Rock": new Decimal(getKeys(INITIAL_RESOURCES.stones).length),
    Axe: new Decimal(10),
    Gem: new Decimal(1 * BB_TO_GEM_RATIO),
    Rug: new Decimal(1),
    Wardrobe: new Decimal(1),
    Shovel: new Decimal(1),
  },
  previousInventory: {},
  wardrobe: {},
  previousWardrobe: {},
  bank: { taxFreeSFL: 0 },

  calendar: {
    dates: [],
  },

  choreBoard: INITIAL_CHORE_BOARD,

  competitions: {
    progress: {},
  },

  shipments: {},
  gems: {},

  bumpkin: INITIAL_BUMPKIN,

  rewards: INITIAL_REWARDS,

  minigames: {
    games: {},
    prizes: {},
  },

  megastore: {
    available: {
      from: 0,
      to: 0,
    },
    collectibles: [],
    wearables: [],
  },

  bounties: {
    completed: [
      {
        id: "1",
        soldAt: 100000,
      },
    ],
    requests: [
      {
        id: "1",
        name: "Cow",
        level: 1,
        coins: 100,
      },
      {
        id: "3",
        name: "Chicken",
        level: 1,
        coins: 100,
      },
      {
        id: "2",
        name: "Chicken",
        level: 5,
        items: { Scroll: 1 },
      },
      {
        id: "2",
        name: "Chicken",
        level: 5,
        items: { Scroll: 1 },
      },
      {
        id: "2",
        name: "Chicken",
        level: 5,
        items: { Scroll: 1 },
      },
      {
        id: "2",
        name: "Chicken",
        level: 5,
        items: { Scroll: 1 },
      },
      {
        id: "22",
        name: "Chicken",
        level: 1,
        items: { Scroll: 1 },
      },
    ],
  },

  mysteryPrizes: {},
  stockExpiry: {},
  mushrooms: {
    mushrooms: {},
    spawnedAt: 0,
  },

  island: {
    type: "basic",
  },

  home: {
    collectibles: {
      Wardrobe: [
        {
          id: "1",
          createdAt: Date.now(),
          coordinates: {
            x: 1,
            y: 3,
          },
          readyAt: Date.now(),
        },
      ],
      Rug: [
        {
          id: "2",
          createdAt: Date.now(),
          coordinates: {
            x: 0,
            y: 2,
          },
          readyAt: Date.now(),
        },
      ],
    },
  },
  farmHands: { bumpkins: {} },
  greenhouse: {
    oil: 100,
    pots: {},
  },

  createdAt: new Date().getTime(),

  experiments: ["GEM_BOOSTS"],

  ...INITIAL_RESOURCES,

  conversations: ["hank-intro"],

  fishing: {
    dailyAttempts: {},
    weather: "Sunny",
    wharf: {},
    beach: {},
  },
  mailbox: {
    read: [],
  },

  stock: INITIAL_STOCK(),
  chickens: {},
  trades: {},
  buildings: {
    "Town Center": [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: -1,
          y: 1,
        },
        createdAt: 0,
      },
    ],
    Workbench: [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: 4,
          y: 8,
        },
        createdAt: 0,
      },
    ],

    Market: [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: 5,
          y: 3,
        },
        createdAt: 0,
      },
    ],
  },
  collectibles: {},
  pumpkinPlaza: {},
  treasureIsland: {
    holes: {},
  },
  auctioneer: {},
  delivery: {
    fulfilledCount: 0,
    orders: [
      {
        createdAt: Date.now(),
        readyAt: Date.now(),
        from: "betty",
        reward: {
          items: {},
          coins: 64,
        },
        id: "1",
        items: {
          Sunflower: 30,
        },
      },
      {
        createdAt: Date.now(),
        readyAt: Date.now(),
        from: "grubnuk",
        reward: {
          items: {},
          coins: 64,
        },
        id: "2",
        items: {
          "Pumpkin Soup": 1,
        },
      },
      {
        createdAt: Date.now(),
        readyAt: Date.now(),
        from: "grimbly",
        reward: {
          items: {},
          coins: 48,
        },
        id: "3",
        items: {
          "Mashed Potato": 2,
        },
      },
    ],
    milestone: {
      goal: 10,
      total: 10,
    },
  },
  farmActivity: {},
  milestones: {},
  specialEvents: {
    history: {},
    current: {},
  },
  goblinMarket: {
    resources: {},
  },
  kingdomChores: {
    chores: [],
    choresCompleted: 0,
    choresSkipped: 0,
  },
  desert: {
    digging: {
      grid: [],
      patterns: [],
    },
  },
  henHouse: makeAnimalBuilding("Hen House"),
  barn: makeAnimalBuilding("Barn"),
  craftingBox: {
    status: "idle",
    startedAt: 0,
    readyAt: 0,
    recipes: {},
  },
  season: {
    season: "spring",
    startedAt: 0,
  },
};

export const TEST_FARM: GameState = {
  coins: 0,
  balance: new Decimal(0),
  previousBalance: new Decimal(0),
  inventory: {
    Sunflower: new Decimal(5),
    Potato: new Decimal(12),
    Carrot: new Decimal("502.079999999999991"),
    "Roasted Cauliflower": new Decimal(1),
    "Carrot Cake": new Decimal(1),
    Radish: new Decimal(100),
    Wheat: new Decimal(100),
    Egg: new Decimal(30),
    "Rusty Shovel": new Decimal(1),
    Axe: new Decimal(3),
    Pickaxe: new Decimal(3),
    "Stone Pickaxe": new Decimal(3),
    "Iron Pickaxe": new Decimal(5),
    "Trading Ticket": new Decimal(50),
    "Chef Hat": new Decimal(1),
    "Boiled Eggs": new Decimal(3),
    "Sunflower Cake": new Decimal(1),
    "Basic Land": new Decimal(3),
  },
  calendar: {
    dates: [],
  },
  previousInventory: {},
  bounties: {
    completed: [],
    requests: [],
  },
  choreBoard: INITIAL_CHORE_BOARD,

  rewards: INITIAL_REWARDS,
  minigames: {
    games: {},
    prizes: {},
  },
  shipments: {},
  gems: {},
  competitions: {
    progress: {},
  },
  kingdomChores: {
    chores: [],
    choresCompleted: 0,
    choresSkipped: 0,
  },
  stock: INITIAL_STOCK(),
  bank: { taxFreeSFL: 0 },
  chickens: {},
  experiments: [],
  farmActivity: {},
  milestones: {},
  home: { collectibles: {} },
  island: { type: "basic" },
  farmHands: { bumpkins: {} },
  fishing: {
    weather: "Sunny",
    wharf: {},
    beach: {},
    dailyAttempts: {},
  },
  greenhouse: {
    pots: {},
    oil: 0,
  },
  wardrobe: {},
  previousWardrobe: {},
  createdAt: new Date().getTime(),
  conversations: [],
  mailbox: {
    read: [],
  },
  trades: {},
  crops: {
    1: {
      createdAt: Date.now(),
      crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
      x: -2,
      y: 0,
      height: 1,
      width: 1,
    },
    2: {
      createdAt: Date.now(),
      crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
      x: -1,
      y: 0,
      height: 1,
      width: 1,
    },
    3: {
      createdAt: Date.now(),
      crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
      x: 0,
      y: 0,
      height: 1,
      width: 1,
    },
    4: {
      createdAt: Date.now(),
      x: -2,
      y: -1,
      height: 1,
      width: 1,
    },
    5: {
      createdAt: Date.now(),
      x: -1,
      y: -1,
      height: 1,
      width: 1,
    },
    6: {
      createdAt: Date.now(),
      x: 0,
      y: -1,
      height: 1,
      width: 1,
    },

    7: {
      createdAt: Date.now(),
      x: -2,
      y: 1,
      height: 1,
      width: 1,
    },
    8: {
      createdAt: Date.now(),
      x: -1,
      y: 1,
      height: 1,
      width: 1,
    },
    9: {
      createdAt: Date.now(),
      x: 0,
      y: 1,
      height: 1,
      width: 1,
    },
  },
  mysteryPrizes: {},
  stockExpiry: {
    "Sunflower Cake": "1970-06-06",
    "Potato Cake": "1970-01-01T00:00:00.000Z",
    "Pumpkin Cake": "1970-01-01T00:00:00.000Z",
    "Carrot Cake": "2022-08-30T00:00:00.000Z",
    "Cabbage Cake": "1970-01-01T00:00:00.000Z",
    "Beetroot Cake": "1970-01-01T00:00:00.000Z",
    "Cauliflower Cake": "1970-01-01T00:00:00.000Z",
    "Parsnip Cake": "1970-01-01T00:00:00.000Z",
    "Radish Cake": "2025-01-01T00:00:00.000Z",
    "Wheat Cake": "1970-01-01T00:00:00.000Z",
  },
  pumpkinPlaza: {},
  delivery: {
    fulfilledCount: 0,
    orders: [],
    milestone: {
      goal: 10,
      total: 10,
    },
  },
  auctioneer: {},
  buildings: {
    "Fire Pit": [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: 4,
          y: 8,
        },
        createdAt: 0,
      },
    ],
    Market: [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: 2,
          y: 2,
        },
        createdAt: 0,
      },
    ],
    Workbench: [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: -2,
          y: 8,
        },
        createdAt: 0,
      },
    ],
  },
  airdrops: [],
  collectibles: {},
  warCollectionOffer: {
    warBonds: 10,
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 10000).toISOString(),
    ingredients: [
      {
        amount: 50,
        name: "Wood",
      },
    ],
  },
  bumpkin: INITIAL_BUMPKIN,

  dailyRewards: { streaks: 0 },

  fruitPatches: {},
  flowers: {
    discovered: {},
    flowerBeds: {},
  },
  gold: {},
  iron: {},
  stones: {
    1: {
      stone: {
        amount: 1,
        minedAt: 0,
      },
      x: 7,
      y: 3,
      height: 1,
      width: 1,
    },
    2: {
      stone: {
        amount: 1,
        minedAt: 0,
      },
      x: 3,
      y: 6,
      height: 1,
      width: 1,
    },
  },
  crimstones: {},
  oilReserves: {},
  trees: {
    1: {
      wood: {
        amount: 2,
        choppedAt: 0,
      },
      x: -3,
      y: 3,
      height: 2,
      width: 2,
    },
    2: {
      wood: {
        amount: 1,
        choppedAt: 0,
      },
      x: 7,
      y: 0,
      height: 2,
      width: 2,
    },

    3: {
      wood: {
        amount: 2,
        choppedAt: 0,
      },
      x: 7,
      y: 9,
      height: 2,
      width: 2,
    },
  },
  sunstones: {},
  mushrooms: {
    spawnedAt: 0,
    mushrooms: {},
  },
  beehives: {},
  megastore: {
    available: makeMegaStoreAvailableDates(),
    collectibles: [],
    wearables: [],
  },
  specialEvents: {
    current: {},
    history: {},
  },
  goblinMarket: {
    resources: {},
  },
  desert: {
    digging: {
      patterns: [],

      grid: [],
    },
  },
  henHouse: makeAnimalBuilding("Hen House"),
  barn: makeAnimalBuilding("Barn"),
  craftingBox: {
    status: "idle",
    startedAt: 0,
    readyAt: 0,
    recipes: {},
  },
  season: {
    season: "spring",
    startedAt: 0,
  },
};

export const INITIAL_EQUIPPED: Equipped = {
  background: "Farm Background",
  hair: "Basic Hair",
  body: "Beige Farmer Potion",
  shirt: "Blue Farmer Shirt",
  pants: "Farmer Overalls",
  shoes: "Black Farmer Boots",
  tool: "Farmer Pitchfork",
};

export const EMPTY: GameState = {
  coins: 0,
  balance: new Decimal(fromWei("0")),
  previousBalance: new Decimal(fromWei("0")),
  createdAt: new Date().getTime(),
  inventory: {
    "Chicken Coop": new Decimal(1),
    Wood: new Decimal(50),
    Gold: new Decimal(10),
    Stone: new Decimal(10),
  },
  bumpkin: INITIAL_BUMPKIN,
  bounties: {
    completed: [],
    requests: [],
  },
  calendar: {
    dates: [],
  },
  rewards: INITIAL_REWARDS,
  bank: { taxFreeSFL: 0 },
  experiments: [],
  minigames: {
    games: {},
    prizes: {},
  },
  shipments: {},
  gems: {},
  previousInventory: {},
  chickens: {},
  choreBoard: INITIAL_CHORE_BOARD,

  stock: {},
  stockExpiry: {},
  wardrobe: {},
  previousWardrobe: {},
  conversations: [],
  farmHands: {
    bumpkins: {},
  },
  competitions: {
    progress: {},
  },
  kingdomChores: {
    chores: [],
    choresCompleted: 0,
    choresSkipped: 0,
  },
  greenhouse: {
    pots: {},
    oil: 0,
  },
  mailbox: {
    read: [],
  },
  delivery: {
    fulfilledCount: 0,
    orders: [],
    milestone: {
      goal: 10,
      total: 10,
    },
  },
  home: { collectibles: {} },
  island: { type: "basic" },
  buildings: {},
  collectibles: {},
  mysteryPrizes: {},
  pumpkinPlaza: {},
  dailyRewards: { streaks: 0 },
  auctioneer: {},

  trades: {},
  fruitPatches: {},
  beehives: {},
  flowers: {
    discovered: {},
    flowerBeds: {},
  },
  gold: {},
  iron: {},
  crops: {},
  stones: {},
  crimstones: {},
  oilReserves: {},
  trees: {},
  sunstones: {},
  farmActivity: {},
  milestones: {},
  fishing: {
    weather: "Sunny",
    wharf: {},
    beach: {},
    dailyAttempts: {},
  },
  mushrooms: {
    spawnedAt: 0,
    mushrooms: {},
  },
  megastore: {
    available: makeMegaStoreAvailableDates(),
    collectibles: [],
    wearables: [],
  },
  specialEvents: {
    current: {},
    history: {},
  },
  goblinMarket: {
    resources: {},
  },
  desert: {
    digging: {
      patterns: [],
      grid: [],
    },
  },
  henHouse: makeAnimalBuilding("Hen House"),
  barn: makeAnimalBuilding("Barn"),
  craftingBox: {
    status: "idle",
    startedAt: 0,
    readyAt: 0,
    recipes: {},
  },
  season: {
    season: "spring",
    startedAt: 0,
  },
};
