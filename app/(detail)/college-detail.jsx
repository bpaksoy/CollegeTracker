import { View, Text, ScrollView, Image, Alert, ImageBackground } from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { CustomButton, FormField } from "../../components";
import { signIn } from "../../lib/appwrite";
import { StatusBar } from "expo-status-bar";
import { icons } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";

import { saveSchool } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";


const CollegeDetail = ({ item }) => {
    const params = useLocalSearchParams();
    //console.log("params", params);
    const [show, setShow] = useState(true);
    const { user } = useGlobalContext();
    //console.log("user.id", user.$id);

    const { location, title, thumbnail, acceptance_rate, tuition, ranking, test_scores, postId } = params;

    const saveToBookmark = async (userId, postId) => {
        console.log("user.id", userId, "post.id", postId);
        try {
            await saveSchool(userId, postId);
            Alert.alert("Success", "School saved successfully!");
        } catch (e) {
            Alert.alert("Error", e.message);
        }
    }

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView contentContainerStyle={{ height: "100%" }}>
                <View className="w-full justify-center items-center min-h-[85vh] px-4">
                    <ImageBackground
                        source={{ uri: thumbnail }}
                        className="w-full h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
                        resizeMode="cover"
                    />
                    <View className="relative mt-5">
                        <Text className="text-2xl text-white font-bold text-center">
                            {title}
                        </Text>
                        <Text className="text-sm font-pregular text-gray-100 mt-3 text-center">
                            {location}
                        </Text>
                        <Text className="text-xl font-pregular text-gray-100 mt-3 text-center">
                            {`Tuition: ${tuition}`}
                        </Text>
                        <Text className="text-xl font-pregular text-gray-100 mt-3 text-center">
                            {`Acceptance Rate: ${acceptance_rate}`}
                        </Text>
                        <Text className="text-sm font-pregular text-gray-100 mt-3 text-center">
                            {`Ranks ${ranking}`}
                        </Text>
                        <Text className="text-sm font-pregular text-gray-100 mt-3 text-center">
                            {`${test_scores}`}
                        </Text>

                    </View>
                    <CustomButton
                        title="Close"
                        handlePress={() => router.push("/home")}
                        containerStyles="w-full mt-7"
                    />
                    <CustomButton
                        title={`Save to Bookmark`}
                        handlePress={() => {
                            setShow(false);
                            saveToBookmark(user.$id, postId);
                            return router.push("/bookmark");
                        }}
                        containerStyles="w-full mt-7"
                    />
                </View>
            </ScrollView>
            <StatusBar backgroundColor="#161622" style="light" />
        </SafeAreaView >
    )
}

export default CollegeDetail;
