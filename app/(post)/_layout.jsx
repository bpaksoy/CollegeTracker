import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";


const PostLayout = () => {
    return (
        <>
            <Stack>
                <Stack.Screen name="user-post" options={{ headerShown: false }} />
                <Stack.Screen name="edit-post" options={{ headerShown: false }} />
                <Stack.Screen name="post-comment" options={{ headerShown: false }} />
                <Stack.Screen name="see-comments" options={{ headerShown: false }} />
                <Stack.Screen name="edit-comment" options={{ headerShown: false }} />
                <Stack.Screen name="post-reply" options={{ headerShown: false }} />
            </Stack>
            <StatusBar backgroundColor="#161622" style="light" />
        </>
    )
}

export default PostLayout;