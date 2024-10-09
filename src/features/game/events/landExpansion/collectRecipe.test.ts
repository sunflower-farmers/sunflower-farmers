import Decimal from "decimal.js-light";
import { TEST_FARM, INITIAL_BUMPKIN } from "features/game/lib/constants";
import { GameState, PlacedItem } from "features/game/types/game";
import { collectRecipe } from "./collectRecipe";

const GAME_STATE: GameState = TEST_FARM;

describe("collect Recipes", () => {
  it("throws an error if building does not exist", () => {
    expect(() =>
      collectRecipe({
        state: {
          ...GAME_STATE,
          buildings: {},
        },
        action: {
          type: "recipe.collected",
          building: "Fire Pit",
          buildingId: "123",
        },
        createdAt: Date.now(),
      }),
    ).toThrow("Building does not exist");
  });

  it("throws an error if building is not cooking anything", () => {
    expect(() =>
      collectRecipe({
        state: {
          ...GAME_STATE,
          buildings: {
            "Fire Pit": [
              {
                id: "123",
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
        action: {
          type: "recipe.collected",
          building: "Fire Pit",
          buildingId: "123",
        },
        createdAt: Date.now(),
      }),
    ).toThrow("Building is not cooking anything");
  });

  it("throws an error if recipe is not ready", () => {
    expect(() =>
      collectRecipe({
        state: {
          ...GAME_STATE,
          buildings: {
            "Fire Pit": [
              {
                id: "123",
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                readyAt: 0,
                crafting: {
                  name: "Boiled Eggs",
                  readyAt: Date.now() + 60 * 1000,
                },
              },
            ],
          },
        },
        action: {
          type: "recipe.collected",
          building: "Fire Pit",
          buildingId: "123",
        },
        createdAt: Date.now(),
      }),
    ).toThrow("Recipe is not ready");
  });

  it("removes the recipe from the building", () => {
    const firePit: PlacedItem = {
      id: "123",
      coordinates: { x: 1, y: 1 },
      createdAt: 0,
      readyAt: 0,
      crafting: {
        name: "Boiled Eggs",
        readyAt: Date.now() - 5 * 1000,
      },
    };
    const state = collectRecipe({
      state: {
        ...GAME_STATE,
        buildings: {
          "Fire Pit": [
            firePit,
            {
              id: "2039",
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
      action: {
        type: "recipe.collected",
        building: "Fire Pit",
        buildingId: "123",
      },
      createdAt: Date.now(),
    });

    expect(state.buildings).toEqual({
      "Fire Pit": [
        {
          ...firePit,
          crafting: undefined,
        },

        {
          id: "2039",
          coordinates: { x: 1, y: 1 },
          createdAt: 0,
          readyAt: 0,
        },
      ],
    });
  });

  it("adds the consumable to the inventory", () => {
    const state = collectRecipe({
      state: {
        ...GAME_STATE,
        balance: new Decimal(10),
        inventory: {
          "Boiled Eggs": new Decimal(3),
          Sunflower: new Decimal(22),
        },
        buildings: {
          "Fire Pit": [
            {
              id: "123",
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              readyAt: 0,
              crafting: {
                name: "Boiled Eggs",
                readyAt: Date.now() - 5 * 1000,
              },
            },
          ],
        },
      },
      action: {
        type: "recipe.collected",
        building: "Fire Pit",
        buildingId: "123",
      },
      createdAt: Date.now(),
    });

    expect(state.balance).toEqual(new Decimal(10));
    expect(state.inventory).toEqual({
      "Boiled Eggs": new Decimal(4),
      Sunflower: new Decimal(22),
    });
  });

  it("gives 50% chances to collect two times the amount with Double Nom skill", () => {
    const results = Array.from({ length: 10 }).map(() => {
      const state = collectRecipe({
        state: {
          ...GAME_STATE,
          balance: new Decimal(10),
          inventory: {
            Sunflower: new Decimal(22),
          },
          buildings: {
            "Fire Pit": [
              {
                id: "123",
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                readyAt: 0,
                crafting: {
                  name: "Boiled Eggs",
                  readyAt: Date.now() - 5 * 1000,
                },
              },
            ],
          },
          bumpkin: {
            ...INITIAL_BUMPKIN,
            skills: {
              "Double Nom": 1,
            },
          },
        },
        action: {
          type: "recipe.collected",
          building: "Fire Pit",
          buildingId: "123",
        },
        createdAt: Date.now(),
      });

      return state.inventory["Boiled Eggs"];
    });

    expect(results).toContainEqual(new Decimal(2));
  });

  it("gives 20% chance to collect two times the amount of food from Fire Pit with Firey Jackpot skill", () => {
    const results = Array.from({ length: 10 }).map(() => {
      const state = collectRecipe({
        state: {
          ...GAME_STATE,
          balance: new Decimal(10),
          inventory: {
            Sunflower: new Decimal(22),
          },
          buildings: {
            "Fire Pit": [
              {
                id: "123",
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                readyAt: 0,
                crafting: {
                  name: "Boiled Eggs",
                  readyAt: Date.now() - 5 * 1000,
                },
              },
            ],
          },
          bumpkin: {
            ...INITIAL_BUMPKIN,
            skills: {
              "Firey Jackpot": 1,
            },
          },
        },
        action: {
          type: "recipe.collected",
          building: "Fire Pit",
          buildingId: "123",
        },
        createdAt: Date.now(),
      });

      return state.inventory["Boiled Eggs"];
    });

    expect(results).toContainEqual(new Decimal(2));
  });

  it("makes sure Firey Jackpot skill does not trigger on Deli", () => {
    const results = Array.from({ length: 10 }).map(() => {
      const state = collectRecipe({
        state: {
          ...GAME_STATE,
          balance: new Decimal(10),
          inventory: {
            Sunflower: new Decimal(22),
          },
          buildings: {
            Deli: [
              {
                id: "123",
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                readyAt: 0,
                crafting: {
                  name: "Boiled Eggs",
                  readyAt: Date.now() - 5 * 1000,
                },
              },
            ],
          },
          bumpkin: {
            ...INITIAL_BUMPKIN,
            skills: {
              "Firey Jackpot": 1,
            },
          },
        },
        action: {
          type: "recipe.collected",
          building: "Deli",
          buildingId: "123",
        },
        createdAt: Date.now(),
      });

      return state.inventory["Boiled Eggs"];
    });

    expect(results).toContainEqual(new Decimal(1));
  });
});
