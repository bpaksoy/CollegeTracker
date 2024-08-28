import { View, Text, ScrollView, FlatList, RefreshControl, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { getSavedSchools } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { images } from "../../constants";
import { SearchInput, SavedSchoolCard, EmptyState } from "../../components";

const Bookmark = () => {
    const { user } = useGlobalContext();
    const { data, refetch, loading } = useAppwrite(() => getSavedSchools(user.$id));
    const [refreshing, setRefreshing] = useState(false);
    //console.log("DATA", data);

    useEffect(() => {
        refetch();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <FlatList
                data={data}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) =>
                (
                    <SavedSchoolCard
                        item={item}
                    />
                )}
                ListHeaderComponent={() => (
                    <View className="flex my-6 px-4 space-y-6 ">
                        <View className="flex justify-between items-start flex-row">
                            <View>
                                <Text className="text-xl font-psemibold text-white">
                                    Saved schools for you:
                                </Text>
                            </View>

                            <View className="mt-1.5 mb-6">
                                <Image
                                    source={images.logoSmall}
                                    className="w-9 h-10"
                                    resizeMode="contain"
                                />
                            </View>
                        </View>
                        <SearchInput />
                    </View>
                )}
                ListEmptyComponent={() =>
                    !loading && (
                        <EmptyState
                            title="No Content Found"
                            subtitle="No bookmarks created yet"
                            section="home"
                        />
                    )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
            <StatusBar backgroundColor="#161622" style="light" />
        </SafeAreaView >
    )
}

export default Bookmark;