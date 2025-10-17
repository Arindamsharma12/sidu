import { View, Text } from "react-native";
import React from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const PostsList = () => {
  const { currentUser } = useCurrentUser();

  console.log({ currentUser });

  return (
    <View>
      <Text>PostList</Text>
    </View>
  );
};

export default PostsList;
