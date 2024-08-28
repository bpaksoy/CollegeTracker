import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, FlatList, RefreshControl } from "react-native";
import { icons } from "../constants";
import { deleteUserComment, editUserComment, likeComment, unlikeComment, getCommentsByPost, getRepliesByComment } from "../lib/appwrite";
import useAppwrite from "../lib/useAppwrite";
import { router, useLocalSearchParams } from "expo-router";
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from "react-native-popup-menu";
import { useGlobalContext } from "../context/GlobalProvider";
import { HeartIcon } from "react-native-heroicons/outline";
import ReplyCard from "./ReplyCard";


const CommentCard = ({ item, commentId, body, postId }) => {
    const { user } = useGlobalContext();
    const params = useLocalSearchParams();
    const [liked, setLiked] = useState(item.liked_by.includes(user.$id));
    const [numLikes, setNumLikes] = useState(item.liked_by.length);
    const { data: comments, refetch, loading } = useAppwrite(() => getCommentsByPost(postId));
    const { data: replies, refetch: refetchReplies, loading: repliesLoading } = useAppwrite(() => getRepliesByComment(commentId));
    const [refreshing, setRefreshing] = useState(false);


    useEffect(() => {
        getCommentsByPost(postId)
        refetch();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };


    const handleLike = async () => {
        if (liked) {
            setLiked(false);
            setNumLikes(numLikes ? numLikes - 1 : 0);
            unlikeComment(item.$id, user.$id);
        } else {
            setLiked(true);
            setNumLikes(numLikes + 1);
            likeComment(item.$id, user.$id);
        }

    }

    return (
        <>
            <View className="bg-primary items-center mt-2 mx-3">
                <View className="w-full rounded-lg border border-primary bg-gray-200">
                    <View className="p-1 items-end">
                        <Menu>
                            <MenuTrigger
                                customStyles={{
                                    triggerWrapper: {
                                        top: -10,
                                        marginTop: 10,

                                    },
                                }}
                            >
                                <View className="pt-2">
                                    <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
                                </View>

                            </MenuTrigger>
                            <MenuOptions customStyles={{
                                optionsContainer: {
                                    borderRadius: 10,
                                    padding: 10
                                },
                                optionText: {
                                    color: 'gray',
                                },
                            }}>
                                {user.$id === item.user.$id ? <>
                                    <MenuOption onSelect={() => {
                                        alert(`Edit`)
                                        router.push({ pathname: "/edit-comment", params: { body: body, commentId: commentId, postId: postId } });
                                    }} text="Edit" />
                                    <MenuOption onSelect={() => {
                                        alert(`Delete`);
                                        deleteUserComment(commentId);
                                        router.replace({ pathname: "/see-comments", params: { postId: postId } })
                                    }} text="Delete" />
                                </> : null}
                                <MenuOption onSelect={() => alert(`Report`)} text="Report" />
                            </MenuOptions>
                        </Menu>
                    </View>
                    <Text className="font-bold text-lg text-gray-500 px-2"> {item?.user.username} wrote:</Text>
                    <Text
                        className="justify-center font-pregular text-sm text-gray-500 m-4"
                        numberOfLines={9}
                        resizeMode="contain"
                    >
                        {item?.body}
                    </Text>
                    <Text className="font-pregular text-sm text-gray-500 m-3"> {new Date(item?.$createdAt).toLocaleString()}</Text>
                    <View className="p-2">
                        <TouchableOpacity onPress={() => handleLike()}>
                            {liked ? <HeartIcon fill="#17717d" color="#17717d" size={28} /> : <HeartIcon color="#17717d" size={28} />}
                        </TouchableOpacity>
                        {numLikes ? <Text className="absolute rounded-full py-1 px-1 text-xs font-medium content-[''] leading-none grid place-items-center top-[-5%] right-[89%] translate-x-2/4 -translate-y-2/4 bg-gray-100 text-gray-500 min-w-[24px] min-h-[24px]">{numLikes}</Text> : null}
                    </View>
                </View>
            </View>
            <View className="mx-3" >
                <View className="flex justify-end items-start flex-row ">
                    <TouchableOpacity onPress={() => handleLike()}><Text className="font-pregular text-sm p-2">Like</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push({ pathname: "/post-reply", params: { commentId: commentId, postId: postId } })}><Text className="font-pregular text-sm p-2">Reply</Text></TouchableOpacity>
                </View>
            </View>
            <FlatList
                data={replies}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    <ReplyCard item={item} replyId={item.$id} body={item.body} commentId={commentId} postId={postId} />
                )}

                ListFooterComponent={() => (
                    <View className="m-2"></View>
                )}

                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </>
    );
};


export default CommentCard;