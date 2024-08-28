import { StatusBar } from "expo-status-bar";
import { router, Redirect, useLocalSearchParams } from "expo-router";
import { View, Text, SafeAreaView, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { FormField, CustomButton } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getAllPostsByUsers, editUserComment } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";

const EditComment = () => {
    const { user } = useGlobalContext();
    const params = useLocalSearchParams();
    const { body, commentId, postId } = params;
    console.log("POST ID", postId);
    //console.log("PARAM", body, params);
    const { data: posts, refetch, loading } = useAppwrite(getAllPostsByUsers);
    const [form, setForm] = useState({
        body: body
    });
    const [uploading, setUploading] = useState(false);


    const submitComment = async () => {
        if (!form.body) {
            return Alert.alert("Please provide all fields");
        }

        setUploading(true);
        console.log('form', form.body)
        try {
            await editUserComment(commentId, {
                ...form,
                userId: user.$id,
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
                    <FormField name="body" label="Body" value={form.body} handleChangeText={(e) => setForm({ ...form, body: e })} placeholder="edit your comment here..." height="h-56" multiline={true} numberOfLines={9} textAlignVertical="top" otherStyles="mt-1" />
                    <View className="mt-3">
                        <CustomButton title="Submit" handlePress={() => {
                            submitComment();
                        }} />
                    </View>
                </View>
            </ScrollView>
            <StatusBar backgroundColor="#161622" style="light" />
        </SafeAreaView>
    )
}

export default EditComment;

