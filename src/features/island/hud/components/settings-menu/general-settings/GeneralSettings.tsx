import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext } from "react";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { ContentComponentProps } from "../GameOptions";

export const GeneralSettings: React.FC<ContentComponentProps> = ({
  onSubMenuClick,
}) => {
  const { t } = useAppTranslation();

  const { showAnimations, toggleAnimations } = useContext(Context);

  const onToggleAnimations = () => {
    toggleAnimations();
  };

  return (
    <>
      <Button
        onClick={() => {
          const redirect = encodeURIComponent(
            CONFIG.DISCORD_REDIRECT as string,
          );
          const appKey = "RWi72tQ1oz8i"; // TODO .env?
          const url = `https://id.fsl.com/api/account/oauth/authorize?response_type=code&appkey=${appKey}&redirect_uri=${redirect}&scope=basic%20wallet`;

          window.location.href = url;
        }}
        className="mb-1"
      >
        <span>{`FSL`}</span>
      </Button>
      <Button onClick={() => onSubMenuClick("discord")} className="mb-1">
        <span>{`Discord`}</span>
      </Button>
      <Button onClick={() => onSubMenuClick("changeLanguage")} className="mb-1">
        <span>{t("gameOptions.generalSettings.changeLanguage")}</span>
      </Button>

      <Button className="mb-1" onClick={() => onSubMenuClick("appearance")}>
        <span>{t("gameOptions.generalSettings.appearance")}</span>
      </Button>
      <Button className="mb-1" onClick={onToggleAnimations}>
        <span>
          {showAnimations
            ? t("gameOptions.generalSettings.disableAnimations")
            : t("gameOptions.generalSettings.enableAnimations")}
        </span>
      </Button>
      <Button onClick={() => onSubMenuClick("share")} className="mb-1">
        <span>{t("gameOptions.generalSettings.share")}</span>
      </Button>
    </>
  );
};
