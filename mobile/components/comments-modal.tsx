import { useComments } from "@/hooks/useComments";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Post } from "@/types";
import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface CommmentModalProops {
  selectedPost: Post;
  onClose: () => void;
}

const CommentsModal = ({ selectedPost, onClose }: CommmentModalProops) => {
  const { commentText, setCommentText, createComment, isCreatingComment } =
    useComments();
  const { currentUser } = useCurrentUser();

  const handleClose = () => {
    onClose();
    setCommentText("");
  };

  return (
    <Modal
      visible={!!selectedPost}
      animationType="slide"
      presentationStyle="pageSheet"
      transparent={false}
    >
      <SafeAreaView className="flex-1 bg-black">
        {/* MODAL HEADER */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-700 bg-black">
          <TouchableOpacity onPress={handleClose}>
            <Text className="text-blue-500 text-lg">Close</Text>
          </TouchableOpacity>
          <Text className="font-semibold text-lg text-white">Comments</Text>
          <View className="w-12" />
        </View>

        {selectedPost && (
          <ScrollView className="flex-1">
            {/* ORIGINAL POST */}
            <View className="border-b border-gray-700 bg-black p-4">
              <View className="flex-row">
                <Image
                  source={{ uri: selectedPost.user.profilePicture || "" }}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Text className="font-bold text-gray-100 mr-1">
                      {selectedPost.user.firstName} {selectedPost.user.lastName}
                    </Text>
                    <Text className="text-gray-500 ml-1">
                      @{selectedPost.user.username}
                    </Text>
                  </View>
                  {selectedPost.content && (
                    <Text className="text-gray-300 text-base leading-5 mb-3">
                      {selectedPost.content}
                    </Text>
                  )}
                  {selectedPost.image && (
                    <Image
                      source={{ uri: selectedPost.image }}
                      className="w-full h-48 rounded-2xl mb-3"
                      resizeMode="cover"
                    />
                  )}
                </View>
              </View>
            </View>

            {/* COMMENT LIST */}
            {selectedPost.comments.map((comment) => (
              <View
                key={comment._id}
                className="border-b border-gray-700 bg-black p-4"
              >
                <View className="flex-row">
                  <Image
                    source={{ uri: comment.user.profilePicture || "" }}
                    className="w-10 h-10 rounded-full mr-3"
                  />

                  <View className="flex">
                    <View className="flex-row items-center mb-1 ">
                      <Text className="font-bold text-gray-100 mr-1">
                        {comment.user.firstName} {comment.user.lastName}
                      </Text>
                      <Text className="text-gray-500 text-sm ml-1">
                        @{comment.user.username}
                      </Text>
                    </View>
                    <Text className="text-gray-300 text-base mb-2 leading-5">
                      {comment.content}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            {/* ADD COMMENT INPUT */}
            <View className="p-4 border-t border-gray-700 bg-black">
              <View className="flex-row">
                <Image
                  source={{ uri: currentUser?.profilePicture }}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <View className="flex-1 ">
                  <TextInput
                    className="border border-gray-700 text-gray-200 rounded-lg p-3 text-base mb-3"
                    placeholder="Write a comment..."
                    placeholderTextColor="#808080"
                    value={commentText}
                    onChangeText={setCommentText}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />

                  <TouchableOpacity
                    className={`px-4 py-2 rounded-lg self-start ${commentText.trim() ? "bg-blue-500" : "bg-gray-300"}`}
                    onPress={() => createComment(selectedPost._id)}
                    disabled={!commentText.trim() || isCreatingComment}
                  >
                    {isCreatingComment ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text
                        className={`font-semibold ${commentText.trim() ? "text-white" : "text-gray-500"}`}
                      >
                        Reply
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default CommentsModal;
