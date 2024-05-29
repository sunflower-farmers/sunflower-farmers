import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext } from "react";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { ContentComponentProps } from "../GameOptions";
import { useIsDarkMode } from "lib/utils/hooks/useIsDarkMode";

export const GeneralSettings: React.FC<ContentComponentProps> = ({
  onSubMenuClick,
}) => {
  const { t } = useAppTranslation();

  const { isDarkMode, toggleDarkMode } = useIsDarkMode();

  const { showAnimations, toggleAnimations } = useContext(Context);

  const onToggleAnimations = () => {
    toggleAnimations();
  };

  return (
    <>
      <Button onClick={() => onSubMenuClick("discord")} className="mb-2">
        <span>{`Discord`}</span>
      </Button>
      <Button onClick={() => onSubMenuClick("changeLanguage")} className="mb-2">
        <span>{t("gameOptions.generalSettings.changeLanguage")}</span>
      </Button>
      <Button className="mb-2" onClick={toggleDarkMode}>
        <span>
          {isDarkMode
            ? t("gameOptions.generalSettings.darkMode")
            : t("gameOptions.generalSettings.lightMode")}
        </span>
      </Button>
      <Button className="mb-2" onClick={onToggleAnimations}>
        <span>
          {showAnimations
            ? t("gameOptions.generalSettings.disableAnimations")
            : t("gameOptions.generalSettings.enableAnimations")}
        </span>
      </Button>
      <Button onClick={() => onSubMenuClick("share")} className="mb-2">
        <span>{t("gameOptions.generalSettings.share")}</span>
      </Button>
    </>
  );
};
