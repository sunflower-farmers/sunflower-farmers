import { createPortal } from "react-dom";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useActor } from "@xstate/react";

import * as AuthProvider from "features/auth/lib/Provider";
import { Context } from "features/game/GameProvider";
import { MinigameName } from "features/game/types/minigames";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";

import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CONFIG } from "lib/config";

import { portal } from "../community/actions/portal";
import { Loading } from "features/auth/components";
import { InventoryItemName } from "features/game/types/game";
import { Box } from "components/ui/Box";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";

import sflIcon from "assets/icons/sfl.webp";
import { IPortalDonation, PortalDonation } from "./PortalDonation";
import { getCachedFont } from "lib/utils/fonts";

interface Props {
  portalName: MinigameName;
  onClose: () => void;
}

type PortalPurchase = {
  sfl: number;
  items?: Partial<Record<InventoryItemName, number>>;
};

export const Portal: React.FC<Props> = ({ portalName, onClose }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const [url, setUrl] = useState<string>();

  const [loading, setLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [purchase, setPurchase] = useState<PortalPurchase | undefined>(
    undefined,
  );
  const [donation, setDonation] = useState<IPortalDonation | undefined>();

  const { t } = useAppTranslation();

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      let token = "";
      if (CONFIG.API_URL) {
        const { token: portalToken } = await portal({
          portalId: portalName,
          token: authState.context.user.rawToken as string,
          farmId: gameState.context.farmId,
        });
        token = portalToken;
      }

      const baseUrl = `https://${portalName}.sunflower-land.com`;

      // If testing a local portal, uncomment this line
      // baseUrl = `http://localhost:3001`;

      const language = localStorage.getItem("language") || "en";
      const font = getCachedFont();

      const url = `${baseUrl}?jwt=${token}&network=${CONFIG.NETWORK}&language=${language}&font=${font}`;

      setUrl(url);

      setLoading(false);
    };

    load();
  }, []);

  // Function to handle messages from the iframe
  const handleMessage = (event: any) => {
    if (event.data?.event === "closePortal") {
      // Close the modal when the message is received
      setLoading(false);
      setUrl("");
      onClose();
    }

    if (event.data?.event === "claimPrize") {
      // Close the modal when the message is received
      setLoading(false);
      setIsComplete(true);
      return;
    }

    if (event.data.event === "purchase") {
      // Purchase the item
      setPurchase(event.data);
      return;
    }

    if (event.data.event === "donated") {
      setDonation(event.data);
      return;
    }

    if (event.data.event === "attemptStarted") {
      // Start the minigame attempt
      gameService.send("minigame.attemptStarted", {
        id: portalName,
      });
      gameService.send("SAVE");
      return;
    }

    if (event.data.event === "scoreSubmitted") {
      // Submit the minigame score
      gameService.send("minigame.scoreSubmitted", {
        score: event.data.score,
        id: portalName,
      });
      gameService.send("SAVE");
      return;
    }

    // achievement
    if (event.data.event === "achievementsUnlocked") {
      gameService.send("minigame.achievementsUnlocked", {
        id: portalName,
        achievementNames: event.data.achievementNames,
      });
      gameService.send("SAVE");
      return;
    }
  };

  useEffect(() => {
    // Add event listener to listen for messages from any origin
    window.addEventListener("message", handleMessage);

    return () => {
      // Remove the event listener when the component is unmounted
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const confirmPurchase = () => {
    gameService.send("minigame.itemPurchased", {
      id: portalName,
      sfl: purchase?.sfl,
      items: purchase?.items,
    });
    gameService.send("SAVE");

    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        {
          event: "purchased",
          sfl: purchase?.sfl,
          items: purchase?.items,
        },
        "*",
      );
    }

    setPurchase(undefined);
  };

  const onClaim = () => {
    gameService.send("minigame.prizeClaimed", {
      id: portalName,
    });

    onClose();
  };

  if (loading) {
    return <Loading />;
  }

  if (isComplete) {
    const prize = gameState.context.state.minigames.prizes[portalName];
    return (
      <ClaimReward
        onClaim={onClaim}
        reward={{
          message: "Congratulations, you completed the mission!",
          createdAt: Date.now(),
          factionPoints: 0,
          id: "discord-bonus",
          items: prize?.items ?? {},
          wearables: prize?.wearables ?? {},
          sfl: 0,
          coins: prize?.coins ?? 0,
        }}
      />
    );
  }

  return (
    <>
      {createPortal(
        <div
          data-html2canvas-ignore="true"
          aria-label="Hud"
          className="fixed inset-0 z-50"
        >
          <iframe
            src={url}
            className="w-full h-full absolute z-10"
            ref={iframeRef} // Set ref to the iframe
          />
        </div>,
        document.body,
      )}
      {purchase &&
        createPortal(
          <div
            data-html2canvas-ignore="true"
            aria-label="Hud"
            className="fixed inset-safe-area z-[60] flex items-center justify-center"
            style={{
              background: "rgb(0 0 0 / 56%)",
            }}
          >
            <CloseButtonPanel
              className="w-[500px]"
              onClose={() => setPurchase(undefined)}
            >
              <div className="p-1">
                <Label type="default" className="mb-2">
                  {t("minigame.purchase")}
                </Label>
                <p className="text-sm">{`${t("minigame.confirm")}`}</p>
                {!!purchase.sfl && (
                  <div className="flex mb-1 items-center">
                    <Box image={sflIcon} />
                    <span className="ml-1">{`${purchase.sfl} x SFL`}</span>
                  </div>
                )}
                {getKeys(purchase.items ?? {}).map((key) => {
                  const item = purchase.items?.[key] ?? 0;
                  return (
                    <div className="flex mb-1 items-center" key={key}>
                      <Box image={ITEM_DETAILS[key].image} />
                      <span className="ml-1">{`${item} x ${key}`}</span>
                    </div>
                  );
                })}
              </div>
              <Button onClick={confirmPurchase}> {t("confirm")}</Button>
            </CloseButtonPanel>
          </div>,
          document.body,
        )}

      {!!donation &&
        createPortal(
          <div
            data-html2canvas-ignore="true"
            aria-label="Hud"
            className="fixed inset-safe-area z-[60] flex items-center justify-center"
            style={{
              background: "rgb(0 0 0 / 56%)",
            }}
          >
            <CloseButtonPanel
              className="w-[500px]"
              onClose={() => setDonation(undefined)}
            >
              <PortalDonation
                donation={donation}
                portalName={portalName}
                onClose={() => setDonation(undefined)}
              />
            </CloseButtonPanel>
          </div>,
          document.body,
        )}
      <Loading className="z-10 left-0 top-0" />
    </>
  );
};
