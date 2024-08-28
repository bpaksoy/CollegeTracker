import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { usePathname, router } from "expo-router";

const SearchInput = () => {

    const pathName = usePathname();
    const [query, setQuery] = useState("");

    return (
        <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 bg-gray-100 rounded-2xl border-2 border-gray-200 focus:border-gray">
            <TextInput
                className="text-base mt-0.5 text-black flex-1 font-pregular"
                value={query}
                placeholder="Search for a college"
                placeholderTextColor="#454545"
                onChangeText={(e) => setQuery(e)}
            />

            <TouchableOpacity onPress={() => {
                if (!query) {
                    return Alert.alert("Missing search input!", "Please input somethig in the search box.")
                }
                if (pathName.startsWith === "/search") {
                    router.setParams({ query })
                } else {
                    router.push(`/search/${query}`)
                }
            }}>
                <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
            </TouchableOpacity>
        </View>
    )
}

export default SearchInput;