/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import Decimal from "decimal.js-light";
import { BB_TO_GEM_RATIO, GameState } from "../types/game";

import {
  INITIAL_CHORE_BOARD,
  INITIAL_EQUIPMENT,
  INITIAL_STOCK,
} from "./constants";
import { INITIAL_REWARDS } from "../types/rewards";
import { makeAnimalBuilding } from "./animals";
import { Equipped } from "../types/bumpkin";
import { tokenUriBuilder } from "lib/utils/tokenUriBuilder";

export const STATIC_OFFLINE_FARM: GameState = {
  coins: 0,
  balance: new Decimal(0),
  previousBalance: new Decimal(0),
  inventory: {
    Marty: new Decimal(2),
    Miffy: new Decimal(2),
    Morty: new Decimal(2),
    "Town Center": new Decimal(1),
    Market: new Decimal(1),
    Workbench: new Decimal(1),
    "Basic Land": new Decimal(6),
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

  crops: {},
  beehives: {},
  crimstones: {},
  flowers: {
    discovered: {},
    flowerBeds: {},
  },
  fruitPatches: {},
  gold: {},
  iron: {},
  stones: {},
  trees: {},
  sunstones: {},
  oilReserves: {},

  calendar: {
    dates: [],
  },

  choreBoard: INITIAL_CHORE_BOARD,

  competitions: {
    progress: {},
  },

  shipments: {},
  gems: {},

  bumpkin: {
    equipped: INITIAL_EQUIPMENT as Equipped,
    experience: 100000,

    id: 1,
    skills: {},
    tokenUri: `1_${tokenUriBuilder(INITIAL_EQUIPMENT)}`,
    achievements: {},

    activity: {},
  },

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
