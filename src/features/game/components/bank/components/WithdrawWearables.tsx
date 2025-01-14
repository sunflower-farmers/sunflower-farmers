import { useSelector } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";
import Decimal from "decimal.js-light";

import { GameState, Wardrobe } from "features/game/types/game";

import { Button } from "components/ui/Button";
import { Box } from "components/ui/Box";

import { wallet } from "lib/blockchain/wallet";

import { getKeys } from "features/game/types/craftables";
import { SUNNYSIDE } from "assets/sunnyside";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { availableWardrobe } from "features/game/events/landExpansion/equip";
import { BUMPKIN_RELEASES } from "features/game/types/withdrawables";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import { getImageUrl } from "lib/utils/getImageURLS";
import { MachineState } from "features/game/lib/gameMachine";
import { Label } from "components/ui/Label";
import { WalletAddressLabel } from "components/ui/WalletAddressLabel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { canWithdrawBoostedWearable } from "features/game/types/wearableValidation";
import { hasReputation, Reputation } from "features/game/lib/reputation";
import { RequiredReputation } from "features/island/hud/components/reputation/Reputation";

export const isCurrentObsession = (itemName: BumpkinItem, game: GameState) => {
  const obsessionCompletedAt = game.npcs?.bert?.questCompletedAt;
  const currentObsession = game.bertObsession;

  if (!obsessionCompletedAt || !currentObsession) return false;
  if (currentObsession.name !== itemName) return false;

  return (
    obsessionCompletedAt >= currentObsession.startDate &&
    obsessionCompletedAt <= currentObsession.endDate
  );
};

interface Props {
  onWithdraw: (ids: number[], amounts: number[]) => void;
}

const _state = (state: MachineState) => state.context.state;

export const WithdrawWearables: React.FC<Props> = ({ onWithdraw }) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);

  const [wardrobe, setWardrobe] = useState<Wardrobe>({});
  const [selected, setSelected] = useState<Wardrobe>({});

  useEffect(() => {
    let available = availableWardrobe(state);

    available = getKeys(available).reduce((acc, key) => {
      const currentAmount = available[key] ?? 0;
      const onChainAMount = state.previousWardrobe[key] ?? 0;

      return {
        ...acc,
        [key]: Math.min(currentAmount, onChainAMount),
      };
    }, {} as Wardrobe);

    setWardrobe(available);
  }, [state]);

  const withdraw = () => {
    const ids = getKeys(selected).map((item) => ITEM_IDS[item]);
    const amounts = getKeys(selected).map((item) => selected[item]) as number[];

    onWithdraw(ids, amounts);
  };

  const onAdd = (itemName: BumpkinItem) => {
    setWardrobe((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] ?? 0) - 1,
    }));

    setSelected((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] ?? 0) + 1,
    }));
  };

  const onRemove = (itemName: BumpkinItem) => {
    setWardrobe((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] ?? 0) + 1,
    }));

    setSelected((prev) => {
      const newSelected = { ...prev };
      if (newSelected[itemName] === 1) {
        delete newSelected[itemName];
      } else {
        newSelected[itemName] = (newSelected[itemName] ?? 0) - 1;
      }
      return newSelected;
    });
  };

  const withdrawableItems = [...new Set([...getKeys(wardrobe)])]
    .filter((item) => wardrobe[item] && !isCurrentObsession(item, state))
    .sort((a, b) => ITEM_IDS[a] - ITEM_IDS[b]);

  const selectedItems = getKeys(selected)
    .filter((item) => !!selected[item])
    .sort((a, b) => ITEM_IDS[a] - ITEM_IDS[b]);

  const hasAccess = hasReputation({
    game: state,
    reputation: Reputation.Seedling,
  });

  if (!hasAccess) {
    return <RequiredReputation reputation={Reputation.Seedling} />;
  }

  return (
    <>
      <div className="p-2 mb-2">
        <Label type="warning" className="mb-2">
          <span className="text-xs">{t("withdraw.restricted")}</span>
        </Label>
        <Label type="default" className="mb-2">
          {t("withdraw.select.item")}
        </Label>
        <div className="flex flex-wrap h-fit -ml-1.5">
          {withdrawableItems.map((itemName) => {
            const wardrobeCount = wardrobe[itemName];

            const withdrawAt = BUMPKIN_RELEASES[itemName]?.withdrawAt;
            const canWithdraw = !!withdrawAt && withdrawAt <= new Date();
            const isInUse = !canWithdrawBoostedWearable(itemName, state);

            return (
              <Box
                count={new Decimal(wardrobeCount ?? 0)}
                key={itemName}
                onClick={() => onAdd(itemName)}
                disabled={
                  isInUse || !canWithdraw || selected[itemName] !== undefined
                }
                image={getImageUrl(ITEM_IDS[itemName])}
              />
            );
          })}
          {/* Pad with empty boxes */}
          {withdrawableItems.length < 4 &&
            new Array(4 - withdrawableItems.length)
              .fill(null)
              .map((_, index) => <Box disabled key={index} />)}
        </div>

        <div className="mt-4">
          <Label type="default" className="mb-2">
            {t("selected")}
          </Label>
          <div className="flex flex-wrap h-fit mt-2 -ml-1.5">
            {selectedItems.map((itemName) => {
              return (
                <Box
                  count={new Decimal(selected[itemName] ?? 0)}
                  key={itemName}
                  onClick={() => onRemove(itemName)}
                  image={getImageUrl(ITEM_IDS[itemName])}
                />
              );
            })}
            {/* Pad with empty boxes */}
            {selectedItems.length < 4 &&
              new Array(4 - selectedItems.length)
                .fill(null)
                .map((_, index) => <Box disabled key={index} />)}
          </div>
        </div>

        <div className="w-full my-3 border-t border-white" />
        <div className="flex items-center mb-2 text-xs">
          <img
            src={SUNNYSIDE.icons.player}
            className="mr-3"
            style={{
              width: `${PIXEL_SCALE * 13}px`,
            }}
          />
          <div className="flex flex-col gap-1">
            <p>{t("withdraw.send.wallet")}</p>
            <WalletAddressLabel walletAddress={wallet.getAccount() || "XXXX"} />
          </div>
        </div>

        <p className="text-xs">
          {t("withdraw.opensea")}{" "}
          <a
            className="underline hover:text-blue-500"
            href="https://docs.sunflower-land.com/fundamentals/withdrawing"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("read.more")}
          </a>
        </p>
      </div>

      <Button onClick={withdraw} disabled={selectedItems.length <= 0}>
        {t("withdraw")}
      </Button>
    </>
  );
};
