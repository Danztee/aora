import EmptyState from "@/components/EmptyState";
import VideoCard from "@/components/VideoCard";
import useAppwrite from "@/hooks/useAppwrite";
import { getLikedVideos } from "@/lib/appwrite";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Bookmark = () => {
  const { data: posts, refetch } = useAppwrite(getLikedVideos);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="font-pmedium text-2xl text-white">
              Saved Videos
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos bookmarked yet"
            showBtn={false}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Platform.OS === "ios" ? "#FFFFFF" : "#000000"}
          />
        }
      />
    </SafeAreaView>
  );
};

export default Bookmark;
