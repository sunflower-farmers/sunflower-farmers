import Decimal from "decimal.js-light";
import {
  TEST_FARM,
  INITIAL_BUMPKIN,
  GOLD_RECOVERY_TIME,
} from "../../lib/constants";
import { GameState } from "../../types/game";
import {
  LandExpansionMineGoldAction,
  mineGold,
  EVENT_ERRORS,
  getMinedAt,
} from "./mineGold";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  gold: {
    0: {
      stone: {
        minedAt: 0,
        amount: 2,
      },
      x: 1,
      y: 1,
      height: 1,
      width: 1,
    },
    1: {
      stone: {
        minedAt: 0,
        amount: 3,
      },
      x: 4,
      y: 1,
      height: 1,
      width: 1,
    },
  },
};

describe("mineGold", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it("throws an error if no iron pickaxes are left", () => {
    expect(() =>
      mineGold({
        state: {
          ...GAME_STATE,
          bumpkin: INITIAL_BUMPKIN,
          inventory: { "Iron Pickaxe": new Decimal(0) },
        },
        createdAt: Date.now(),
        action: {
          type: "goldRock.mined",
          index: "0",
        },
      }),
    ).toThrow(EVENT_ERRORS.NO_PICKAXES);
  });

  it("throws an error if gold does not exist", () => {
    expect(() =>
      mineGold({
        state: {
          ...GAME_STATE,
          bumpkin: INITIAL_BUMPKIN,
          inventory: {
            "Iron Pickaxe": new Decimal(2),
          },
        },
        createdAt: Date.now(),
        action: {
          type: "goldRock.mined",
          index: "3",
        },
      }),
    ).toThrow("No gold");
  });

  it("throws an error if gold is not ready", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Iron Pickaxe": new Decimal(2),
        },
      },
      createdAt: Date.now(),
      action: {
        type: "goldRock.mined",

        index: "0",
      } as LandExpansionMineGoldAction,
    };
    const game = mineGold(payload);

    expect(() =>
      mineGold({
        state: game,
        action: payload.action,
        createdAt: Date.now(),
      }),
    ).toThrow("Gold is still recovering");
  });

  it("mines gold", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Iron Pickaxe": new Decimal(1),
        },
      },
      createdAt: Date.now(),
      action: {
        type: "goldRock.mined",

        index: "0",
      } as LandExpansionMineGoldAction,
    };

    const game = mineGold(payload);

    expect(game.inventory["Iron Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Gold).toEqual(new Decimal(2));
  });

  it("mines multiple gold", () => {
    let game = mineGold({
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Iron Pickaxe": new Decimal(3),
        },
      },
      createdAt: Date.now(),
      action: {
        type: "goldRock.mined",
        index: "0",
      } as LandExpansionMineGoldAction,
    });

    game = mineGold({
      state: game,
      createdAt: Date.now(),
      action: {
        type: "goldRock.mined",
        index: "1",
      } as LandExpansionMineGoldAction,
    });

    expect(game.inventory["Iron Pickaxe"]).toEqual(new Decimal(1));
    expect(game.inventory.Gold).toEqual(new Decimal(5));
  });

  it("mines gold after waiting", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Iron Pickaxe": new Decimal(2),
        },
      },
      createdAt: Date.now(),
      action: {
        type: "goldRock.mined",

        index: "0",
      } as LandExpansionMineGoldAction,
    };
    let game = mineGold(payload);

    // 25 hours
    jest.advanceTimersByTime(25 * 60 * 60 * 1000);
    game = mineGold({
      ...payload,
      createdAt: Date.now(),
      state: game,
    });

    expect(game.inventory["Iron Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Gold).toEqual(new Decimal(4));
  });

  describe("BumpkinActivity", () => {
    it("increments Gold mined activity by 1", () => {
      const createdAt = Date.now();
      const bumpkin = {
        ...INITIAL_BUMPKIN,
      };
      const game = mineGold({
        state: {
          ...GAME_STATE,
          bumpkin: bumpkin,
          inventory: {
            "Iron Pickaxe": new Decimal(3),
          },
        },
        createdAt,
        action: {
          type: "goldRock.mined",
          index: "0",
        } as LandExpansionMineGoldAction,
      });

      expect(game.bumpkin?.activity?.["Gold Mined"]).toBe(1);
    });

    it("increments Gold Mined activity by 2", () => {
      const createdAt = Date.now();
      const bumpkin = {
        ...INITIAL_BUMPKIN,
      };
      const state1 = mineGold({
        state: {
          ...GAME_STATE,
          bumpkin: bumpkin,
          inventory: {
            "Iron Pickaxe": new Decimal(3),
          },
        },
        createdAt,
        action: {
          type: "goldRock.mined",
          index: "0",
        } as LandExpansionMineGoldAction,
      });

      const game = mineGold({
        state: state1,
        createdAt,
        action: {
          type: "goldRock.mined",
          index: "1",
        } as LandExpansionMineGoldAction,
      });

      expect(game.bumpkin?.activity?.["Gold Mined"]).toBe(2);
    });
  });

  describe("getMinedAt", () => {
    it("returns normal mined at", () => {
      const now = Date.now();

      const time = getMinedAt({
        game: TEST_FARM,
        createdAt: now,
      });

      expect(time).toEqual(now);
    });

    it("gold replenishes faster with time warp", () => {
      const now = Date.now();

      const time = getMinedAt({
        game: {
          ...TEST_FARM,
          collectibles: {
            "Time Warp Totem": [
              {
                id: "123",
                createdAt: now,
                coordinates: { x: 1, y: 1 },
                readyAt: now - 5 * 60 * 1000,
              },
            ],
          },
        },
        createdAt: now,
      });

      expect(time).toEqual(now - (GOLD_RECOVERY_TIME * 1000) / 2);
    });

    it("gold replenishes faster with Super Totem", () => {
      const now = Date.now();

      const time = getMinedAt({
        game: {
          ...TEST_FARM,
          collectibles: {
            "Super Totem": [
              {
                id: "123",
                createdAt: now,
                coordinates: { x: 1, y: 1 },
                readyAt: now - 5 * 60 * 1000,
              },
            ],
          },
        },
        createdAt: now,
      });

      expect(time).toEqual(now - (GOLD_RECOVERY_TIME * 1000) / 2);
    });

    it("doesn't stack Super Totem and Time Warp Totem", () => {
      const now = Date.now();

      const time = getMinedAt({
        game: {
          ...TEST_FARM,
          collectibles: {
            "Time Warp Totem": [
              {
                id: "123",
                createdAt: now,
                coordinates: { x: 1, y: 1 },
                readyAt: now - 5 * 60 * 1000,
              },
            ],
            "Super Totem": [
              {
                id: "123",
                createdAt: now,
                coordinates: { x: 1, y: 1 },
                readyAt: now - 5 * 60 * 1000,
              },
            ],
          },
        },
        createdAt: now,
      });

      expect(time).toEqual(now - (GOLD_RECOVERY_TIME * 1000) / 2);
    });

    it("applies a boost of -30% recovery time when Midas Sprint skill is active", () => {
      const now = Date.now();
      const time = getMinedAt({
        game: {
          ...TEST_FARM,
          bumpkin: {
            ...TEST_FARM.bumpkin,
            skills: { "Midas Sprint": 1 },
          },
        },
        createdAt: now,
      });

      expect(time).toEqual(now - GOLD_RECOVERY_TIME * 1000 * 0.3);
    });

    it("applies a Ore Hourglass boost of -50% recovery time for 3 hours", () => {
      const now = Date.now();
      const time = getMinedAt({
        game: {
          ...TEST_FARM,
          collectibles: {
            "Ore Hourglass": [
              {
                id: "123",
                createdAt: now,
                coordinates: { x: 1, y: 1 },
                readyAt: now,
              },
            ],
          },
        },
        createdAt: now,
      });

      expect(time).toEqual(now - (GOLD_RECOVERY_TIME * 1000) / 2);
    });

    it("does not apply an Ore Hourglass boost if expired", () => {
      const now = Date.now();
      const fourHoursAgo = now - 4 * 60 * 60 * 1000;

      const time = getMinedAt({
        game: {
          ...TEST_FARM,
          collectibles: {
            "Ore Hourglass": [
              {
                id: "123",
                createdAt: fourHoursAgo,
                coordinates: { x: 1, y: 1 },
                readyAt: fourHoursAgo,
              },
            ],
          },
        },
        createdAt: now,
      });

      expect(time).toEqual(now);
    });
  });
});
