import { View, Text, FlatList, TouchableOpacity, ImageBackground } from "react-native";
import React, { useState } from "react";
import * as Animatable from "react-native-animatable";
import { Redirect, router, Link } from "expo-router";


const zoomIn = {
    0: {
        scale: 0.9
    },
    1: {
        scale: 1
    }

}
const zoomOut = {
    0: {
        scale: 1
    },
    1: {
        scale: 0.9
    }

}

const FeaturingItem = ({ activeItem, item }) => {

    return (
        <Animatable.View
            className="mr-5"
            animation={activeItem === item.$id ? zoomIn : zoomOut}
            duration={500}
        >
            <TouchableOpacity className="relative center justify-center" activeOpacity={0.7} onPress={() =>
                router.push({
                    pathname: "/college-detail",
                    params: {
                        postId: `${item.$id}`,
                        location: `${item.location}`,
                        title: `${item.title}`,
                        thumbnail: `${item.thumbnail}`,
                        acceptance_rate: `${item.acceptance_rate}`,
                        ranking: `${item.ranking}`,
                        tuition: `${item.tuition}`
                    },
                })
            }>
                <ImageBackground
                    source={{ uri: item.thumbnail }}
                    className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
                    resizeMode="cover"
                />
                <Text style={{ maxWidth: 200 }} className="text-gray-100 text-lg font-pregular" numberOfLines={1} resizeMode="contain">{item.title}</Text>
            </TouchableOpacity>

        </Animatable.View >
    )
}

const Featuring = ({ featuring }) => {

    const [activeItem, setActiveItem] = useState(featuring[1]);

    const viewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setActiveItem(viewableItems[0].key)
        }

    }

    return (
        <FlatList
            data={featuring}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (<FeaturingItem activeItem={activeItem} item={item} />
            )}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
            contentOffset={{ x: 170 }}
            horizontal
        />
    )
}

export default Featuring;
