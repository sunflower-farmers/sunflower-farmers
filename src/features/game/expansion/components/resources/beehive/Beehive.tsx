import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import beehive from "assets/sfts/beehive.webp";
import honeyDrop from "assets/sfts/honey_drop.webp";
import bee from "assets/icons/bee.webp";
import lightning from "assets/icons/lightning.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import classNames from "classnames";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useInterpret, useSelector } from "@xstate/react";
import { Bar } from "components/ui/ProgressBar";
import { Beehive as IBeehive } from "features/game/types/game";
import {
  BeehiveContext,
  BeehiveMachineState,
  MachineInterpreter,
  beehiveMachine,
  getCurrentHoneyProduced,
  getCurrentSpeed,
} from "./beehiveMachine";
import { Bee } from "./Bee";
import { Modal } from "components/ui/Modal";
import { NPC_WEARABLES } from "lib/npcs";
import { progressBarBorderStyle } from "features/game/lib/style";
import { ITEM_DETAILS } from "features/game/types/images";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { InfoPopover } from "features/island/common/InfoPopover";

import { BeeSwarm } from "./BeeSwarm";
import { Label } from "components/ui/Label";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { DEFAULT_HONEY_PRODUCTION_TIME } from "features/game/lib/updateBeehives";
import { translate } from "lib/i18n/translate";
import Decimal from "decimal.js-light";
import { secondsToString } from "lib/utils/time";
import { formatNumber } from "lib/utils/formatNumber";
import { SUNNYSIDE } from "assets/sunnyside";
import { getHoneyMultiplier } from "features/game/events/landExpansion/harvestBeehive";

interface Props {
  id: string;
}
// gameService values
const getBeehiveById = (id: string) => (state: MachineState) => {
  return state.context.state.beehives[id];
};
const compareHive = (prevHive: IBeehive, nextHive: IBeehive) => {
  return JSON.stringify(prevHive) === JSON.stringify(nextHive);
};
const _landscaping = (state: MachineState) => state.matches("landscaping");

// beehiveService values
const _honeyReady = (state: BeehiveMachineState) => state.matches("honeyReady");
const _isProducing = (state: BeehiveMachineState) => state.context.isProducing;
const _honeyProduced = (state: BeehiveMachineState) =>
  state.context.honeyProduced;
const _currentSpeed = (state: BeehiveMachineState) =>
  state.context.currentSpeed;
const _currentFlowerId = (state: BeehiveMachineState) =>
  state.context.attachedFlower?.id;
const _showBeeAnimation = (state: BeehiveMachineState) =>
  state.matches("showBeeAnimation");
const _state = (state: MachineState) => state.context.state;

