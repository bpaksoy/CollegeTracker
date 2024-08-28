import { View, Text, FlatList, Image, RefreshControl, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { getAllPosts, getFeaturingSchools, getFileData } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import { PostCard, Featuring, EmptyState, SearchInput, ModalBox } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const Home = () => {
  const { data: posts, refetch, loading: isLoading } = useAppwrite(getAllPosts);
  const { data: featuring, loading } = useAppwrite(getFeaturingSchools)
  const { user } = useGlobalContext();
  //console.log("user", user["username"])

  useEffect(() => {

  }, []);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) =>
        (
          <PostCard
            title={item.Title}
            thumbnail={item.Thumbnail}
            body={item.body}
            image={item.Image}
            creator={item.creator.username}
            avatar={item.creator.avatar}
          />
        )}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {user?.username}
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>
            <SearchInput />
            <View className="w-full h-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 text-lg font-pregular">Here are a few featuring schools for you:</Text>
              {loading ? <ActivityIndicator size="large" color="#a6a6a6" /> : <Featuring featuring={featuring ?? []} />}
            </View>
          </View>
        )}
        ListEmptyComponent={() =>
          !loading && (
            <EmptyState
              title="No Content Found"
              subtitle="No posts created yet"
              section="home"
            />
          )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  )
}

export default Home;