import React from "react";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const FullMoon: React.FC<{
  acknowledge: () => void;
}> = ({ acknowledge }) => {
  const { t } = useAppTranslation();

  return (
    <>
      <Panel className="relative z-10">
        {`Full Moon`}
        <Button onClick={acknowledge}>{t("continue")}</Button>
      </Panel>
    </>
  );
};
