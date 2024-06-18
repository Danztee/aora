import React, { useEffect, useState } from "react";
import { Alert } from "react-native";

export type Post = {
  title: string;
  $id: string;
  thumbnail: string;
  video: string;
  creator: {
    username: string;
    avatar: string;
  };
};

const useAppwrite = (fn: () => any) => {
  const [data, setData] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await fn();
      setData(response);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    fetchData();
  };

  return { data, refetch, isLoading };
};

export default useAppwrite;
