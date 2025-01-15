import { TEST_FARM, INITIAL_BUMPKIN } from "features/game/lib/constants";
import { resetSkills } from "./resetSkills";
import Decimal from "decimal.js-light";

describe("resetSkills", () => {
  const dateNow = Date.now();

  it("requires Bumpkin to have skills", () => {
    expect(() => {
      resetSkills({
        state: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            skills: {},
          },
        },
        action: { type: "skills.reset" },
        createdAt: dateNow,
      });
    }).toThrow("You do not have any skills to reset");
  });

  it("requires Bumpkin to wait 3 months before resetting skills", () => {
    expect(() => {
      resetSkills({
        state: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            skills: { "Green Thumb": 1 },
            previousSkillsResetAt: dateNow,
          },
        },
        action: { type: "skills.reset" },
        createdAt: dateNow,
      });
    }).toThrow("You can only reset your skills once every 3 months");
  });

  it("requires player to have enough SFL to reset skills", () => {
    expect(() => {
      resetSkills({
        state: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            skills: { "Green Thumb": 1 },
          },
          balance: new Decimal(0),
        },
        action: { type: "skills.reset" },
        createdAt: dateNow,
      });
    }).toThrow("You do not have enough SFL to reset your skills");
  });

  it("resets Bumpkin skills", () => {
    const state = resetSkills({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: { "Green Thumb": 1 },
        },
        balance: new Decimal(10),
      },
      action: { type: "skills.reset" },
      createdAt: dateNow,
    });

    expect(state.bumpkin?.skills).toEqual({});
    expect(state.bumpkin?.previousSkillsResetAt).toEqual(dateNow);
    expect(state.balance.toNumber()).toEqual(0);
  });

  it("resets Bumpkin skills after 3 months", () => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const state = resetSkills({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: { "Green Thumb": 1 },
          previousSkillsResetAt: threeMonthsAgo.getTime() - 1000, // 1 second before 3 months ago, just to be sure rofl
        },
        balance: new Decimal(10),
      },
      action: { type: "skills.reset" },
      createdAt: dateNow,
    });

    expect(state.bumpkin?.skills).toEqual({});
    expect(state.bumpkin?.previousSkillsResetAt).toEqual(dateNow);
    expect(state.balance.toNumber()).toEqual(0);
  });
});
