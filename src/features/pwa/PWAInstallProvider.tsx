/* eslint-disable no-console */
import React, {
  createContext,
  useEffect,
  useRef,
  useContext,
  ReactNode,
} from "react";
import PWAInstall from "@khmyznikov/pwa-install/react-legacy";
import { PWAInstallElement } from "@khmyznikov/pwa-install";
import { onboardingAnalytics } from "lib/onboardingAnalytics";

type PWAInstallContextType = React.MutableRefObject<PWAInstallElement | null>;

const PWAInstallContext = createContext<PWAInstallContextType | undefined>(
  undefined,
);

type PWAInstallProviderProps = {
  children: ReactNode;
};

export const PWAInstallProvider: React.FC<PWAInstallProviderProps> = ({
  children,
}) => {
  const pwaInstallRef = useRef<PWAInstallElement | null>(null);

  useEffect(() => {
    const currentElement = pwaInstallRef.current;

    if (!currentElement) return;

    const handleInstallSuccess = () => {
      onboardingAnalytics.logEvent("pwa_installed");
    };

    const handleUserChoiceResult = (event: any) => {
      if (event.detail.message === "dismissed") {
        pwaInstallRef.current?.hideDialog();
      }
    };

    if (currentElement) {
      currentElement.addEventListener(
        "pwa-install-success-event",
        handleInstallSuccess,
      );

      currentElement.addEventListener(
        "pwa-user-choice-result-event",
        handleUserChoiceResult,
      );

      return () => {
        currentElement.removeEventListener(
          "pwa-install-success-event",
          handleInstallSuccess,
        );

        currentElement.removeEventListener(
          "pwa-user-choice-result-event",
          handleUserChoiceResult,
        );
      };
    }
  }, []);

  return (
    <PWAInstallContext.Provider value={pwaInstallRef}>
      <PWAInstall
        id="pwa-install"
        ref={pwaInstallRef}
        manual-apple="true"
        manual-chrome="true"
        manifest-url="/pwa/manifest.webmanifest"
        name="Sunflower Land"
        description="🧑‍🌾 Install our app for a more seamless farming experience. Enjoy full-screen action, easy access, and exclusive features."
        icon="pwa/icons/pwa-64x64.png"
      />
      {children}
    </PWAInstallContext.Provider>
  );
};

// Custom hook to access the PWAInstall ref
export const usePWAInstall = (): PWAInstallContextType => {
  const context = useContext(PWAInstallContext);

  if (!context) {
    throw new Error("usePWAInstall must be used within a PWAInstallProvider.");
  }

  return context;
};
