import { View, Text, RefreshControl, ActivityIndicator, FlatList, Image, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { getAllPostsByUsers, createUserPost, likePost, unlikePost } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { UserPostCard, EmptyState, ModalBox, CustomButton, FormField, CommentCard } from "../../components";
import { images, icons } from "../../constants";
import {
    HomeIcon,
    HeartIcon,
    ShoppingCartIcon,
    SunIcon,
    MoonIcon,
} from "react-native-heroicons/outline";


const TrendingTopics = () => {
    const { user } = useGlobalContext();
    //console.log("user", user)
    const { data: posts, refetch, loading } = useAppwrite(getAllPostsByUsers);
    const [uploading, setUploading] = useState(false);
    const [likedByUser, setLikedByUser] = useState(0)
    const [form, setForm] = useState({
        title: "",
        body: ""
    });

    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        refetch();
    }, [posts]);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    const submitPost = async () => {
        if (!form.title || !form.body) {
            return Alert.alert("Please provide all fields");
        }

        setUploading(true);
        try {
            await createUserPost({
                ...form,
                userId: user.accountId,
            });

            Alert.alert("Success", "Success!");
            router.push("/trending");
            refetch();
        } catch (e) {
            Alert.alert("Error", e.message);
        } finally {
            setForm({
                title: "",
                body: ""
            });

            setUploading(false);
        }
    };


    return (
        <SafeAreaView className="bg-primary h-full">
            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) =>
                (
                    <View className="flex bg-white rounded-2xl m-2 pt-4">
                        <UserPostCard
                            item={item}
                            user={user}
                            postId={item.$id}
                            title={item.title}
                            body={item.body}
                            creator={item.creator.username}
                            avatar={item.creator.avatar}
                            isLoading={loading}
                        />
                    </View>
                )}
                ListHeaderComponent={() => (
                    <View className="flex my-6 px-4 space-y-6" >
                        <View className="flex justify-between items-start flex-row mb-4">
                            <View>
                                <Text className="font-pmedium text-sm text-gray-100">
                                    Here are a few trending topics for you:
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
                        <View className="flex justify-between items-start flex-row mb-4">
                            <Text className="font-pmedium text-xl text-gray-100">Create a post here...</Text>
                            <TouchableOpacity onPress={() => router.push("/user-post")}>
                                <Image
                                    source={icons.plus}
                                    className="w-9 h-10"
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
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
            <StatusBar backgroundColor="#161622" style="light" />
        </SafeAreaView>
    )
}

export default TrendingTopics;
