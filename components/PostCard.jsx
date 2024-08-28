import { View, Text, TouchableOpacity, Image, Modal, ScrollView, ImageBackground } from "react-native";
import React, { useState } from "react";
import CustomButton from "./CustomButton"
import { router } from "expo-router";

import { icons } from "../constants";

const PostCard = ({ title, creator, body, avatar, thumbnail, image }) => {

    const [showMore, setShowMore] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View className="flex flex-col items-center px-4 mb-14">
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {

                    setModalVisible(!modalVisible);
                }}>


                <ScrollView className="bg-primary">
                    <View className="mt-8 mb-3 mx-3">
                        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} isLoading={false}>
                            <Image
                                source={icons.leftArrow}
                                className="w-8 h-6"
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                    <View className="bg-primary mt-5 justify-center items-center">
                        <View className="flex justify-center flex-1 m-1 gap-y-1">
                            <Text
                                className="font-psemibold m-1 text-xl text-white">
                                {title}
                            </Text>

                        </View>
                        <ImageBackground source={{ uri: thumbnail }} className="w-screen h-72 rounded-[33px] border-solid border-[1px] my-5 overflow-hidden shadow-lg shadow-black/40" resizeMode="cover" />
                        <View className="text-sm font-pregular text-gray-100 mt-3 text-center">
                            <Text className="text-sm font-pregular text-gray-100 text-center mb-5 m-4 gap-y-3">{body}</Text>
                        </View>
                        <View className="mb-5"></View>
                    </View>
                </ScrollView>
            </Modal>

            {
                showMore ? (<Text className="text-black">Loading...</Text>) : (
                    <>
                        <View className="flex flex-row gap-3 items-start bg-gray">
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
                                        className="font-psemibold text-sm text-white"
                                        numberOfLines={2}>
                                        {title}
                                    </Text>

                                </View>
                            </View>

                            <View className="pt-2">
                                <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
                            </View>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => setModalVisible(true)}
                            className="w-full h-60 rounded-xl m-12 relative flex justify-center items-center"
                        >
                            <Image
                                source={{ uri: thumbnail }}
                                className="w-full h-full rounded-xl mt-7"
                                resizeMode="cover"
                            />
                            <Text
                                className="font-pregular text-sm text-gray-500 mt-1 bg-gray-100 rounded-xl p-4"
                                numberOfLines={4}
                                resizeMode="contain"
                            >
                                {body}
                            </Text>
                        </TouchableOpacity>
                    </>
                )
            }
        </View>
    );
}

export default PostCard;

