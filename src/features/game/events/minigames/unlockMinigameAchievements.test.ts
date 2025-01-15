import { TEST_FARM } from "features/game/lib/constants";
import { unlockMinigameAchievements } from "./unlockMinigameAchievements";

describe("minigame.achievementUnlocked", () => {
  it("requires minigame exists", () => {
    expect(() =>
      unlockMinigameAchievements({
        state: TEST_FARM,
        action: {
          id: "not-a-game" as any,
          achievementNames: ["Achievement Name 1"],
          type: "minigame.achievementsUnlocked",
        },
      }),
    ).toThrow("not-a-game is not a valid minigame");
  });

  it("does not unlock an achievement twice", () => {
    const unlockedAtDate = new Date("2024-05-04T00:00:00Z");
    const now = new Date();
    const state = unlockMinigameAchievements({
      state: {
        ...TEST_FARM,
        minigames: {
          prizes: {},
          games: {
            "chicken-rescue": {
              highscore: 10,
              history: {},
              achievements: {
                "Achievement Name 1": {
                  unlockedAt: unlockedAtDate.getTime(),
                },
              },
            },
          },
        },
      },
      action: {
        id: "chicken-rescue",
        achievementNames: ["Achievement Name 1"],
        type: "minigame.achievementsUnlocked",
      },
      createdAt: now.getTime(),
    });

    expect(state.minigames.games["chicken-rescue"]).toEqual({
      highscore: 10,
      history: {},
      achievements: {
        "Achievement Name 1": {
          unlockedAt: unlockedAtDate.getTime(),
        },
      },
    });
  });

  it("unlocks an achievement", () => {
    const now = new Date();
    const state = unlockMinigameAchievements({
      state: {
        ...TEST_FARM,
        minigames: {
          prizes: {},
          games: {
            "chicken-rescue": {
              highscore: 10,
              history: {},
            },
          },
        },
      },
      action: {
        id: "chicken-rescue",
        achievementNames: ["Achievement Name 1"],
        type: "minigame.achievementsUnlocked",
      },
      createdAt: now.getTime(),
    });

    expect(state.minigames.games["chicken-rescue"]).toEqual({
      highscore: 10,
      history: {},
      achievements: {
        "Achievement Name 1": {
          unlockedAt: now.getTime(),
        },
      },
    });
  });

  it("unlocks multiple achievements", () => {
    const now = new Date();
    const state = unlockMinigameAchievements({
      state: {
        ...TEST_FARM,
        minigames: {
          prizes: {},
          games: {
            "chicken-rescue": {
              highscore: 10,
              history: {},
            },
          },
        },
      },
      action: {
        id: "chicken-rescue",
        achievementNames: ["Achievement Name 1", "Achievement Name 2"],
        type: "minigame.achievementsUnlocked",
      },
      createdAt: now.getTime(),
    });

    expect(state.minigames.games["chicken-rescue"]).toEqual({
      highscore: 10,
      history: {},
      achievements: {
        "Achievement Name 1": {
          unlockedAt: now.getTime(),
        },
        "Achievement Name 2": {
          unlockedAt: now.getTime(),
        },
      },
    });
  });

  it("for multiple achievements, only unlocks the ones that have not been unlocked", () => {
    const unlockedAtDate = new Date("2024-05-04T00:00:00Z");
    const now = new Date();
    const state = unlockMinigameAchievements({
      state: {
        ...TEST_FARM,
        minigames: {
          prizes: {},
          games: {
            "chicken-rescue": {
              highscore: 10,
              history: {},
              achievements: {
                "Achievement Name 1": {
                  unlockedAt: unlockedAtDate.getTime(),
                },
              },
            },
          },
        },
      },
      action: {
        id: "chicken-rescue",
        achievementNames: ["Achievement Name 1", "Achievement Name 2"],
        type: "minigame.achievementsUnlocked",
      },
      createdAt: now.getTime(),
    });

    expect(state.minigames.games["chicken-rescue"]).toEqual({
      highscore: 10,
      history: {},
      achievements: {
        "Achievement Name 1": {
          unlockedAt: unlockedAtDate.getTime(),
        },
        "Achievement Name 2": {
          unlockedAt: now.getTime(),
        },
      },
    });
  });
});
