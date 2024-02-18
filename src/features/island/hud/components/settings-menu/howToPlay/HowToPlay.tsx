import React, { useEffect } from "react";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { Modal } from "components/ui/Modal";

import { HowToFarm } from "./HowToFarm";
import { HowToUpgrade } from "./HowToUpgrade";
import { HowToSync } from "./HowToSync";
import { LetsGo } from "./LetsGo";
import { useIsNewFarm } from "features/farming/hud/lib/onboarding";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

enum Steps {
  HowToFarm = 1,
  HowToUpgrade = 2,
  HowToSync = 3,
  LetsGo = 4,
}
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlay: React.FC<Props> = ({ isOpen, onClose }) => {
  const [step, setStep] = React.useState(Steps.HowToFarm);
  const { t } = useAppTranslation();
  useEffect(() => {
    if (isOpen) {
      setStep(Steps.HowToFarm);
    }
  }, [isOpen]);

  const previous = () => {
    setStep(step - 1);
  };

  const next = () => {
    setStep(step + 1);
  };

  const finish = () => {
    onClose();
  };

  const canClose = !useIsNewFarm();

  return (
    <Modal show={isOpen} onHide={canClose ? onClose : undefined}>
      <Panel>
        {step === Steps.HowToFarm && <HowToFarm onClose={onClose} />}
        {step === Steps.HowToUpgrade && (
          <HowToUpgrade onClose={onClose} onBack={previous} />
        )}
        {step === Steps.HowToSync && (
          <HowToSync onClose={onClose} onBack={previous} />
        )}
        {step === Steps.LetsGo && (
          <LetsGo onClose={onClose} onBack={previous} />
        )}

        <Modal.Footer className="justify-content-center">
          {step === Steps.LetsGo ? (
            <Button className="text-s px-1" onClick={finish}>
              {t("lets.go")}
            </Button>
          ) : (
            <Button className="text-s px-1" onClick={next}>
              {t("next")}
            </Button>
          )}
        </Modal.Footer>
      </Panel>
    </Modal>
  );
};
