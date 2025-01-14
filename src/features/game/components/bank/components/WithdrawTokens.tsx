import { useSelector } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";
import Decimal from "decimal.js-light";
import { toWei } from "web3-utils";

import { Button } from "components/ui/Button";

import { wallet } from "lib/blockchain/wallet";

import lightning from "assets/icons/lightning.png";

import { getTax } from "lib/utils/tax";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import { formatNumber, setPrecision } from "lib/utils/formatNumber";
import { WalletAddressLabel } from "components/ui/WalletAddressLabel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import { NumberInput } from "components/ui/NumberInput";
import { Label } from "components/ui/Label";
import { hasReputation, Reputation } from "features/game/lib/reputation";
import { RequiredReputation } from "features/island/hud/components/reputation/Reputation";

interface Props {
  onWithdraw: (sfl: string) => void;
}

const _state = (state: MachineState) => state.context.state;

export const WithdrawTokens: React.FC<Props> = ({ onWithdraw }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);

  const [amount, setAmount] = useState<Decimal>(new Decimal(0));
  const [tax, setTax] = useState(0);

  // use whichever is lowest (current game state or on chain)
  const balance = state.previousBalance.lessThan(state.balance)
    ? state.previousBalance
    : state.balance;

  useEffect(() => {
    const _tax = getTax({
      amount: typeof amount !== "string" ? amount : new Decimal(0),
      game: state,
    });

    setTax(_tax);
  }, [amount]);

  const withdraw = () => {
    if (amount > new Decimal(0)) {
      onWithdraw(toWei(amount.toString()));
    } else {
      setAmount(new Decimal(0));
    }
  };

  const hasAccess = hasReputation({
    game: state,
    reputation: Reputation.Grower,
  });

  if (!hasAccess) {
    return <RequiredReputation reputation={Reputation.Grower} />;
  }

  const disableWithdraw = amount.greaterThan(balance) || amount.lessThan(0);

  return (
    <>
      <div className="p-2 mb-2">
        <Label type="default">{t("withdraw.choose")}</Label>
        <p className="text-sm mt-2">
          {formatNumber(balance, { decimalPlaces: 4 })}{" "}
          {t("withdraw.sfl.available")}
        </p>

        <div>
          <div className="flex items-center mt-2">
            <NumberInput
              value={amount}
              maxDecimalPlaces={4}
              isOutOfRange={disableWithdraw}
              onValueChange={setAmount}
            />
            <Button
              onClick={() => setAmount(setPrecision(balance.mul(0.5)))}
              className="ml-2 px-1 py-1 w-auto"
            >
              {`50%`}
            </Button>
            <Button
              onClick={() => setAmount(setPrecision(balance))}
              className="ml-2 px-1 py-1 w-auto"
            >
              {t("max")}
            </Button>
          </div>

          <p className="text-xs flex items-center gap-2">
            {state.inventory["Liquidity Provider"] && (
              <img
                src={lightning}
                style={{
                  width: `${PIXEL_SCALE * 8}px`,
                }}
              />
            )}
            {`${tax} ${t("fee")} `}
            <a
              className="underline hover:text-blue-500"
              href="https://docs.sunflower-land.com/fundamentals/withdrawing"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("read.more")}
            </a>
          </p>
          <p className="text-xs mt-1">{t("withdraw.taxFree")}</p>
        </div>

        <Label type="warning" className="my-4">
          {t("withdraw.receive", {
            sflReceived: formatNumber(amount.sub(tax), {
              decimalPlaces: 4,
            }),
          })}
        </Label>

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
      </div>

      <Button onClick={withdraw} disabled={disableWithdraw}>
        {t("withdraw")}
      </Button>
    </>
  );
};
