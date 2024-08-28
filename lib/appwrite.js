import { Client, Account, ID, Avatars, Databases, Query, Storage, Permission, Role } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.company.worm",
    projectId: "661ed05852385ff89232",
    databaseId: "661f89065c94cbf9cd19",
    userCollectionId: "661f895d3766a5217563",
    postCollectionId: "661f8d0adac5c212c982",
    likeCollectionId: "662bfa93003385a8b07d",
    postsByCollegesCollectionId: "66226b1eb2df08d6854f",
    postsByUserCollectionId: "661f914e61e0031bcbe2",
    commentsByUserCollectionId: "6639e2ee0019e9a20aee",
    repliesByUserCollection: "66771440003d7daeda93",
    featuringSchoolsId: "6623c269708e23231982",
    videoCollectionId: "662d3bfd00050a71ebf2",
    imageCollectionId: "668004cd002ba92f6d4d",
    storageId: "661f946d10ce253c0dc7"
}

const { endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    postCollectionId,
    likeCollectionId,
    postsByCollegesCollectionId,
    postsByUserCollectionId,
    storageId,
    featuringSchoolsId,
    videoCollectionId,
    imageCollectionId,
    commentsByUserCollectionId,
    repliesByUserCollection
} = appwriteConfig;

// Init your react-native SDK
const client = new Client();


client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID
    ;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Create account
export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if (!newAccount) {
            throw Error;
        }
        const avatarUrl = avatars.getInitials(username);
        await signIn(email, password);

        const newUser = await databases.createDocument(
            databaseId,
            userCollectionId,
            newAccount.$id,
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl,
            }
        );

        return newUser;

    } catch (e) {
        console.log(e);
        throw new Error(e);
    }
}

// Sign in
export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailSession(email, password);
        console.log("SESSION", session)
        getAccount();
        return session;

    } catch (e) {
        throw new Error(e);
    }

}

// Sign out 
export const signOut = async () => {
    try {
        const session = await account.deleteSession("current");
        //console.log("session", session);
        return session;
    } catch (error) {
        throw new Error(error);
    }
}




// Get Account
export const getAccount = async () => {
    try {
        const currentAccount = await account.get();

        return currentAccount;
    } catch (error) {
        throw new Error(error);
    }
}


// Get Current User
export const getCurrentUser = async () => {
    try {
        const currentAccount = await getAccount();
        //console.log("current account", currentAccount);
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        //console.log("currentuser.documents", currentUser.documents)
        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

// Get posts by colleges
export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            postsByCollegesCollectionId
        )
        return posts.documents;

    } catch (e) {
        throw new Error(e);
    }
}


export const getFeaturingSchools = async () => {

    try {

        const featuring = await databases.listDocuments(
            databaseId,
            featuringSchoolsId,
            [Query.orderDesc("$createdAt", Query.limit(5))]

        )
        return featuring.documents;

    } catch (e) {
        throw new Error(e);
    }

}

export const searchFeauturedSchools = async () => {
    try {
        const result = await databases.listDocuments(
            databaseId,
            featuringSchoolsId,
            [Query.search("title", query)]
        )
        //console.log(result); // Resource URL
        if (!result) throw new Error("Something went wrong");

        return result.documents;

    } catch (e) {
        throw new Error(e);
    }
}

