import React, { useContext } from "react";
import { Button } from "components/ui/Button";

import humanDeath from "assets/npcs/human_death.gif";

import * as AuthProvider from "features/auth/lib/Provider";
import { removeJWT } from "../actions/social";
import { WalletContext } from "features/wallet/WalletProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Blocked: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const { walletService } = useContext(WalletContext);
  const { t } = useAppTranslation();
  const tryAgain = () => {
    removeJWT();

    authService.send("REFRESH");
    walletService.send("RESET");
  };

  return (
    <div className="flex flex-col text-center  items-center p-1">
      <div className="flex mb-3 items-center ml-8">
        <img src={humanDeath} alt={t("warning")} className="w-full" />
      </div>
      <p className="text-center mb-3">
        {t("errorAndAccess.blocked.betaTestersOnly")}
      </p>

      <p className="text-center mb-2 text-xs">
        {t("errorAndAccess.denied.message")}
      </p>
      <p className="text-center mb-4 text-xs">
        {t("errorAndAccess.instructions.part1")}{" "}
        <a
          className="underline hover:text-white"
          href="https://discord.gg/sunflowerland"
          target="_blank"
          rel="noreferrer"
        >
          {t("sflDiscord")}
        </a>
        {t("errorAndAccess.instructions.part2")}
      </p>
      <Button onClick={tryAgain} className="overflow-hidden mb-2">
        <span>{t("try.again")}</span>
      </Button>
    </div>
  );
};
