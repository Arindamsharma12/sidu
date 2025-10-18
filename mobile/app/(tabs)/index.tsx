import { View, Text, ScrollView, RefreshControl, Image } from "react-native";

import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SignOutButton from "@/components/sign-out-button";
import { useUserSync } from "@/hooks/useUserSync";
// import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import PostComposer from "@/components/post-composer";
import PostsList from "@/components/posts-list";
import { usePosts } from "@/hooks/usePosts";

const HomeScreen = () => {
  const [isRefetching, setIsRefetching] = useState(false);
  const { refetch: refetchPosts } = usePosts();
  const handlePullToRefresh = async () => {
    setIsRefetching(true);
    await refetchPosts();
    setIsRefetching(false);
  };
  useUserSync();
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-700">
        {/* <Ionicons name="logo-twitter" size={24} color={"#1DA1F2"} /> */}
        <AntDesign name="fire" size={24} color="#1DA1F2" />
        <Text className="text-xl font-bold text-white">Home</Text>
        <SignOutButton />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handlePullToRefresh}
            tintColor={"#1DA1F2"}
          />
        }
      >
        <PostComposer />
        <PostsList />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
