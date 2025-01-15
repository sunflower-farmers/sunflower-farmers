import React, { useContext, useState } from "react";
import { ButtonPanel, InnerPanel, OuterPanel } from "components/ui/Panel";
import {
  BumpkinRevampSkillTree,
  getRevampSkills,
  getRevampSkillTreeCategoriesByIsland,
} from "features/game/types/bumpkinSkills";

import { Modal } from "components/ui/Modal";
import { Label } from "components/ui/Label";
import { getKeys } from "features/game/types/craftables";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { setImageWidth } from "lib/images";
import { PIXEL_SCALE } from "features/game/lib/constants";

import { SUNNYSIDE } from "assets/sunnyside";
import sflIcon from "assets/icons/sfl.webp";
import { Button } from "components/ui/Button";
import { gameAnalytics } from "lib/gameAnalytics";
import { getAvailableBumpkinSkillPoints } from "features/game/events/landExpansion/choseSkill";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ONE_DAY, secondsToString } from "lib/utils/time";
import { ITEM_DETAILS } from "features/game/types/images";
import { ISLAND_EXPANSIONS } from "features/game/types/game";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import classNames from "classnames";

export const SKILL_TREE_ICONS: Record<BumpkinRevampSkillTree, string> = {
  Crops: SUNNYSIDE.skills.crops,
  Trees: SUNNYSIDE.skills.trees,
  Cooking: SUNNYSIDE.skills.cooking,
  Animals: SUNNYSIDE.animals.chickenIdle,
  "Fruit Patch": ITEM_DETAILS.Apple.image,
  Fishing: SUNNYSIDE.icons.fish,
  Greenhouse: ITEM_DETAILS.Greenhouse.image,
  Mining: SUNNYSIDE.tools.stone_pickaxe,
  "Bees & Flowers": ITEM_DETAILS["Red Pansy"].image,
  Machinery: ITEM_DETAILS["Crop Machine"].image,
  Compost: ITEM_DETAILS["Premium Composter"].image,
};

