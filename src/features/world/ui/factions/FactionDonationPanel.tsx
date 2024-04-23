import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { MachineState } from "features/game/lib/gameMachine";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NPCName } from "lib/npcs";
import { OuterPanel } from "components/ui/Panel";
import { SquareIcon } from "components/ui/SquareIcon";
import { InlineDialogue } from "../TypingMessage";
import classNames from "classnames";
import { setPrecision } from "lib/utils/formatNumber";

import sflIcon from "assets/icons/sfl.webp";
import chest from "assets/icons/chest.png";
import sunflorianPointIcon from "assets/icons/sunflorians_point.webp";
import goblinsPointIcon from "assets/icons/goblins_point.webp";
import nightshadesPointIcon from "assets/icons/nightshades_point.webp";
import bumpkinsPointIcon from "assets/icons/bumpkins_point.webp";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import Decimal from "decimal.js-light";
import { getDayOfYear } from "lib/utils/time";
import { Faction, FactionName } from "features/game/types/game";

interface Props {
  npc: NPCName;
  onClose: () => void;
}

const POINT_ICONS: Record<FactionName, string> = {
  sunflorians: sunflorianPointIcon,
  goblins: goblinsPointIcon,
  nightshades: nightshadesPointIcon,
  bumpkins: bumpkinsPointIcon,
};

const MAX_SFL = 500;
const MIN_SFL = 10;
const SFL_POINTS_PER_DONATION = 20;
const RESOURCE_POINTS_PER_DONATION = 5;

const _donationRequest = (state: MachineState) =>
  state.context.state.dailyFactionDonationRequest;
const _faction = (state: MachineState) =>
  state.context.state.faction as Faction;
const _balance = (state: MachineState) => state.context.state.balance;
const _inventory = (state: MachineState) => state.context.state.inventory;

