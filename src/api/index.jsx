import axios from "axios";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    'Access-Control-Allow-Origin': '*',
  },
});

// Users Endpoints
export const getUsers = async (queryKey) => {
  const searchQuery = queryKey.queryKey[1];
  return (await api.get(`users?search=${searchQuery}`)).data;
};
export const getUsersWhichHaveMostFollowers = async () => {
  return (await api.get(`users/most-followers`)).data;
};
export const logoutApi = async () => {
  return await api.post("auth/logout");
};


// Posts Endpoints
export const getPosts = async (userId) => {
  return (await api.get("posts?userId=" + userId)).data;
};
export const getPost = async (postId) => {
  postId = postId.queryKey[1];
  return (await api.get(`post/${postId}`)).data;
};
export const createPost = async (newPost) => {
  return await api.post("/posts", newPost);
};
export const deletePost = async (postId) => {
  return await api.delete(`posts/${postId}`);
};
export const updatePost = async (updatedPost) => {
  return await api.put(`posts/${updatedPost.id}`, updatedPost);
};
export const getFilterPosts = async (url) => {
  return (await api.get(url)).data;
};


// Comments Endpoints
export const getComments = async (queryKey) => {
  const postId = queryKey.queryKey[1];
  return (await api.get(`posts/${postId}/comments`)).data;
};
export const createComment = async (postId, newComment) => {
  return await api.post(`posts/${postId}/comments`, newComment);
};

// Likes Endpoints
export const getLikes = async (queryKey) => {
  const postId = queryKey.queryKey[1];
  return (await api.get(`posts/${postId}/likes`)).data;
};
export const likePost = async (postId) => {
  return await api.post(`posts/${postId}/likes`);
};
export const dislikePost = async (postId) => {
  return await api.delete(`posts/${postId}/likes`);
};

// Profile Endpoints
export const getProfile = async (queryKey) => {
  const userId = queryKey.queryKey[1];
  return (await api.get(`user/${userId}`)).data;
};
export const updateProfile = async (updatedUser) => {
  return await api.put(`user`, updatedUser);
};
export const getFollowers = async (queryKey) => {
  const userId = queryKey.queryKey[1];
  return (await api.get(`user/${userId}/followers`)).data;
};
export const getFollowing = async (queryKey) => {
  const userId = queryKey.queryKey[1];
  return (await api.get(`user/${userId}/following?type=onlyId`)).data;
};
export const unfollowUser = async (userId) => {
  return (await api.delete(`user/${userId}/followers`)).data;
};
export const followUser = async (userId) => {
  return (await api.post(`user/${userId}/followers`)).data;
};

// Cart Endpoints
export const getCart = async () => {
  return (await api.get(`cart`)).data;
};
export const addToCart = async (item) => {
  return await api.post(`cart`, item);
};
export const removeFromCart = async (itemId) => {
  return await api.delete(`cart/${itemId}`);
};

// Orders Endpoints
export const getOrders = async () => {
  return (await api.get(`orders`)).data;
};
export const placeOrder = async (order) => {
  return await api.post(`orders`, order);
};


// Messenger Endpoints
export const getConversations = async () => {
  return (await api.get(`conversations`)).data;
};
export const getMessages = async (queryKey) => {
  const conversationId = queryKey.queryKey[1].conversationId;
  return (await api.get(`messages/${conversationId}`)).data;
};
export const sendMessageApi = async (values) => {
  return await api.post(`message`, values);
};
export const createConversationApi = async (values) => {
  return await api.post(`conversation`, values);
};