import { useState, useEffect } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, Text, FlatList, TouchableOpacity, Alert, RefreshControl, } from "react-native";
import { ResizeMode, Video } from "expo-av";
import * as ImagePicker from "expo-image-picker"
import { icons } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import { getUserPosts, signOut, createVideoPost, createProfilePicture, getProfilePicture } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { EmptyState, InfoBox, UserPostCard, CustomButton, FormField, VideoCard } from "../../components";


const Profile = () => {
    const { user, setUser, setIsLoggedIn } = useGlobalContext();
    const { data: picture, loading } = useAppwrite(() => getProfilePicture(user.$id));
    const [play, setPlay] = useState(false);

    //console.log("picture", picture[0]?.thumbnail);

    //console.log("user in the profile", user)
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
    });
    const { data: posts, refetch, loading: isLoading } = useAppwrite(() => getUserPosts(user.$id));
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
    }, [posts]);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        form.thumbnail = null;
        setRefreshing(false);
    };

    const openPicker = async (selectType) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: selectType === "image" ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            if (selectType === "image") {
                setForm({
                    ...form,
                    thumbnail: result.assets[0],
                });
            }

            if (selectType === "video") {
                setForm({
                    ...form,
                    video: result.assets[0],
                });
            }
        }
    };

    const submitVideo = async () => {
        if (!form.video) {
            return Alert.alert("Please provide all fields");
        }

        setUploading(true);
        try {
            await createVideoPost({
                ...form,
                userId: user.$id,
            });

            Alert.alert("Success", "Video uploaded successfully");
            router.push("/profile");
        } catch (e) {
            Alert.alert("Error", e.message);
        } finally {
            setForm({
                title: "",
                video: null,
                thumbnail: null,
                prompt: "",
            });

            setUploading(false);
        }
    };


    const submitImage = async () => {
        if (!form.thumbnail) {
            return Alert.alert("Please provide all fields");
        }

        setUploading(true);
        try {
            await createProfilePicture({
                ...form,
                userId: user.$id,
            });

            Alert.alert("Success", "Image uploaded successfully");
            router.push("/profile");
        } catch (e) {
            Alert.alert("Error", e.message);
        } finally {
            setForm({
                thumbnail: null,
            });

            setUploading(false);
        }
    }


    const logout = async () => {
        await signOut();
        //setUser(null);
        //setIsLoggedIn(false);

        router.replace("/sign-in");
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    <View className="bg-white mt-5 mb-5 mx-3 rounded-lg p-5">
                        <UserPostCard
                            item={item}
                            title={item.title}
                            body={item.body}
                            avatar={item.creator.avatar}
                        />

                    </View>
                )}

                ListHeaderComponent={() => (
                    <>
                        <View className="w-full flex justify-center items-center mt-6 mb-8 px-4">
                            <TouchableOpacity
                                onPress={logout}
                                className="w-full items-end mb-10" >
                                <Image
                                    source={icons.logout}
                                    resizeMode="contain"
                                    className="w-6 h-6"
                                    tintColor="#CDCDE0"
                                />

                            </TouchableOpacity>


                            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
                                {
                                    !loading && (<Image
                                        source={{ uri: picture[0]?.thumbnail || user?.avatar }}
                                        className="w-[90%] h-[90%] rounded-lg"
                                        resizeMode="cover" />)
                                }

                            </View>

                            <InfoBox
                                title={user?.username}
                                containerStyles="mt-5"
                                titleStyles="text-lg" />

                            <View className="mt-3 flex flex-row">
                                <InfoBox
                                    title={posts.length || 0}
                                    subtitle="Posts"
                                    titleStyles="text-xl"
                                    containerStyles="mr-10" />
                                <InfoBox
                                    title="1.2k"
                                    subtitle="Followers"
                                    titleStyles="text-xl"
                                />
                            </View>
                            <TouchableOpacity className="w-full items-center mt-7">
                                <Text className="text-base text-gray-100 font-pmedium mb-2">
                                    Add Personal Info
                                </Text>
                                <Image source={icons.plus} resizeMode="contain" />
                            </TouchableOpacity>

                            <View className="mt-7 space-y-2">

                                <Text className="text-base text-gray-100 font-pmedium text-center">
                                    Upload Image
                                </Text>

                                <TouchableOpacity onPress={() => openPicker("image")}>
                                    {form.thumbnail ? (
                                        <Image
                                            source={{ uri: form.thumbnail.uri }}
                                            resizeMode="cover"
                                            className="w-full h-64 rounded-2xl"
                                        />
                                    ) : (
                                        <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                                            <Image
                                                source={icons.upload}
                                                resizeMode="contain"
                                                alt="upload"
                                                className="w-5 h-5"
                                            />
                                            <Text className="text-sm text-gray-100 font-pmedium">
                                                Choose a file
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                                <CustomButton
                                    title="Submit"
                                    handlePress={submitImage}
                                    containerStyles="mt-3"
                                    isLoading={uploading}
                                />
                            </View>

                            <View className="mt-7 space-y-2">
                                <Text className="text-base text-gray-100 font-pmedium">
                                    Upload a profile video here...
                                </Text>

                                <TouchableOpacity onPress={() => openPicker("video")}>
                                    {form.video ? (
                                        <Video
                                            source={{ uri: form.video.uri }}
                                            className="w-full h-64 rounded-2xl"
                                            useNativeControls
                                            resizeMode={ResizeMode.COVER}
                                            isLooping
                                        />
                                    ) : (
                                        <View className="w-full h-40 px-4 bg-black-100 rounded-2xl border border-black-200 flex justify-center items-center">
                                            <View className="w-14 h-14 border border-dashed border-secondary-100 flex justify-center items-center">
                                                <Image
                                                    source={icons.upload}
                                                    resizeMode="contain"
                                                    alt="upload"
                                                    className="w-1/2 h-1/2"
                                                />
                                            </View>
                                        </View>
                                    )}
                                </TouchableOpacity>
                                <CustomButton
                                    title="Submit"
                                    handlePress={submitVideo}
                                    containerStyles="mt-3"
                                    isLoading={uploading}
                                />
                            </View>
                        </View>
                        <VideoCard />
                        <Text
                            className="font-pregular text-xl text-white mb-5 ml-3 gap-y-1"
                            numberOfLines={4}>
                            See your posts here...
                        </Text>
                    </>
                )}
                ListEmptyComponent={() =>
                    !isLoading && (
                        <EmptyState
                            title="No Content Found"
                            subtitle="No posts created yet"
                            section="trending"
                        />
                    )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </SafeAreaView>
    );
};

export default Profile;
