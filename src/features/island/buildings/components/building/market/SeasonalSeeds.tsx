import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import orange from "assets/resources/orange.png";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import {
  CROP_SEEDS,
  CropName,
  GREENHOUSE_SEEDS,
  GreenHouseCropSeedName,
} from "features/game/types/crops";
import { ITEM_DETAILS } from "features/game/types/images";
import { Decimal } from "decimal.js-light";
import { getBuyPrice } from "features/game/events/landExpansion/seedBought";
import { getCropPlotTime } from "features/game/events/landExpansion/plant";
import { INVENTORY_LIMIT } from "features/game/lib/constants";
import { makeBulkBuySeeds } from "./lib/makeBulkBuyAmount";
import { getBumpkinLevel } from "features/game/lib/level";
import { SEASONAL_SEEDS, SEEDS, SeedName } from "features/game/types/seeds";
import {
  GREENHOUSE_FRUIT_SEEDS,
  PATCH_FRUIT,
  PATCH_FRUIT_SEEDS,
  PatchFruitSeedName,
} from "features/game/types/fruits";
import { getFruitHarvests } from "features/game/events/landExpansion/utils";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { getFruitPatchTime } from "features/game/events/landExpansion/fruitPlanted";
import { gameAnalytics } from "lib/gameAnalytics";
import { Label } from "components/ui/Label";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { FLOWER_SEEDS, FlowerSeedName } from "features/game/types/flowers";
import { getFlowerTime } from "features/game/events/landExpansion/plantFlower";
import {
  SEED_TO_PLANT,
  getGreenhouseCropTime,
} from "features/game/events/landExpansion/plantGreenhouse";
import { NPC_WEARABLES } from "lib/npcs";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { formatNumber, setPrecision } from "lib/utils/formatNumber";
import { hasFeatureAccess } from "lib/flags";
import {
  isAdvancedCrop,
  isBasicCrop,
  isMediumCrop,
} from "features/game/events/landExpansion/harvest";
import { Restock } from "./restock/Restock";
import { TemperateSeasonName } from "features/game/types/game";
import { secondsToString } from "lib/utils/time";
import { secondsLeftInSeason } from "features/game/types/seasons";
import { secondsTillWeekReset } from "features/game/lib/factions";

import springIcon from "assets/icons/spring.webp";
import summerIcon from "assets/icons/summer.webp";
import autumnIcon from "assets/icons/autumn.webp";
import winterIcon from "assets/icons/winter.webp";

const SEASON_ICONS: Record<TemperateSeasonName, string> = {
  spring: springIcon,
  summer: summerIcon,
  autumn: autumnIcon,
  winter: winterIcon,
};

