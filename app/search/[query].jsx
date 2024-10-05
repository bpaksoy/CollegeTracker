import { View, Text, FlatList, Image, RefreshControl, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import axios from "axios";
const apiKey = "";
import { SearchCard, EmptyState } from "../../components";
import { StatusBar } from "expo-status-bar";
import { images } from "../../constants";
import { CustomButton, SearchInput } from "../../components";


const Search = () => {
    const { query } = useLocalSearchParams();
    const [searchResult, setSearchResult] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [thumbnail, setThumbnail] = useState("https://cloud.appwrite.io/v1/storage/buckets/661f946d10ce253c0dc7/files/66226ed4b118260e7338/view?project=661ed05852385ff89232&mode=admin");

    const handleSearch = async () => {
        setLoading(true)
        setSearchResult([])

        try {

            const options = {
                method: "GET",
                url: `https://api.data.gov/ed/collegescorecard/v1/schools?api_key=${apiKey}&fields=school.name,id,school.state,school.ownership,school.degrees,school.ft_faculty_rate,latest.admissions.admission_rate.overall,latest.admissions.sat_scores.average.overall,latest.cost.attendance.academic_year&school.name=${query}`,
            }
            const response = await axios.request(options);
            //console.log("response.data.results", typeof (response.data.results));
            setSearchResult(response.data.results);

        } catch (error) {
            setSearchError(error);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSearch()
    }, [query])

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = async () => {
        setRefreshing(true);
        await handleSearch();
        setRefreshing(false);
    };


    return (
        <SafeAreaView className="bg-primary h-full">
            <FlatList
                data={searchResult ?? []}
                keyExtractor={(item) => item["id"]}
                renderItem={({ item }) => (
                    <View className="w-full flex justify-center min-h-[75vh] px-4">
                        <SearchCard
                            college={item}
                            thumbnail={thumbnail}
                        />
                        <CustomButton
                            title="Save"
                            handlePress={() => {
                                return router.push("/bookmarks")
                            }}
                            containerStyles="flex justify-center w-full mt-2  mb-6" />
                    </View>
                )}
                ListHeaderComponent={() =>
                (
                    <View className="my-6 px-4">
                        <Text className="font-pmedium text-sm text-gray-100">
                            Search Results for:
                        </Text>
                        {isLoading && <ActivityIndicator size="large" color="#a6a6a6" />}
                        <Text className="text-2xl font-psemibold text-white">
                            {query}
                        </Text>
                        <View className="mt-6">
                            <SearchInput />
                        </View>
                    </View>
                )}
                ListEmptyComponent={() =>
                    !isLoading && (
                        <EmptyState
                            title="No Content Found"
                            subtitle="Try searching with another keyword..."
                        />
                    )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </SafeAreaView >
    )
}

export default Search;
