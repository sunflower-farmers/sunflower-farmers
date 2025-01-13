import React, { FC, useState } from "react";

import { createContext } from "react";
import { Modal } from "components/ui/Modal";
import { StoreOnChainModal } from "./components/StoreOnChainModal";
import { SpeakingModal } from "../SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { translate } from "lib/i18n/translate";
import { BuyCurrenciesModal } from "features/island/hud/components/BuyCurrenciesModal";
import { VIPItems } from "./components/VIPItems";
import { Panel } from "components/ui/Panel";
import { ReputationSystem } from "features/island/hud/components/reputation/Reputation";

type GlobalModal =
  | "BUY_GEMS"
  | "BUY_BANNER"
  | "STORE_ON_CHAIN"
  | "FIRST_EXPANSION"
  | "NEXT_EXPANSION"
  | "SECOND_LEVEL"
  | "FIREPIT"
  | "BETTY"
  | "BLACKSMITH"
  | "VIP_ITEMS"
  | "REPUTATION";

export const ModalContext = createContext<{
  openModal: (type: GlobalModal) => void;
  // eslint-disable-next-line no-console
}>({ openModal: console.log });

export const ModalProvider: FC = ({ children }) => {
  const [opened, setOpened] = useState<GlobalModal>();
  const [closeable, setCloseable] = useState(true);

  const openModal = (type: GlobalModal) => {
    setOpened(type);
  };

  const handleClose = () => {
    if (!closeable) return;

    setOpened(undefined);
  };

  return (
    <ModalContext.Provider value={{ openModal }}>
      {children}

      <BuyCurrenciesModal
        show={opened === "BUY_GEMS"}
        onClose={handleClose}
        initialTab={0}
      />

      <BuyCurrenciesModal
        show={opened === "BUY_BANNER"}
        onClose={handleClose}
        initialTab={2}
      />

      <Modal show={opened === "VIP_ITEMS"} onHide={handleClose}>
        <Panel>
          <VIPItems onSkip={handleClose} onClose={handleClose} />
        </Panel>
      </Modal>

      <Modal show={opened === "STORE_ON_CHAIN"} onHide={handleClose}>
        <StoreOnChainModal onClose={handleClose} />
      </Modal>

      <Modal show={opened === "REPUTATION"} onHide={handleClose}>
        <ReputationSystem onClose={handleClose} />
      </Modal>

      <Modal show={opened === "FIRST_EXPANSION"}>
        <SpeakingModal
          message={[
            {
              text: translate("pete.first-expansion.one"),
            },
            {
              text: translate("pete.first-expansion.two"),
            },
            {
              text: translate("pete.first-expansion.three"),
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
        />
      </Modal>

      <Modal show={opened === "NEXT_EXPANSION"}>
        <SpeakingModal
          message={[
            {
              text: translate("pete.first-expansion.four"),
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
        />
      </Modal>
      <Modal show={opened === "BETTY"}>
        <SpeakingModal
          message={[
            {
              text: translate("betty.market-intro.one"),
            },
            {
              text: translate("betty.market-intro.two"),
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES.betty}
        />
      </Modal>

      <Modal show={opened === "FIREPIT"}>
        <SpeakingModal
          message={[
            {
              text: translate("firepit-intro.one"),
            },
            {
              text: translate("firepit-intro.two"),
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES.bruce}
        />
      </Modal>

      <Modal show={opened === "BLACKSMITH"}>
        <SpeakingModal
          message={[
            {
              text: translate("pete.craftScarecrow.one"),
            },
            {
              text: translate("pete.craftScarecrow.two"),
            },
            {
              text: translate("pete.craftScarecrow.three"),
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
        />
      </Modal>
      <Modal show={opened === "SECOND_LEVEL"}>
        <SpeakingModal
          message={[
            {
              text: translate("pete.levelthree.one"),
            },
            {
              text: translate("pete.levelthree.two"),
            },
            {
              text: translate("pete.levelthree.three"),
            },
          ]}
          onClose={handleClose}
          bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
        />
      </Modal>
    </ModalContext.Provider>
  );
};