export const SkillCategoryList = ({
  onClick,
}: {
  onClick: (category: BumpkinRevampSkillTree) => void;
}) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const [showSkillsResetModal, setShowSkillsResetModal] =
    useState<boolean>(false);

  const { bumpkin } = state;
  const experience = bumpkin?.experience || 0;
  const availableSkillPoints = getAvailableBumpkinSkillPoints(bumpkin);

  // Functions
  const hasSkills = bumpkin?.skills
    ? Object.keys(bumpkin.skills).length > 0
    : false;
  const lastResetDate = bumpkin?.previousSkillsResetAt || null;
  const threeMonthsSinceLastReset = lastResetDate
    ? new Date().getTime() - new Date(lastResetDate).getTime() >=
      90 * 24 * 60 * 60 * 1000
    : true;
  const enoughSfl = state.balance.toNumber() >= 10;

  const handleSkillsReset = () => {
    setShowSkillsResetModal(false);
    gameService.send("skills.reset");

    gameAnalytics.trackMilestone({
      event: "Bumpkin:SkillReset",
    });
  };

  const getTimeUntilNextReset = () => {
    if (!lastResetDate) return "";
    const nextResetDate =
      new Date(lastResetDate).getTime() + 90 * ONE_DAY * 1000;
    const timeLeftInSeconds = Math.max(
      (nextResetDate - new Date().getTime()) / 1000,
      0,
    );

    return secondsToString(timeLeftInSeconds, {
      length: "short",
      isShortFormat: true,
      removeTrailingZeros: true,
    });
  };

  return (
    <>
      <InnerPanel className="flex flex-col h-full overflow-y-auto scrollable max-h-96">
        <div className="flex flex-row mt-2 mb-1 items-center">
          <Label type="default">{`${t("skillPts")} ${availableSkillPoints}`}</Label>
        </div>
        {ISLAND_EXPANSIONS.map((islandType) => {
          const hasUnlockedIslandCategory = hasRequiredIslandExpansion(
            state.island.type,
            islandType,
          );
          return (
            <div key={islandType} className="flex flex-col items-stretch">
              <div className="flex items-center gap-2 mt-1 mb-2">
                <Label
                  type={hasUnlockedIslandCategory ? "default" : "warning"}
                  className="capitalize"
                >
                  {`${islandType} Skills`}
                </Label>
                {!hasUnlockedIslandCategory && (
                  <Label type="warning">
                    {`Reach ${islandType} island to unlock`}
                  </Label>
                )}
              </div>

              {getRevampSkillTreeCategoriesByIsland(islandType).map(
                (category) => {
                  const skills = getRevampSkills(category);
                  const icon = SKILL_TREE_ICONS[skills[0].tree];
                  const skillsAcquiredInCategoryCount = getKeys({
                    ...bumpkin?.skills,
                  }).filter((acquiredSkillName) =>
                    skills.find((skill) => skill.name === acquiredSkillName),
                  ).length;

                  return (
                    <div key={category}>
                      <ButtonPanel
                        disabled={!hasUnlockedIslandCategory}
                        onClick={
                          hasUnlockedIslandCategory
                            ? () => onClick(category)
                            : undefined
                        }
                        className={classNames(
                          `flex relative items-center !py-2 mb-1 hover:bg-brown-200`,
                          { "cursor-pointer": hasUnlockedIslandCategory },
                        )}
                      >
                        <Label
                          type="default"
                          className="px-1 text-xxs absolute -top-3 -right-1"
                        >
                          {`${skillsAcquiredInCategoryCount}/${skills.filter((skill) => !skill.disabled).length}`}
                        </Label>
                        <div className="flex justify-center items-center">
                          <img
                            src={icon}
                            style={{
                              opacity: 0,
                              marginRight: `${PIXEL_SCALE * 4}px`,
                              maxWidth: `${PIXEL_SCALE * 10}px`,
                              maxHeight: `${PIXEL_SCALE * 10}px`,
                            }}
                            onLoad={(e) => setImageWidth(e.currentTarget)}
                          />
                          <span className="text-sm">{category}</span>
                        </div>
                      </ButtonPanel>
                    </div>
                  );
                },
              )}
            </div>
          );
        })}
        <div className="flex flex-row items-center">
          <p
            className="text-xs cursor-pointer underline"
            onClick={() => setShowSkillsResetModal(true)}
          >
            {"Reset Skills"}
          </p>
        </div>
      </InnerPanel>

      <Modal
        show={showSkillsResetModal}
        onHide={() => setShowSkillsResetModal(false)}
      >
        <OuterPanel>
          <InnerPanel className="flex flex-col items-center">
            <div className="flex flex-row items-center w-full justify-between">
              <Label type="danger">{"Skills Reset"}</Label>
              <Label type="warning" icon={sflIcon}>
                {"10 SFL"}
              </Label>
            </div>
            <p className="text-xs py-4 px-2 text-center">
              {
                "Are you sure you want to reset all your skills? This action cannot be undone and will cost 10 SFL. You will be able to reset your skills again in 3 months."
              }
            </p>
            {!threeMonthsSinceLastReset && (
              <Label
                type="danger"
                icon={SUNNYSIDE.icons.stopwatch}
                className="mb-2"
              >
                {`${getTimeUntilNextReset()} until you can reset your skills again`}
              </Label>
            )}
            {!enoughSfl && (
              <Label type="danger" icon={sflIcon} className="mb-2">
                {"You do not have enough SFL"}
              </Label>
            )}
            <Button
              onClick={handleSkillsReset}
              disabled={!hasSkills || !threeMonthsSinceLastReset || !enoughSfl}
            >
              {"Reset Skills"}
            </Button>
          </InnerPanel>
        </OuterPanel>
      </Modal>
    </>
  );
};
