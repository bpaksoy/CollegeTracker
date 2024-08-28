import { View, Text, ScrollView, ImageBackground, FlatList } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { CustomButton } from "./CustomButton"

import { icons } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
})

const SearchCard = ({ college, thumbnail }) => {
    //console.log("here is college", college)
    const title = college["school.name"];
    const state = college["school.state"];

    const cost_of_attendance = college["latest.cost.attendance.academic_year"]
    const acceptance_rate = college["latest.admissions.admission_rate.overall"]
    const average_sat = college["latest.admissions.sat_scores.average.overall"]


    return (

        <View className="w-full justify-center items-center px-4">
            <ImageBackground source={{ uri: thumbnail }} className="w-full h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40" resizeMode="cover" />
            <View className="relative mt-2">
                <Text className="text-2xl text-white font-bold text-center">{title}</Text>
            </View>
            <View className="text-sm font-pregular text-gray-100 mt-3 text-center">
                <Text className="text-sm font-pregular text-gray-100 text-center">{state}</Text>
            </View>
            <Text className="text-xl font-pregular text-gray-100 mt-3 text-center">
                {`Acceptance Rate : \n ${(acceptance_rate * 100).toFixed(2)}%`}
            </Text>
            <Text className="text-xl font-pregular text-gray-200 mt-3 text-center">
                {`Average SAT score: ${average_sat}`}
            </Text>
            <Text className="text-sm font-pregular text-gray-300 mt-3 text-center">
                {`Average Cost of Attendance per Academic Year: \n ${formatter.format(cost_of_attendance).replace(/(\.|,)00$/g, '')}`}
            </Text>
        </View>

    );
}

export default SearchCard;

// <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//             <View className="w-full justify-center items-center min-h-[85vh] px-4">
//                 <ImageBackground
//                     source={{ uri: thumbnail }}
//                     className="w-full h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
//                     resizeMode="cover"
//                 />
//                 <View className="relative mt-5">
//                     <Text className="text-2xl text-white font-bold text-center">
//                         {title}
//                     </Text>
//                     <Text className="text-sm font-pregular text-gray-100 mt-3 text-center">
//                         {state}
//                     </Text>
//                     <Text className="text-xl font-pregular text-gray-100 mt-3 text-center">
//                         {`Acceptance Rate : \n ${(acceptance_rate * 100).toFixed(2)}%`}
//                     </Text>
//                     <Text className="text-xl font-pregular text-gray-200 mt-3 text-center">
//                         {`Average SAT score: ${average_sat}`}
//                     </Text>
//                     <Text className="text-sm font-pregular text-gray-300 mt-3 text-center">
//                         {`Average Cost of Attendance per Academic Year: \n ${formatter.format(cost_of_attendance).replace(/(\.|,)00$/g, '')}`}
//                     </Text>
//                 </View>
//                 <CustomButton
//                     title="Close"
//                     handlePress={() => router.push("/home")}
//                     containerStyles="w-full mt-7"
//                 />
//                 <CustomButton
//                     title="Save to Bookmarks"
//                     handlePress={() => {
//                         setShow(false)
//                         return router.push("/bookmarks")
//                     }}
//                     containerStyles="w-full mt-7"
//                 />
//             </View>
//         </ScrollView>

//   <ImageBackground
//             source={{ uri: thumbnail }}
//             className="w-full h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
//             resizeMode="cover"
//         />
//         <View className="relative mt-5">
//             <Text className="text-2xl text-white font-bold text-center">
//                 {title}
//             </Text>
//             <Text className="text-sm font-pregular text-gray-100 mt-3 text-center">
//                 {state}
//             </Text>
//             <Text className="text-xl font-pregular text-gray-100 mt-3 text-center">
//                 {`Acceptance Rate : \n ${(acceptance_rate * 100).toFixed(2)}%`}
//             </Text>
//             <Text className="text-xl font-pregular text-gray-200 mt-3 text-center">
//                 {`Average SAT score: ${average_sat}`}
//             </Text>
//             <Text className="text-sm font-pregular text-gray-300 mt-3 text-center">
//                 {`Average Cost of Attendance per Academic Year: \n ${formatter.format(cost_of_attendance).replace(/(\.|,)00$/g, '')}`}
//             </Text>
//         </View>
//         <CustomButton
//             title="Close"
//             handlePress={() => router.push("/home")}
//             containerStyles="w-full mt-7"
//         />
//         <CustomButton
//             title="Save to Bookmarks"
//             handlePress={() => {
//                 setShow(false)
//                 return router.push("/bookmarks")
//             }}
//             containerStyles="w-full mt-7"
//         />


// <Text className="text-xl font-pregular text-gray-100 mt-3 text-center">
//     {`Acceptance Rate : \n ${(acceptance_rate * 100).toFixed(2)}%`}
// </Text>