export const getUserPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            postsByUserCollectionId,
            [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
        );
        //console.log("posts by users", posts.documents)

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const createUserPost = async (form) => {
    try {
        const posts = await databases.createDocument(
            databaseId, // databaseId
            postsByUserCollectionId, // collectionId
            ID.unique(), // documentId
            {
                title: form.title,
                body: form.body,
                creator: form.userId
            }
        );
        //console.log("posts by users", posts.documents)
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const deleteUserPost = async (postId) => {
    try {
        await databases.deleteDocument(
            databaseId, // databaseId
            postsByUserCollectionId, // collectionId
            postId, // documentId
        );
    } catch (error) {
        console.log("error", error)
        throw new Error(error);
    }

}

export const editUserPost = async (postId, form) => {
    try {
        await databases.updateDocument(
            databaseId, // databaseId
            postsByUserCollectionId, // collectionId
            postId, // documentId
            {
                title: form.title,
                body: form.body,
                creator: form.userId
            } // data (optional)
        );

    } catch (error) {
        throw new Error(error);
    }

}


export const likePost = async (postId, userId) => {
    try {
        console.log("Like post clicked!!!");
        const likes = await databases.updateDocument(
            databaseId, // databaseId
            postsByUserCollectionId, // collectionId
            postId, // documentId
            {
                liked_by: [].concat([userId])
            }
        );
        //console.log("posts by users", posts.documents)
        return likes.documents;
    } catch (error) {
        throw new Error(error)
    }
}

export const unlikePost = async (postId, userId) => {
    try {
        console.log("Unlike post clicked!!!");
        likedPost = await getPostLikedByUser(postId, userId);
        //console.log("liked post", likedPost.liked_by);
        likedPost.liked_by.indexOf(userId) > -1 && likedPost.liked_by.splice(likedPost.liked_by.indexOf(userId), 1);
        const likes = await databases.updateDocument(
            databaseId, // databaseId
            postsByUserCollectionId, // collectionId
            postId, // documentId
            {
                liked_by: likedPost.liked_by
            }
        );
        //console.log("posts by users", posts.documents)
        return likes.documents;
    } catch (error) {
        throw new Error(error)
    }
}


export const getPostLikedByUser = async (postId, userId) => {
    try {
        const likes = await databases.listDocuments(
            databaseId, // databaseId
            postsByUserCollectionId, // collectionId
            [
                Query.equal('$id', postId), Query.search("liked_by", [userId])
            ]
        );
        console.log("liked by user", likes.documents);
        return likes.documents[0];
    } catch (error) {
        throw new Error(error)
    }
}


export const getPostsLikedByUser = async (userId) => {
    try {
        const likes = await databases.listDocuments(
            databaseId,
            postsByUserCollectionId,
            [Query.search("liked_by", [userId]), Query.orderDesc("$createdAt")]
        );
        console.log("likes by users", likes.documents)
        return likes.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const getAllPostsByUsers = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            postsByUserCollectionId,
            [Query.orderDesc("$createdAt")]
        )
        return posts.documents;

    } catch (e) {
        throw new Error(e);
    }
}

export const createUserComment = async (form) => {
    try {
        const posts = await databases.createDocument(
            databaseId, // databaseId
            commentsByUserCollectionId, // collectionId
            ID.unique(), // documentId
            {
                body: form.body,
                user: form.userId,
                post: form.postId
            }
        );
        //console.log("posts by users", posts.documents)
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const likeComment = async (commentId, userId) => {
    try {
        console.log("Like comment clicked!!!");
        const likes = await databases.updateDocument(
            databaseId, // databaseId
            commentsByUserCollectionId, // collectionId
            commentId, // documentId
            {
                liked_by: [].concat([userId])
            }
        );
        return likes.documents;
    } catch (error) {
        throw new Error(error)
    }
}

export const unlikeComment = async (commentId, userId) => {
    try {
        console.log("Unlike comment clicked!!!");
        likedComment = await getCommentLikedByUser(commentId, userId);
        //console.log("liked comment", likedComment.liked_by);
        likedComment.liked_by.indexOf(userId) > -1 && likedComment.liked_by.splice(likedComment.liked_by.indexOf(userId), 1);
        const likes = await databases.updateDocument(
            databaseId, // databaseId
            commentsByUserCollectionId, // collectionId
            commentId, // documentId
            {
                liked_by: likedComment.liked_by
            }
        );
        return likes.documents;
    } catch (error) {
        throw new Error(error)
    }
}

export const getCommentLikedByUser = async (commentId, userId) => {
    try {
        const likes = await databases.listDocuments(
            databaseId, // databaseId
            commentsByUserCollectionId, // collectionId
            [
                Query.equal('$id', commentId), Query.search("liked_by", [userId])
            ]
        );
        console.log("liked by user", likes.documents);
        return likes.documents[0];
    } catch (error) {
        throw new Error(error)
    }

}


export const deleteUserComment = async (commentId) => {
    try {
        await databases.deleteDocument(
            databaseId, // databaseId
            commentsByUserCollectionId, // collectionId
            commentId, // documentId
        );
    } catch (error) {
        console.log("error", error)
        throw new Error(error);
    }
}

export const editUserComment = async (commentId, form) => {
    try {
        await databases.updateDocument(
            databaseId, // databaseId
            commentsByUserCollectionId, // collectionId
            commentId, // documentId
            {
                body: form.body,
                user: form.userId,
                post: form.postId
            } // data (optional)
        );

    } catch (error) {
        throw new Error(error);
    }
}

export const getAllComments = async () => {
    try {
        const comments = await databases.listDocuments(
            databaseId,
            commentsByUserCollectionId
        )
        //console.log("comments", comments.documents);
        return comments.documents;

    } catch (e) {
        throw new Error(e);
    }

}

export const getCommentsByPost = async (postId) => {
    try {
        const comments = await databases.listDocuments(
            databaseId,
            commentsByUserCollectionId,
            [Query.equal("post", postId), Query.orderDesc("$createdAt")]
        );
        //console.log("comments by post", comments.documents);
        return comments.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const createReply = async (form) => {
    try {
        const posts = await databases.createDocument(
            databaseId, // databaseId
            repliesByUserCollection, // collectionId
            ID.unique(), // documentId
            {
                body: form.body,
                user: form.userId,
                comment: form.commentId
            }
        );
        //console.log("posts by users", posts.documents)
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }

}

export const deleteUserReply = async (replyId) => {
    try {
        await databases.deleteDocument(
            databaseId, // databaseId
            repliesByUserCollection, // collectionId
            replyId, // documentId
        );
    } catch (error) {
        console.log("error", error)
        throw new Error(error);
    }

}

export const getRepliesByComment = async (commentId) => {
    try {
        const replies = await databases.listDocuments(
            databaseId,
            repliesByUserCollection,
            [Query.equal("comment", commentId), Query.orderDesc("$createdAt")]
        );
        //console.log("replies by comment", replies.documents);
        return replies.documents;
    } catch (error) {
        throw new Error(error);
    }

}



export const editUserReply = async (replyId, form) => {
    try {
        await databases.updateDocument(
            databaseId, // databaseId
            repliesByUserCollection, // collectionId
            replyId, // documentId
            {
                body: form.body,
                user: form.userId,
                comment: form.commentId
            } // data (optional)
        );

    } catch (error) {
        throw new Error(error);
    }

}

export const getReplyLikedByUser = async (replyId, userId) => {
    try {
        const likes = await databases.listDocuments(
            databaseId, // databaseId
            repliesByUserCollection, // collectionId
            [
                Query.equal('$id', replyId), Query.search("liked_by", [userId])
            ]
        );
        console.log("liked by user", likes.documents);
        return likes.documents[0];
    } catch (error) {
        throw new Error(error)
    }

}


export const likeReply = async (replyId, userId) => {
    try {
        console.log("Like reply clicked!!!");
        const likes = await databases.updateDocument(
            databaseId, // databaseId
            repliesByUserCollection, // collectionId
            replyId, // documentId
            {
                liked_by: [].concat([userId])
            }
        );
        return likes.documents;
    } catch (error) {
        throw new Error(error)
    }
}

export const unlikeReply = async (replyId, userId) => {
    try {
        console.log("Unlike reply clicked!!!");
        likedReply = await getReplyLikedByUser(replyId, userId);
        //console.log("liked reply", likedReply.liked_by);
        likedReply.liked_by.indexOf(userId) > -1 && likedReply.liked_by.splice(likedReply.liked_by.indexOf(userId), 1);
        const likes = await databases.updateDocument(
            databaseId, // databaseId
            repliesByUserCollection, // collectionId
            replyId, // documentId
            {
                liked_by: likedReply.liked_by
            }
        );
        return likes.documents;
    } catch (error) {
        throw new Error(error)
    }

}

export const getFilePreview = async (fileId, type) => {
    let fileUrl;
    try {
        if (type === "video") {
            fileUrl = storage.getFileView(storageId, fileId);
        } else if (type === "image") {
            fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, "top", 100);
        } else {
            throw new Error("Invalid file type");
        }
        if (!fileUrl) throw Error;
        return fileUrl;
    }
    catch (e) {
        throw new Error(e);
    }
}


export const uploadFile = async (file, type) => {
    if (!file) return;
    const asset = {
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri
    };
    //console.log("FILE", file, "type", type);
    //console.log("asset", asset)
    try {
        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        );
        console.log("uploadedFile", uploadedFile);
        const fileUrl = await getFilePreview(uploadedFile.$id, type);
        console.log("fileUrl", fileUrl);
        return fileUrl;

    }
    catch (e) {
        throw new Error(e);
    }
}

// Create Video Post
export const createVideoPost = async (form) => {
    //console.log("form", form);
    try {
        const [videoUrl] = await Promise.all([
            uploadFile(form.video, "video")
        ]);

        console.log("videoUrl", videoUrl);
        const newPost = await databases.createDocument(
            databaseId,
            videoCollectionId,
            ID.unique(),
            {
                video: videoUrl,
                creator: form.userId,
            }
        );

        return newPost;
    } catch (error) {
        throw new Error(error);
    }
}


export const getUserVideos = async (userId) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
        );

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}


export const createProfilePicture = async (form) => {
    //console.log("form", form);
    try {
        const [imageUrl] = await Promise.all([
            uploadFile(form.thumbnail, "image")
        ]);

        console.log("imageUrl", imageUrl);
        const newPost = await databases.createDocument(
            databaseId,
            imageCollectionId,
            ID.unique(),
            {
                thumbnail: imageUrl,
                creator: form.userId,
            }
        );

        return newPost;
    } catch (error) {
        throw new Error(error);
    }

}

export const getProfilePicture = async (userId) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            imageCollectionId,
            [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
        );

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }

}


export const saveSchool = async (userId, postId) => {
    try {
        const result = await databases.updateDocument(
            databaseId,
            featuringSchoolsId,
            postId,
            { saved_by_user: userId }, // data (optional)
        );
        // console.log("RESULT", result);
    }
    catch (e) {
        throw new Error(e);
    }

}

export const getSavedSchools = async (userId) => {
    try {

        const data = await databases.listDocuments(
            databaseId,
            featuringSchoolsId,
            [Query.equal("saved_by_user", userId), Query.orderDesc("$createdAt")]
        );
        //console.log("data.documents", data.documents)
        return data.documents;
    }
    catch (e) {
        throw new Error(e)
    }
}

