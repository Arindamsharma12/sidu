// app/user/[username].tsx

import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { format } from "date-fns";
import PostsList from "@/components/posts-list";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useUserProfile } from "@/hooks/useUserProfile";
import { usePosts } from "@/hooks/usePosts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient, userApi } from "@/utils/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const UserProfileScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { username } = useLocalSearchParams<{ username: string }>();

  // Hooks for fetching data
  const {
    userProfile,
    isLoading,
    error,
    refetch: refetchProfile,
  } = useUserProfile(username);
  const {
    posts: userPosts,
    refetch: refetchPosts,
    isLoading: isRefetching,
  } = usePosts(username);
  const { currentUser } = useCurrentUser(); // Get the logged-in user

  // Setup React Query for the follow/unfollow mutation
  const api = useApiClient();
  const queryClient = useQueryClient();

  const { mutate: handleFollow, isPending: isFollowPending } = useMutation({
    mutationFn: (targetUserId: string) => userApi.followUser(api, targetUserId),
    onSuccess: () => {
      // When successful, refetch both profiles to update follower counts and button state
      queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      console.error(err);
      alert("An error occurred. Please try again.");
    },
  });

  // Loading and Error states
  if (isLoading || !currentUser) {
    // Also wait for currentUser to load
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size={"large"} color={"#1DA1F2"} />
      </View>
    );
  }

  if (error || !userProfile) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center p-4">
        <Text className="text-red-500 text-center">
          Could not load profile.
        </Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-blue-500">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Determine the follow status and if it's the user's own profile
  const isFollowing = currentUser.following?.includes(userProfile._id);
  const isOwnProfile = currentUser._id === userProfile._id;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <Stack.Screen
        options={{
          headerTitle: `${userProfile.firstName} ${userProfile.lastName}`,
          headerTitleAlign: "center",
        }}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => {
              refetchProfile();
              refetchPosts();
            }}
            tintColor="#1DA1F2"
          />
        }
      >
        <Image
          source={{
            uri:
              userProfile.bannerImage ||
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
          }}
          className="w-full h-48"
          resizeMode="cover"
        />
        <View className="px-4 pb-4 border-b border-gray-100 ">
          <View className="flex-row justify-between items-end -mt-16 mb-4">
            <Image
              source={{ uri: userProfile.profilePicture }}
              className="w-32 h-32 rounded-full border-4 border-white"
            />
            {/* Conditionally render the button */}
            {!isOwnProfile && (
              <TouchableOpacity
                onPress={() => handleFollow(userProfile._id)}
                disabled={isFollowPending}
                className={`px-6 py-2 rounded-full border ${
                  isFollowing
                    ? "border-blue-500 bg-white"
                    : "border-blue-500 bg-blue-500"
                } ${isFollowPending ? "opacity-50" : ""}`}
              >
                <Text
                  className={`font-semibold ${
                    isFollowing ? "text-blue-500" : "text-white"
                  }`}
                >
                  {isFollowPending ? (
                    <ActivityIndicator
                      size="small"
                      color={isFollowing ? "#3B82F6" : "#FFFFFF"}
                    />
                  ) : isFollowing ? (
                    "Following"
                  ) : (
                    "Follow"
                  )}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="mb-4">
            <View className="flex-row items-center mb-1">
              <Text className="text-xl font-bold text-gray-900 mr-1">
                {userProfile.firstName} {userProfile.lastName}
              </Text>
              <Feather name="check-circle" size={20} color={"#1DA1F2"} />
            </View>
            <Text className="text-gray-500 mb-2">@{userProfile.username}</Text>
            <Text className="text-gray-900 mb-3">{userProfile.bio}</Text>

            <View className="flex-row items-center mb-2">
              <Feather name="map-pin" size={16} color="#657786" />
              <Text className="text-gray-500 ml-2">{userProfile.location}</Text>
            </View>

            <View className="flex-row items-center mb-3">
              <Feather name="calendar" size={16} color={"#657786"} />
              <Text className="text-gray-500 ml-2">
                Joined
                {format(new Date(userProfile.createdAt), "MMMM yyyy")}
              </Text>
            </View>

            <View className="flex-row">
              <TouchableOpacity className="mr-6">
                <Text className="text-gray-900">
                  <Text className="font-bold">
                    {userProfile.following?.length ?? 0}
                  </Text>
                  <Text className="text-gray-500"> Following</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text className="text-gray-900">
                  <Text className="font-bold">
                    {userProfile.followers?.length ?? 0}
                  </Text>
                  <Text className="text-gray-500"> Followers</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <PostsList username={userProfile?.username} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfileScreen;
