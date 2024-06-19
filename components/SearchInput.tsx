import { icons } from "@/constants";
import { router, usePathname } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

const SearchInput = ({ initialQuery }: { initialQuery?: string }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  return (
    <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4">
      <TextInput
        value={query}
        onChangeText={(e) => setQuery(e)}
        placeholder="search for a video topic"
        placeholderTextColor="#cdcde0"
        className="text-base mt-0.5 text-white flex-1 font-pregular"
      />

      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert(
              "Missing query",
              "please input something to search result across database"
            );
          }

          if (pathname.startsWith("/search")) {
            router.setParams({ query });
          } else {
            router.push(`/search/${query}`);
          }
        }}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
