import { FormUploadVideoAppwrite } from "@/app/(tabs)/create";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  ImageGravity,
  Query,
  Storage,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.danztee.aora",
  projectId: "666f02d50005b24f58df",
  databaseId: "666f040f000b87de13f7",
  userCollectionId: "666f0436001373fbca9f",
  videoCollectionId: "666f044c0016c40fbcff",
  storageId: "666f05ec0012291d78d9",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = config;

// Init your React Native SDK
const client = new Client();

client.setEndpoint(endpoint).setProject(projectId).setPlatform(platform);

const account = new Account(client);
const avatar = new Avatars(client);
const database = new Databases(client);
const storage = new Storage(client);

export const createUser = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatar.getInitials(username);

    await loginUser(email, password);

    const newUser = await database.createDocument(
      databaseId,
      userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await database.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await database.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt"),
    ]);
    return posts.documents;
  } catch (error: any) {
    throw new Error();
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await database.listDocuments(
      databaseId,
      videoCollectionId,

      //@ts-ignore
      [Query.orderDesc("$createdAt", Query.limit(7))]
    );
    return posts.documents;
  } catch (error: any) {
    throw new Error();
  }
};

export const searchPosts = async (query: string) => {
  try {
    const posts = await database.listDocuments(databaseId, videoCollectionId, [
      Query.search("title", query),
    ]);
    return posts.documents;
  } catch (error: any) {
    throw new Error();
  }
};

export const getUserPosts = async (userId: string) => {
  try {
    const posts = await database.listDocuments(databaseId, videoCollectionId, [
      Query.equal(
        "creator",
        userId,
        // @ts-ignore
        Query.orderDesc("$createdAt")
      ),
    ]);
    return posts.documents;
  } catch (error: any) {
    throw new Error();
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error: any) {
    throw new Error();
  }
};

export const getFilePreview = async (fileId: string, type: string) => {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        "top" as ImageGravity,
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error();

    return fileUrl;
  } catch (error: any) {
    throw new Error();
  }
};

export const uploadFile = async (file: any, type: string) => {
  if (!file) {
    return;
  }

  // const { mineType, ...rest } = file;
  // const asset = { type: mineType, ...rest };

  const asset = {
    name: file.fileName,
    type: file.mineType,
    size: file.size,
    uri: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );
    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error: any) {
    throw new Error();
  }
};

export const createVideo = async (formData: FormUploadVideoAppwrite) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(formData.thumbnail, "image"),
      uploadFile(formData.video, "video"),
    ]);

    const newPost = await database.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        title: formData.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: formData.prompt,
        creator: formData.userId,
      }
    );

    return newPost;
  } catch (error: any) {
    throw new Error();
  }
};
