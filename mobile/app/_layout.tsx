import { Stack } from "expo-router";
import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import "../global.css";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { registerForPushNotificationsAsync } from "../notifications/registerForPushNotifications";
import axios from "axios";

const queryClient = new QueryClient();
const PUBLISHABLE_KEY =
  "pk_test_c3BsZW5kaWQtcHVnLTI5LmNsZXJrLmFjY291bnRzLmRldiQ";

function NotificationManager() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const registerPush = async () => {
      if (isSignedIn && user) {
        const token = await registerForPushNotificationsAsync();
        if (token) {
          console.log("Expo Push Token:", token);
          await axios.post(
            "https://sidu-umber.vercel.app/api/users/save-push-token",
            { token },
            {
              headers: {
                Authorization: `Bearer ${user.id}`,
              },
            }
          );
        }
      }
    };
    registerPush();
  }, [isSignedIn, user]);

  return null;
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <NotificationManager />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <StatusBar style="dark" />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
