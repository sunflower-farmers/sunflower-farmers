import { useSelector } from "@xstate/react";
import React, { useContext, useState } from "react";

import { Button } from "components/ui/Button";
import { Box } from "components/ui/Box";

import { wallet } from "lib/blockchain/wallet";

import { getKeys } from "features/game/types/craftables";
import { SUNNYSIDE } from "assets/sunnyside";

import { CONFIG } from "lib/config";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { Label } from "components/ui/Label";
import { WalletAddressLabel } from "components/ui/WalletAddressLabel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { hasReputation, Reputation } from "features/game/lib/reputation";
import { RequiredReputation } from "features/island/hud/components/reputation/Reputation";

const imageDomain = CONFIG.NETWORK === "mainnet" ? "buds" : "testnet-buds";

interface Props {
  onWithdraw: (ids: number[]) => void;
}

const _state = (state: MachineState) => state.context.state;

export const WithdrawBuds: React.FC<Props> = ({ onWithdraw }) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);

  const buds = state.buds ?? {};

  const [unselected, setUnselected] = useState<number[]>(
    getKeys(buds).filter((budId) => !buds[budId].coordinates),
  );
  const [selected, setSelected] = useState<number[]>([]);

  const onAdd = (budId: number) => {
    setUnselected((prev) => prev.filter((bud) => bud !== budId));
    setSelected((prev) => [...prev, budId]);
  };

  const onRemove = (budId: number) => {
    setUnselected((prev) => [...prev, budId]);
    setSelected((prev) => prev.filter((bud) => bud !== budId));
  };

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
          {t("withdraw.buds")}
        </Label>
        <div className="flex flex-wrap h-fit -ml-1.5">
          {unselected.map((budId) => (
            <Box
              key={`bud-${budId}`}
              onClick={() => onAdd(budId)}
              image={`https://${imageDomain}.sunflower-land.com/images/${budId}.webp`}
              iconClassName="scale-[1.8] origin-bottom absolute"
            />
          ))}
          {/* Pad with empty boxes */}
          {unselected.length < 4 &&
            new Array(4 - unselected.length)
              .fill(null)
              .map((_, index) => <Box disabled key={index} />)}
        </div>

        <div className="mt-4">
          <Label type="default" className="mb-2">
            {t("selected")}
          </Label>
          <div className="flex flex-wrap h-fit mt-2 -ml-1.5">
            {selected.map((budId) => (
              <Box
                key={`bud-${budId}`}
                onClick={() => onRemove(budId)}
                image={`https://${imageDomain}.sunflower-land.com/images/${budId}.webp`}
                iconClassName="scale-[1.8] origin-bottom absolute"
              />
            ))}
            {/* Pad with empty boxes */}
            {selected.length < 4 &&
              new Array(4 - selected.length)
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

      <Button
        onClick={() => onWithdraw(selected)}
        disabled={selected.length <= 0}
      >
        {t("withdraw")}
      </Button>
    </>
  );
};
