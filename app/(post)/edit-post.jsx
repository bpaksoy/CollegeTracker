import { StatusBar } from "expo-status-bar";
import { router, Redirect, useLocalSearchParams } from "expo-router";
import { View, Text, SafeAreaView, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { FormField, CustomButton } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import {  getAllPostsByUsers, editUserPost } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";

const EditPost = () => {
    const { user } = useGlobalContext();
    const params = useLocalSearchParams();
    const { title, body, postId } = params;
    //console.log("postID", postId)
    //console.log("PARAM", title, body, params);
    const { data: posts, refetch, loading } = useAppwrite(getAllPostsByUsers);
    const [form, setForm] = useState({
        title: title,
        body: body
    });
    const [uploading, setUploading] = useState(false);


    const submitPost = async () => {
        if (!form.title || !form.body) {
            return Alert.alert("Please provide all fields");
        }

        setUploading(true);
        console.log('form', form.title, form.body)
        try {
            await editUserPost(postId, {
                ...form,
                userId: user.$id,
            });

            Alert.alert("Success", "Success!");
            refetch();
            router.push("/trending");

        } catch (e) {
            Alert.alert("Error", e.message);
        } finally {
            setForm({
                title: "",
                body: ""
            });

            setUploading(false);
        }
    };

    return (
        <SafeAreaView className="bg-primary h-full mt-10">
            <ScrollView contentContainerStyle={{ height: "100%" }}>
                <View className="bg-primary justify-center items-center m-3">
                    <FormField name="title" label="Title" defaultValue={form.title} handleChangeText={(e) => {
                        setForm({ ...form, title: e })
                    }} placeholder="title" />
                    <FormField name="body" label="Body" value={form.body} handleChangeText={(e) => setForm({ ...form, body: e })} placeholder="your post here..." height="h-56" multiline={true} numberOfLines={9} textAlignVertical="top" otherStyles="mt-1" />
                    <View className="mt-3">
                        <CustomButton title="Submit" handlePress={() => {
                            submitPost()
                            router.push("/trending")
                        }} />
                    </View>
                </View>
            </ScrollView>
            <StatusBar backgroundColor="#161622" style="light" />
        </SafeAreaView>
    )
}

export default EditPost;