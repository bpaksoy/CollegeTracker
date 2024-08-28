import { View, Text, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { deleteUserPost, likePost, unlikePost } from "../lib/appwrite";
import { useGlobalContext } from "../context/GlobalProvider";
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from "react-native-popup-menu";

import { icons } from "../constants";
import { HeartIcon } from "react-native-heroicons/outline";


const UserPostCard = ({ item: post, postId, title, creator, body, avatar, isLoading }) => {
    const { user } = useGlobalContext();
    const params = useLocalSearchParams();

    const [option, setSelectedOption] = useState();

    const [showMore, setShowMore] = useState(false);
    const [liked, setLiked] = useState(post.liked_by.includes(user.$id));
    const [numLikes, setNumLikes] = useState(post.liked_by.length);
    //console.log("NUM LIKES to begin with", post.liked_by.length);
    post ? isLoading = false : isLoading = true;

    const handleLike = async () => {
        if (liked) {
            //console.log("unliking")
            setLiked(false);
            setNumLikes(numLikes? numLikes - 1 : 0);
            //console.log("numLikes", post.liked_by.length)
            unlikePost(post.$id, user.$id);
        } else {
            //console.log("liking")
            setLiked(true);
            setNumLikes(numLikes + 1);
            //console.log("numLikes", numLikes)
            likePost(post.$id, user.$id);
        }

    }

    return (
        <>
            <View className="flex flex-col items-center px-4">
                <View className="flex flex-row gap-3 items-start">
                    <View className="flex justify-center items-center flex-row flex-1">
                        <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
                            <Image
                                source={{ uri: avatar }}
                                className="w-full h-full rounded-lg"
                                resizeMode="cover"
                            />
                        </View>

                        <View className="flex justify-center flex-1 ml-3 gap-y-1">
                            <Text
                                className="font-psemibold text-sm text-gray-400"
                                numberOfLines={4}
                            >
                                {title}
                            </Text>

                        </View>
                    </View>
                    <View>
                        <Menu>
                            <MenuTrigger
                                customStyles={{
                                    triggerWrapper: {
                                        top: -20,
                                        margin: 10,

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
                                {user.$id === post.creator.$id ? <>
                                    <MenuOption onSelect={() => {
                                        alert(`Edit`)
                                        router.push({ pathname: "/edit-post", params: { title: title, body: body, postId: postId } });
                                    }} text="Edit" />
                                    <MenuOption onSelect={() => {
                                        alert(`Delete`);
                                        deleteUserPost(postId);

                                    }} text="Delete" />
                                </> : null
                                }
                                <MenuOption onSelect={() => alert(`Report`)} text="Report" />
                            </MenuOptions>
                        </Menu>
                    </View>

                </View>
                {
                    isLoading ? (<ActivityIndicator size="large" color="#a6a6a6" />) : (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => { setShowMore(true) }}
                            className="w-full h-auto rounded-xl relative flex justify-center items-center"
                        >
                            <Text
                                className="w-full font-pregular text-sm text-gray-500 bg-gray-100 rounded-xl p-9 m-3"
                                numberOfLines={10}
                                resizeMode="contain"
                            >
                                {body}
                            </Text>

                        </TouchableOpacity>
                    )
                }

            </View>
            <View className="justify-between flex-row px-2 bg-gray-200 rounded-2xl mb-9 p-2 m-4">

                <View className="p-2">
                    <TouchableOpacity onPress={() => handleLike()}>
                        {liked ? <HeartIcon fill="#17717d" color="#17717d" size={28} /> : <HeartIcon color="#17717d" size={28} />}
                    </TouchableOpacity>
                    {liked ? <Text className="text-gray-100 absolute rounded-full py-1 px-1 text-xs font-medium content-[''] leading-none grid place-items-center top-[-15%] right-[-35%]
                                                    translate-x-2/4 -translate-y-2/4 bg-gray-100 text-gray-500 min-w-[24px] min-h-[24px]">{numLikes}</Text> : null}
                </View>
                <TouchableOpacity onPress={() => router.push({ pathname: "/see-comments", params: { postId: post.$id } })}>
                    <Text className="font-pmedium text-sm text-gray-500 underline flex justify-center items-center  p-2">See comments</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push({ pathname: "/post-comment", params: { postId: post.$id } })}>
                    <Image
                        source={icons.plus}
                        className="w-9 h-10"
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
        </>
    );
}

export default UserPostCard;

