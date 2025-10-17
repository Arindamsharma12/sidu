import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";
import * as Linking from "expo-linking";

export const useSocialAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { startSSOFlow } = useSSO();
  const handleSocialAuth = async (strategy: "oauth_google") => {
    setIsLoading(true);
    try {
      const redirectUrl = Linking.createURL("/");
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl,
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (error) {
      console.log("Error in social auth", error);
      const provider = "Google";
      Alert.alert(
        "Error",
        `Failed to sign in with ${provider}. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleSocialAuth };
};