export const Beehive: React.FC<Props> = ({ id }) => {
  const { t } = useAppTranslation();
  const { showTimers, gameService } = useContext(Context);
  const isInitialMount = useRef(true);
  const [showProducingBee, setShowProducingBee] = useState<boolean>();
  const [showHoneyLevelModal, setShowHoneyLevelModal] = useState(false);
  const [showSwarmModal, setShowSwarmModal] = useState(false);
  const [showHoneyLevelPopover, setShowHoneyLevelPopover] = useState(false);
  const [showNoFlowerGrowingPopover, setShowNoFlowerGrowingPopover] =
    useState(false);

  const landscaping = useSelector(gameService, _landscaping);
  const hive = useSelector(gameService, getBeehiveById(id), compareHive);
  const gameState = useSelector(gameService, _state);

  const beehiveContext: BeehiveContext = {
    gameState,
    hive,
    honeyProduced: getCurrentHoneyProduced(hive),
    currentSpeed: getCurrentSpeed(hive),
  };

  const beehiveService = useInterpret(beehiveMachine, {
    context: beehiveContext,
  }) as unknown as MachineInterpreter;

  const honeyReady = useSelector(beehiveService, _honeyReady);
  const isProducing = useSelector(beehiveService, _isProducing);
  const honeyProduced = useSelector(beehiveService, _honeyProduced);
  const currentSpeed = useSelector(beehiveService, _currentSpeed);
  const currentFlowerId = useSelector(beehiveService, _currentFlowerId);
  const showBeeAnimation = useSelector(beehiveService, _showBeeAnimation);

  const honeyMultiplier = getHoneyMultiplier(gameState);

  const handleBeeAnimationEnd = useCallback(() => {
    beehiveService.send("BEE_ANIMATION_DONE");
    if (!honeyReady) setShowProducingBee(true);
  }, [honeyReady, beehiveService]);

  const handleHarvestHoney = () => {
    if (hive.swarm && honeyReady) {
      setShowSwarmModal(true);
    }

    setShowHoneyLevelModal(false);

    const state = gameService.send("beehive.harvested", { id });
    beehiveService.send("HARVEST_HONEY", {
      updatedHive: state.context.state.beehives[id],
    });
  };

  const handleHiveClick = () => {
    if (!honeyProduced) return;

    setShowHoneyLevelModal(true);
  };

  const handleHover = () => {
    if (hive.flowers.length === 0 && !honeyProduced) {
      setShowNoFlowerGrowingPopover(true);
      return;
    }

    if (!honeyReady) {
      setShowHoneyLevelPopover(true);
    }
  };

  const handleMouseLeave = () => {
    if (showHoneyLevelPopover) {
      setShowHoneyLevelPopover(false);
      return;
    }

    if (showNoFlowerGrowingPopover) {
      setShowNoFlowerGrowingPopover(false);
      return;
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    beehiveService.send("UPDATE_HIVE", { updatedHive: hive });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hive, beehiveService]);

  useEffect(() => {
    if (isProducing === undefined) return;

    if (!showProducingBee && isProducing) {
      setShowProducingBee(true);
      return;
    }

    if (showProducingBee && !isProducing) {
      setShowProducingBee(false);
    }
  }, [isProducing, showProducingBee]);

  useEffect(() => {
    if (honeyProduced === 1 && showHoneyLevelPopover) {
      setShowHoneyLevelPopover(false);
    }
  }, [honeyProduced, showHoneyLevelPopover]);

  const honeyAmount = new Decimal(honeyProduced / DEFAULT_HONEY_PRODUCTION_TIME)
    .todp(4, Decimal.ROUND_DOWN)
    .toNumber();

  const honeyPercentageDisplay = `${formatNumber(honeyAmount * 100, {
    decimalPlaces: 2,
    showTrailingZeros: true,
  })}%`;

  const percentage = (honeyProduced / DEFAULT_HONEY_PRODUCTION_TIME) * 100;
  const showQuantityBar =
    showTimers && !landscaping && !showBeeAnimation && honeyProduced > 0;

  const secondsLeftUntilFull =
    currentSpeed === 0
      ? undefined
      : Math.max(
          0,
          (DEFAULT_HONEY_PRODUCTION_TIME - honeyProduced) / currentSpeed / 1000,
        );

  return (
    <>
      <div
        className="cursor-pointer"
        onMouseEnter={handleHover}
        onMouseLeave={handleMouseLeave}
        onClick={handleHiveClick}
      >
        <img
          src={beehive}
          alt="Beehive"
          className="absolute bottom-0 hover:img-highlight"
          style={{
            width: `${PIXEL_SCALE * 16}px`,
          }}
        />
        {/* Honey drop indicating hive is full */}
        <img
          src={honeyDrop}
          alt="Honey Drop"
          className={classNames(
            "absolute top-0 transition-transform duration-700",
            {
              "scale-0": !honeyReady,
              "scale-100 honey-drop-ready": honeyReady,
            },
          )}
          style={{
            width: `${PIXEL_SCALE * 7}px`,
            right: `${PIXEL_SCALE * 2}px`,
          }}
        />
        {/* Bee to indicate honey is currently being produced */}
        {!showBeeAnimation &&
          !landscaping &&
          showProducingBee !== undefined &&
          !honeyReady && (
            <img
              src={bee}
              alt="Bee"
              className={classNames("absolute left-1/2 -translate-x-1/2", {
                "animate-enter-hive": !showProducingBee,
                "animate-exit-hive": showProducingBee,
              })}
              style={{
                width: `${PIXEL_SCALE * 7}px`,
              }}
            />
          )}
        {/* Progress bar for honey production */}
        {showQuantityBar && (
          <div
            className="absolute pointer-events-none"
            style={{
              top: `${PIXEL_SCALE * 13.2}px`,
              width: `${PIXEL_SCALE * 15}px`,
            }}
          >
            <Bar percentage={percentage} type="quantity" />
          </div>
        )}
        {/* Bee that flies between hive and flower */}
        {!landscaping && showBeeAnimation && (
          <Bee
            hiveX={hive.x}
            hiveY={hive.y}
            gameService={gameService}
            flowerId={currentFlowerId as string}
            onAnimationEnd={handleBeeAnimationEnd}
          />
        )}
        {/* No Active Flowers */}
        <div
          id="popover"
          className="flex justify-center absolute w-full pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * -19}px`,
          }}
        >
          <InfoPopover showPopover={showNoFlowerGrowingPopover}>
            <div className="flex flex-1 items-center text-xxs justify-center px-2 py-1 whitespace-nowrap">
              <span>{t("beehive.noFlowersGrowing")}</span>
            </div>
          </InfoPopover>
        </div>
        {/* Honey level popover */}
        <div
          id="popover"
          className="flex justify-center absolute w-full pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * -19}px`,
          }}
        >
          <InfoPopover showPopover={showHoneyLevelPopover}>
            <div className="flex flex-1 items-center text-xxs justify-center px-2 py-1 whitespace-nowrap">
              <img src={ITEM_DETAILS.Honey.image} className="w-4 mr-1" />
              <span>
                {t("honey")}
                {":"}{" "}
                {Number(honeyAmount) < 1
                  ? `${honeyPercentageDisplay} ${t("full")}`
                  : t("full")}
              </span>
            </div>
          </InfoPopover>
        </div>
      </div>
      {/* Harvest honey + honey level modal */}
      <Modal
        size="sm"
        show={showHoneyLevelModal}
        onHide={() => setShowHoneyLevelModal(false)}
      >
        <Panel bumpkinParts={NPC_WEARABLES.stevie}>
          <div className="flex relative items-center justify-center py-1 overflow-hidden">
            <div className="flex w-full" style={{ ...progressBarBorderStyle }}>
              {/* Progress bar (Quantity of honey) */}
              <div
                className="h-6 w-1/2 text-center transition-transform honey-production-gradient flex items-center justify-center"
                style={{
                  transform: `scaleX(${Math.min(percentage / 100, 1)})`,
                  transformOrigin: "top left",
                  width: "100%",
                }}
              />
              {/* Honey jar and amount text */}
              <div
                className={classNames(
                  "absolute top-1/2 -left-2 transition-transform w-full z-50 flex items-center",
                )}
                style={{
                  transform: `translate(calc(min(${
                    percentage > 2 ? percentage : 2
                  }%, 93%)), -50%)`,
                }}
              >
                <img
                  src={ITEM_DETAILS.Honey.image}
                  className="z-10"
                  style={{
                    width: PIXEL_SCALE * 10,
                    height: PIXEL_SCALE * 12,
                  }}
                  alt="Honey Jar"
                />
                <p
                  className={classNames(
                    "text-xxs mb-1 ml-1 transition-transform duration-300",
                    {
                      "-translate-x-[80px]":
                        percentage > 70 && percentage < 100,
                      "-translate-x-16": percentage >= 100,
                    },
                  )}
                >
                  {Number(honeyAmount) < 1 ? honeyPercentageDisplay : t("full")}
                </p>
              </div>
            </div>
          </div>
          {currentSpeed > 0 && !!secondsLeftUntilFull && (
            <>
              <div className="flex px-2 py-1 items-center gap-x-2 gap-y-1 flex-wrap">
                <Label type="default" icon={honeyDrop}>
                  {t("beehive.yield")}
                </Label>
                <div className="text-xs mb-0.5">
                  {t("beehive.honeyPerFullHive", {
                    multiplier: formatNumber(honeyMultiplier),
                  })}
                </div>
              </div>
              <div className="flex px-2 py-1 items-center gap-x-2 gap-y-1 flex-wrap">
                <Label type="default" icon={lightning}>
                  {t("beehive.speed")}
                </Label>
                <div className="text-xs mb-0.5">
                  {t("beehive.fullHivePerDay", {
                    speed: formatNumber(currentSpeed),
                    hive:
                      new Decimal(currentSpeed).toNumber() > 1
                        ? t("beehive.hives.plural")
                        : t("beehive.hive.singular"),
                  })}
                </div>
              </div>
            </>
          )}
          {currentSpeed === 0 && (
            <Label type="warning" className="m-1 mb-2">
              {t("beehive.honeyProductionPaused")}
            </Label>
          )}
          {!!secondsLeftUntilFull && (
            <div className="flex px-2 py-1 items-center gap-x-2 gap-y-1 flex-wrap">
              <Label type="default" icon={SUNNYSIDE.icons.stopwatch}>
                {t("beehive.estimatedFull")}
              </Label>
              <div className="text-xs mb-0.5">
                {secondsToString(secondsLeftUntilFull, {
                  length: "medium",
                })}
              </div>
            </div>
          )}
          <Button className="mt-1" onClick={handleHarvestHoney}>
            {t("beehive.harvestHoney")}
          </Button>
        </Panel>
      </Modal>
      {/* Bee swarm modal */}
      <Modal show={showSwarmModal} onHide={() => setShowSwarmModal(false)}>
        <Panel
          className="relative space-y-1"
          bumpkinParts={NPC_WEARABLES.stevie}
        >
          <Label type="vibrant" icon={lightning}>
            {t("beehive.beeSwarm")}
          </Label>
          <SpeakingText
            message={[
              {
                text: translate("beehive.pollinationCelebration"),
              },
            ]}
            onClose={() => setShowSwarmModal(false)}
          />
          <BeeSwarm />
        </Panel>
      </Modal>
    </>
  );
};