export const SeasonalSeeds: React.FC = () => {
  const [selectedName, setSelectedName] = useState<SeedName>("Sunflower Seed");
  const [confirmBuyModal, showConfirmBuyModal] = useState(false);

  const selected = SEEDS()[selectedName];
  const { gameService, shortcutItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const { t } = useAppTranslation();

  const { inventory } = state;

  const price = getBuyPrice(selectedName, selected, state);

  const onSeedClick = (seedName: SeedName) => {
    setSelectedName(seedName);
    shortcutItem(seedName);
  };

  const buy = (amount = 1) => {
    const state = gameService.send("seed.bought", {
      item: selectedName,
      amount,
    });

    shortcutItem(selectedName);

    if (
      state.context.state.bumpkin?.activity?.["Sunflower Seed Bought"] === 1
    ) {
      gameAnalytics.trackMilestone({
        event: "Tutorial:SunflowerSeedBought:Completed",
      });
    }
  };

  const lessFunds = (amount = 1) => {
    return state.coins < price * amount;
  };

  const stock = state.stock[selectedName] || new Decimal(0);
  const inventoryLimit = INVENTORY_LIMIT(state)[selectedName] ?? new Decimal(0);
  const inventoryAmount = setPrecision(
    inventory[selectedName] ?? new Decimal(0),
    2,
  );
  const bulkBuyLimit = inventoryLimit.minus(inventoryAmount);
  // Calculates the difference between amount in inventory and the inventory limit
  const bulkSeedBuyAmount = makeBulkBuySeeds(stock, bulkBuyLimit);

  const plantingSpot = selected.plantingSpot;

  const isSeedLocked = (seedName: SeedName) => {
    const seed = SEEDS()[seedName];
    return getBumpkinLevel(state.bumpkin?.experience ?? 0) < seed.bumpkinLevel;
  };

  const Action = () => {
    if (!inventory[plantingSpot]) {
      return (
        <div className="flex justify-center">
          <Label className="mb-1" type="danger">
            {t("seeds.plantingSpot.needed", { plantingSpot: plantingSpot })}
          </Label>
        </div>
      );
    }

    if (isSeedLocked(selectedName)) {
      // return nothing if requirement not met
      return <></>;
    }

    // return delayed sync when no stock
    if (stock.lessThanOrEqualTo(0)) {
      return <Restock npc={"betty"} />;
    }

    // return message if inventory is full
    if (inventoryAmount.greaterThanOrEqualTo(inventoryLimit)) {
      return (
        <p className="text-xxs text-center mb-1">{t("restock.tooManySeeds")}</p>
      );
    }

    // return buy buttons otherwise
    return (
      <>
        <div className="flex space-x-1 sm:space-x-0 sm:space-y-1 sm:flex-col w-full">
          <Button
            disabled={lessFunds() || stock.lessThan(1)}
            onClick={() => buy(1)}
          >
            {t("buy")} {"1"}
          </Button>
          {bulkSeedBuyAmount > 10 && (
            <Button disabled={lessFunds(10)} onClick={() => buy(10)}>
              {t("buy")} {`10`}
            </Button>
          )}
          {bulkSeedBuyAmount > 1 && bulkSeedBuyAmount <= 10 && (
            <Button
              disabled={lessFunds(bulkSeedBuyAmount)}
              onClick={() => buy(bulkSeedBuyAmount)}
            >
              {t("buy")} {bulkSeedBuyAmount}
            </Button>
          )}
        </div>
        <div>
          {state.island.type !== "basic" && bulkSeedBuyAmount > 10 && (
            <Button
              className="mt-1"
              disabled={lessFunds(bulkSeedBuyAmount)}
              onClick={() => {
                if (price > 0) {
                  showConfirmBuyModal(true);
                } else {
                  buy(bulkSeedBuyAmount);
                }
              }}
            >
              {t("buy")} {bulkSeedBuyAmount}
            </Button>
          )}
        </div>
        {bulkSeedBuyAmount < stock.toNumber() && (
          <p className="text-xxs text-center mb-1">
            {t("seeds.reachingInventoryLimit")}
          </p>
        )}
        <ConfirmationModal
          show={confirmBuyModal}
          onHide={() => showConfirmBuyModal(false)}
          messages={[
            t("confirmation.buyCrops", {
              coinAmount: formatNumber(
                new Decimal(price).mul(bulkSeedBuyAmount),
              ),
              seedNo: bulkSeedBuyAmount,
              seedName: selectedName,
            }),
          ]}
          onCancel={() => showConfirmBuyModal(false)}
          onConfirm={() => {
            buy(bulkSeedBuyAmount);
            showConfirmBuyModal(false);
          }}
          confirmButtonLabel={`${t("buy")} ${bulkSeedBuyAmount}`}
          bumpkinParts={NPC_WEARABLES.betty}
          disabled={lessFunds(bulkSeedBuyAmount)}
        />
      </>
    );
  };

  const yields = SEEDS()[selectedName].yield;

  const getPlantSeconds = () => {
    if (selectedName in FLOWER_SEEDS()) {
      return getFlowerTime(selectedName as FlowerSeedName, state);
    }

    if (yields && yields in PATCH_FRUIT())
      return getFruitPatchTime(selectedName as PatchFruitSeedName, state);

    if (
      selectedName in GREENHOUSE_SEEDS ||
      selectedName in GREENHOUSE_FRUIT_SEEDS()
    ) {
      const plant = SEED_TO_PLANT[selectedName as GreenHouseCropSeedName];
      const seconds = getGreenhouseCropTime({
        crop: plant,
        game: state,
      });
      return seconds;
    }

    return getCropPlotTime({
      crop: yields as CropName,
      inventory,
      game: state,
      buds: state.buds ?? {},
    });
  };

  const getHarvestCount = () => {
    if (!yields) return undefined;

    if (!(yields in PATCH_FRUIT())) return undefined;

    return getFruitHarvests(state);
  };

  const currentSeason = state.season.season;
  let seasons: TemperateSeasonName[] = ["spring", "summer", "autumn", "winter"];

  // Reorder seasons to start with current season
  const currentSeasonIndex = seasons.indexOf(currentSeason);
  seasons = [
    ...seasons.slice(currentSeasonIndex),
    ...seasons.slice(0, currentSeasonIndex),
  ];

  const harvestCount = getHarvestCount();

  return (
    <SplitScreenView
      panel={
        <CraftingRequirements
          gameState={state}
          stock={stock}
          details={{
            item: selectedName,
          }}
          hideDescription
          requirements={{
            coins: price,
            showCoinsIfFree: true,
            level: isSeedLocked(selectedName)
              ? selected.bumpkinLevel
              : undefined,
            harvests: harvestCount
              ? {
                  minHarvest: harvestCount[0],
                  maxHarvest: harvestCount[1],
                }
              : undefined,
            timeSeconds: getPlantSeconds(),
            restriction: {
              icon: SEASON_ICONS[currentSeason],
              text: plantingSpot,
            },
          }}
          actionView={Action()}
        />
      }
      content={
        <div className="pl-1">
          {seasons.map((season, index) => (
            <>
              <div className="flex justify-between">
                <Label
                  icon={SEASON_ICONS[season]}
                  type="default"
                  className="ml-2 mb-1 capitalize"
                >
                  {`${season}`}
                </Label>
                {index === 0 && (
                  <Label
                    icon={SUNNYSIDE.icons.stopwatch}
                    type="transparent"
                    className="mb-1"
                  >
                    {`${secondsToString(secondsTillWeekReset(), {
                      length: "short",
                    })} left`}
                  </Label>
                )}
              </div>
              <div className="flex flex-wrap mb-2">
                {SEASONAL_SEEDS[season].map((name: SeedName) => (
                  <Box
                    isSelected={selectedName === name}
                    key={name}
                    onClick={() => onSeedClick(name)}
                    image={ITEM_DETAILS[SEEDS()[name].yield ?? name].image}
                    showOverlay={isSeedLocked(name)}
                    // secondaryImage={SUNNYSIDE.icons.seedling}
                    count={inventory[name]}
                  />
                ))}
              </div>
            </>
          ))}
        </div>
      }
    />
  );
};
