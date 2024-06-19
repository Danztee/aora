import { icons } from "@/constants";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Post } from "@/hooks/useAppwrite";
import { deleteVideo, likeVideo, unlikeVideo } from "@/lib/appwrite";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import { usePathname } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View, Alert } from "react-native";

type VideoCardProps = {
  video: Post;
};

const VideoCard: React.FC<VideoCardProps> = ({
  video: {
    $id,
    title,
    thumbnail,
    video,
    creator: { avatar, username, accountId },
  },
}) => {
  const { user } = useGlobalContext();
  const pathname = usePathname();
  const [play, setPlay] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      if (status.didJustFinish) {
        setPlay(false);
      }
    } else if (status.error) {
      console.error(`Playback error: ${status.error}`);
    }
  };

  const toggleMenu = () => {
    if (!loading) {
      setMenuVisible(!isMenuVisible);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await likeVideo($id);
      Alert.alert("Success", "Video bookmarked successfully");
      setMenuVisible(false);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteVideo($id);
      Alert.alert("Success", "Video deleted successfully");
      setMenuVisible(false);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromBookmark = async () => {
    setLoading(true);
    try {
      await unlikeVideo($id);
      Alert.alert("Success", "Video removed from bookmarks");
      setMenuVisible(false);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-center">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>

        <View className="p-2">
          <TouchableOpacity onPress={toggleMenu}>
            <Image
              source={icons.menu}
              className="w-5 h-5"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          onError={(error) => console.error("Video playback error:", error)}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}

      {isMenuVisible && (
        <View
          style={{
            position: "absolute",
            top: 50,
            right: 20,
            backgroundColor: "#1E1E2D",
            padding: 15,
            borderRadius: 10,
            zIndex: 1000,
            width: 150,
            borderColor: "#232533",
          }}
        >
          {pathname !== "/bookmark" && (
            <TouchableOpacity onPress={handleSave} disabled={loading}>
              <Text className="text-gray-100 text-lg mb-4">Save</Text>
            </TouchableOpacity>
          )}
          {user.accountId === accountId && (
            <TouchableOpacity onPress={handleDelete} disabled={loading}>
              <Text className="text-gray-100 text-lg">Delete</Text>
            </TouchableOpacity>
          )}
          {pathname === "/bookmark" && (
            <TouchableOpacity
              onPress={handleRemoveFromBookmark}
              disabled={loading}
            >
              <Text className="text-gray-100 text-lg">Remove</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default VideoCard;
