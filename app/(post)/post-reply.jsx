import { StatusBar } from "expo-status-bar";
import { router, Redirect, useLocalSearchParams } from "expo-router";
import { View, Text, SafeAreaView, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { FormField, CustomButton } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import { createReply, getRepliesByComment } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";


const PostReply = () => {
    const { user } = useGlobalContext();
    const params = useLocalSearchParams();
    const { commentId, postId } = params;
    const { data: replies, refetch, loading } = useAppwrite(() => getRepliesByComment(commentId));

    const [form, setForm] = useState({
        body: "",
        commentId: ""
    });
    const [uploading, setUploading] = useState(false);


    const submitReply = async () => {
        if (!form.body) {
            return Alert.alert("Please provide all fields");
        }

        setUploading(true);
        try {
            await createReply({
                ...form,
                userId: user.$id,
                commentId: commentId
            });

            Alert.alert("Success", "Success!");
            refetch();
            router.push({ pathname: "/see-comments", params: { postId: postId } })

        } catch (e) {
            Alert.alert("Error", e.message);
        } finally {
            setForm({
                body: ""
            });
            setUploading(false);
        }
    };

    return (
        <SafeAreaView className="bg-primary h-full mt-10">
            <ScrollView contentContainerStyle={{ height: "100%" }}>
                <View className="bg-primary justify-center items-center m-3">
                    <FormField name="body" label="Body" value={form.body} handleChangeText={(e) => setForm({ ...form, body: e })} placeholder="your reply here..." height="h-56" multiline={true} numberOfLines={9} textAlignVertical="top" otherStyles="mt-1" />
                    <View className="mt-3">
                        <CustomButton title="Submit" handlePress={() => {
                            submitReply()
                        }} />
                    </View>
                </View>
            </ScrollView>
            <StatusBar backgroundColor="#161622" style="light" />
        </SafeAreaView>
    )
}

export default PostReply;