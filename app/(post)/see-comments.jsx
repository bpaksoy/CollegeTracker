import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, SafeAreaView, Image, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getCommentsByPost, getRepliesByComment } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import { EmptyState, CommentCard } from "../../components";
import { icons } from "../../constants";

const Comments = () => {
    const { user } = useGlobalContext();
    const params = useLocalSearchParams();
    const { postId } = params;
    //console.log("POST ID in see comments", postId);
    const { data: comments, refetch, loading } = useAppwrite(() => getCommentsByPost(postId));
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        refetch();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    return (
        <SafeAreaView className="bg-primary w-full h-full mb-3">
            <FlatList
                data={comments}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    <>
                        <CommentCard item={item} commentId={item.$id} body={item.body} postId={postId} />
                    </>
                )}

                ListHeaderComponent={() => (
                    <View className="mt-14 mb-3 mx-3">
                        <TouchableOpacity onPress={() => router.push("/trending")}>
                            <Image
                                source={icons.leftArrow}
                                className="w-8 h-6"
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                )}

                ListFooterComponent={() => (
                    <View className="m-5"></View>
                )}

                ListEmptyComponent={() =>
                    !loading && (
                        <>
                            <EmptyState
                                title="No Content Found"
                                subtitle="No comments created yet"
                                section="trending"
                            />
                        </>
                    )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
            <StatusBar backgroundColor="#161622" style="light" />
        </SafeAreaView>
    );
};

export default Comments;
