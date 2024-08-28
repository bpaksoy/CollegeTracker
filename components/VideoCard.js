import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ResizeMode, Video } from "expo-av";
import { View, Text, TouchableOpacity, Image, FlatList, RefreshControl } from "react-native";
import useAppwrite from "../lib/useAppwrite";
import { getUserVideos } from "../lib/appwrite";
import { useGlobalContext } from "../context/GlobalProvider";
import EmptyState from "./EmptyState";

import { icons } from "../constants";

const VideoCard = ({ creator, video }) => {
    const [play, setPlay] = useState(false);
    const { user } = useGlobalContext();
    const { data: videos, refetch, loading: isLoading } = useAppwrite(() => getUserVideos(user.$id));
    //console.log("videos", videos)

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    return (
        <SafeAreaView>
            <FlatList
                data={videos}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) =>
                (<View className="flex flex-col items-center px-4 mb-14">
                    <View className="flex flex-row gap-3 items-start">
                        <View className="flex justify-center items-center flex-row flex-1">
                            <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
                                <Image
                                    source={{ uri: item.creator.avatar }}
                                    className="w-full h-full rounded-lg"
                                    resizeMode="cover"
                                />
                            </View>

                            <View className="flex justify-center flex-1 ml-3 gap-y-1">
                                <Text
                                    className="font-psemibold text-sm text-white"
                                    numberOfLines={1}
                                >
                                    Profile video
                                </Text>
                                <Text
                                    className="text-xs text-gray-100 font-pregular"
                                    numberOfLines={1}
                                >
                                    {item.creator.username}
                                </Text>
                            </View>
                        </View>

                        <View className="pt-2">
                            <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
                        </View>
                    </View>

                    {play ? (
                        <Video
                            source={{ uri: item.video }}
                            className="w-full h-60 rounded-xl mt-3"
                            resizeMode={ResizeMode.CONTAIN}
                            useNativeControls
                            shouldPlay
                            onPlaybackStatusUpdate={(status) => {
                                if (status.didJustFinish) {
                                    setPlay(false);
                                }
                            }}
                        />
                    ) : (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => setPlay(true)}
                            className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
                        >
                            <Image
                                source={{ uri: item.creator.avatar }}
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
                </View>
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />

        </SafeAreaView>
    );
};

export default VideoCard;