export const FactionDonationPanel: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const donationRequest = useSelector(gameService, _donationRequest);
  const faction = useSelector(gameService, _faction);
  const balance = useSelector(gameService, _balance);
  const inventory = useSelector(gameService, _inventory);

  const [sflTotal, setSflToday] = useState<number>(0);
  const [resourceTotal, setResourceTotal] = useState<number>(0);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const resourceBalance = donationRequest?.resource
    ? inventory[donationRequest.resource] ?? new Decimal(0)
    : new Decimal(0);

  const requestedResourceAmount = donationRequest?.amount.toNumber() ?? 0;

  const onDonate = () => {
    gameService.send("faction.donated", {
      faction: faction.name,
      donation: {
        sfl: sflTotal,
        resources: resourceTotal,
      },
    });

    onClose();
  };

  const incrementSFL = () => {
    setSflToday((prev) => {
      const newTotal = prev + 10;

      if (newTotal > MAX_SFL) {
        return MAX_SFL;
      }

      return newTotal;
    });
  };

  const decrementSFL = () => {
    setSflToday((prev) => {
      const newTotal = prev - 10;

      if (newTotal < 0) return 0;

      return newTotal;
    });
  };

  const incrementResource = () => {
    if (!donationRequest) return;

    setResourceTotal((prev) => {
      const newTotal = prev + requestedResourceAmount;

      if (newTotal > resourceBalance.toNumber()) {
        return prev;
      }

      return newTotal;
    });
  };

  const decrementResource = () => {
    if (!donationRequest) return;

    setResourceTotal((prev) => {
      const newTotal = prev - requestedResourceAmount;

      if (newTotal < 0) return 0;

      return newTotal;
    });
  };

  const getHasEnoughSFL = (amountToAdd = 0) => {
    return balance.gte(sflTotal + amountToAdd);
  };

  const getHasEnoughResources = (amountToAdd = 0) => {
    const requestAmount = donationRequest?.amount.toNumber() ?? 0;
    const amountToCompare =
      requestAmount > resourceTotal ? requestAmount : resourceTotal;

    return resourceBalance.gte(amountToCompare + amountToAdd);
  };

  const getSFLDonatedToday = () => {
    const today = getDayOfYear(new Date());
    const donatedSFLToday = faction.donated.daily.sfl.day === today;

    if (!donatedSFLToday) return 0;

    return faction.donated.daily.sfl.amount;
  };

  const getResourcesDonatedToday = () => {
    const today = getDayOfYear(new Date());
    const donatedResourcesToday = faction.donated.daily.resources.day === today;

    if (!donatedResourcesToday) return 0;

    return faction.donated.daily.resources.amount;
  };

  const getTotalPointsDue = () => {
    let total = 0;

    if (sflTotal > 0) {
      total += (sflTotal / 10) * SFL_POINTS_PER_DONATION;
    }

    if (resourceTotal > 0) {
      total +=
        (resourceTotal / requestedResourceAmount) *
        RESOURCE_POINTS_PER_DONATION;
    }

    return total;
  };

  return (
    <CloseButtonPanel
      onClose={showConfirm ? () => setShowConfirm(false) : onClose}
    >
      {!showConfirm && (
        <>
          <div className="p-2 space-y-2">
            <Label
              type="default"
              icon={POINT_ICONS[faction.name]}
              className="capitalize"
            >
              {`${faction.name} Faction Donations`}
            </Label>
            <div
              style={{
                minHeight: "65px",
              }}
              className="mb-3"
            >
              <InlineDialogue
                key={1}
                trail={25}
                message={t("faction.donation.request.message", {
                  faction: faction.name,
                })}
              />
            </div>
          </div>
          {/* SFL DONATIONS */}
          <div className="flex flex-col space-y-1 justify-start sm:space-y-0 sm:flex-row sm:justify-between mt-3 mb-2">
            <Label
              icon={sflIcon}
              type="default"
              className="ml-2"
            >{`SFL donations (min 10)`}</Label>
            <Label
              type="info"
              className="ml-2"
            >{`${getSFLDonatedToday()}/500 max per day`}</Label>
          </div>
          <OuterPanel className="flex flex-col space-y-1">
            <div className="flex justify-between">
              <div className="flex items-center">
                <SquareIcon icon={sflIcon} width={7} />
                <span className="text-xs ml-1">{"SFL"}</span>
              </div>
              <Label
                className={classNames("whitespace-nowrap", {
                  "ml-1": !getHasEnoughSFL(),
                })}
                type={getHasEnoughSFL() ? "transparent" : "danger"}
              >
                {`${MIN_SFL}/${setPrecision(balance, 1)}`}
              </Label>
            </div>
            <div className="flex justify-between">
              <Label icon={chest} type="warning" className="ml-1.5">
                {t("reward")}
              </Label>
              <div className="flex items-center">
                <img
                  src={POINT_ICONS[faction.name]}
                  className="w-4 h-auto mr-1"
                />
                <span className="text-xxs">{`${SFL_POINTS_PER_DONATION}`}</span>
              </div>
            </div>
          </OuterPanel>
          <div className="flex my-1">
            <div className="flex flex-1 justify-end mr-2 space-x-1">
              <Button
                disabled={!getHasEnoughSFL(10)}
                className="h-8 w-16"
                onClick={incrementSFL}
              >{`+10`}</Button>
              <Button
                disabled={sflTotal === 0}
                className="h-8 w-16"
                onClick={decrementSFL}
              >{`-10`}</Button>
            </div>
            <div className="flex items-center">
              <span
                className={classNames("min-w-[80px] flex justify-end text-sm", {
                  "text-red-500": !getHasEnoughSFL(),
                  "text-white": getHasEnoughSFL(),
                })}
              >{`${sflTotal}`}</span>
              <SquareIcon icon={sflIcon} width={7} className="ml-1 mt-0.5" />
            </div>
          </div>
          {/* BULK RESOURCE DONATIONS */}
          {!!donationRequest && (
            <>
              <div className="flex flex-col space-y-1 justify-start sm:space-y-0 sm:flex-row sm:justify-between mt-3 mb-2">
                <Label
                  icon={ITEM_DETAILS[donationRequest.resource].image}
                  type="default"
                  className="ml-2"
                >{`Bulk resource donation (min ${requestedResourceAmount})`}</Label>
                <Label
                  type="info"
                  className="ml-2"
                >{`${getResourcesDonatedToday()}/unlimited per day`}</Label>
              </div>
              <OuterPanel className="flex flex-col space-y-1">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <SquareIcon
                      icon={ITEM_DETAILS[donationRequest.resource].image}
                      width={7}
                    />
                    <span className="text-xs ml-1">
                      {donationRequest.resource}
                    </span>
                  </div>
                  <Label
                    className={classNames("whitespace-nowrap", {
                      "ml-1": !getHasEnoughResources(),
                    })}
                    type={getHasEnoughResources() ? "transparent" : "danger"}
                  >
                    {`${donationRequest.amount}/${setPrecision(
                      resourceBalance,
                      1
                    )}`}
                  </Label>
                </div>
                <div className="flex justify-between">
                  <Label icon={chest} type="warning" className="ml-1.5">
                    {t("reward")}
                  </Label>
                  <div className="flex items-center">
                    <img
                      src={POINT_ICONS[faction.name]}
                      className="w-4 h-auto mr-1"
                    />
                    <span className="text-xxs">{`${RESOURCE_POINTS_PER_DONATION}`}</span>
                  </div>
                </div>
              </OuterPanel>
              {/* Donation Buttons */}
              <div className="flex my-1">
                <div className="flex flex-1 justify-end mr-2 space-x-1">
                  <Button
                    disabled={!getHasEnoughResources(requestedResourceAmount)}
                    className="h-8 w-16"
                    onClick={incrementResource}
                  >{`+${requestedResourceAmount}`}</Button>
                  <Button
                    disabled={resourceTotal === 0}
                    className="h-8 w-16"
                    onClick={decrementResource}
                  >{`-${requestedResourceAmount}`}</Button>
                </div>
                <div className="flex items-center">
                  <span
                    className={"min-w-[80px] flex justify-end text-sm"}
                  >{`${resourceTotal}`}</span>
                  <SquareIcon
                    icon={ITEM_DETAILS[donationRequest.resource].image}
                    width={7}
                    className="ml-1 mt-0.5"
                  />
                </div>
              </div>
            </>
          )}
          <div className="mt-4 mb-3 w-full flex px-2">
            <span className="text-xs">{`You will receive ${getTotalPointsDue()}`}</span>
            <img src={POINT_ICONS[faction.name]} className="w-4 ml-1 mt-0.5" />
          </div>
          <Button
            disabled={sflTotal === 0 && resourceTotal === 0}
            onClick={() => setShowConfirm(true)}
          >{`Donate`}</Button>
        </>
      )}
      {showConfirm && (
        <>
          <div className="p-2 space-y-3">
            <Label
              type="default"
              icon={POINT_ICONS[faction.name]}
              className="capitalize"
            >
              {`${faction.name} Faction Donations`}
            </Label>
            <span className="text-xs">{`Are you sure you want to donate the following for a total of ${getTotalPointsDue()} faction points?`}</span>
            <div className="flex flex-col space-y-1">
              {sflTotal > 0 && (
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <SquareIcon icon={sflIcon} width={7} />
                    <span className="text-xs ml-1">{"SFL"}</span>
                  </div>
                  <span className="text-xs">{`${sflTotal}`}</span>
                </div>
              )}
              {!!donationRequest && resourceTotal > 0 && (
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <SquareIcon
                      icon={ITEM_DETAILS[donationRequest.resource].image}
                      width={7}
                    />
                    <span className="text-xs ml-1">
                      {donationRequest.resource}
                    </span>
                  </div>
                  <span className="text-xs">{`${resourceTotal}`}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex space-x-1 mt-2">
            <Button onClick={() => setShowConfirm(false)}>{`Cancel`}</Button>
            <Button onClick={onDonate}>{`Confirm`}</Button>
          </div>
        </>
      )}
    </CloseButtonPanel>
  );
};
