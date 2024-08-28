import { View, Text, ScrollView, Alert, ImageBackground } from "react-native";
import { router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton } from "./CustomButton";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "../context/GlobalProvider";


const SavedSchoolCard = ({ item }) => {
    const [show, setShow] = useState(true);
    const { user } = useGlobalContext();

    //console.log("item", item)

    const { location, title, thumbnail, acceptance_rate, tuition, ranking, test_scores } = item;



    return (
        <View className="w-full justify-center items-center px-4">
            <ImageBackground
                source={{ uri: thumbnail }}
                className="w-full h-72 rounded-[33px] overflow-hidden shadow-lg shadow-black/40"
                resizeMode="cover"
            />
            <View className="relative mt-5 mb-5">
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
        </View>
    )
}


export default SavedSchoolCard;