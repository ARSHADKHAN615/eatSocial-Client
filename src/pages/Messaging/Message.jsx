import { Button, Form, Input, message, notification } from "antd";
import Conversation from "../../components/conversation/Conversation";
import "./message.scss";
import MessageField from "../../components/conversation/MessageField";
import ChatOnline from "../../components/conversation/ChatOnline";
import { getConversations, getMessages, sendMessageApi } from "../../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import NormalLoader from "../../components/NormalLoader";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/authContext";
import { io } from "socket.io-client";
import { Navigate } from "react-router-dom";

const Message = () => {
  const [currentChat, setCurrentChat] = useState(null);
  const { currentUser } = useAuth();
  const [form] = Form.useForm();
  const socket = useRef();
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  // Scroll to the bottom of the messages
  const scrollRef = useRef();

  // Initialize the socket connection and listen for new messages
  useEffect(() => {
    socket.current = io(import.meta.env.VITE_SOCKET_URL);
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        con_id: data.conversationId,
        sender_id: data.sender.userId,
        text: data.text,
        createdAt: Date.now(),
        sender: data.sender,
      });
      // console.log(data);
    });
    return () => {
      socket.current.disconnect();
    };
  }, []);

  // Add the current user to the online users list
  useEffect(() => {
    socket.current.emit("addUser", {
      userId: currentUser.id,
      name: currentUser.name,
      profilePic: currentUser.profilePic,
    });
    socket.current.on("getUsers", (users) => {
      // console.log(users);
      setOnlineUsers(users);
    });
    return () => {
      socket.current.disconnect();
    };
  }, [currentUser.id]);

  // Set the current conversation's messages
  useEffect(() => {
    if (arrivalMessage && currentChat?.con_id === arrivalMessage.con_id) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
    if (arrivalMessage && currentChat?.con_id !== arrivalMessage.con_id) {
      notification.open({
        message: <b>{arrivalMessage.sender.name} sent you a message</b>,
        description: arrivalMessage.text,
      });
    }
    setArrivalMessage(null);
  }, [arrivalMessage, currentChat]);

  // Get the All conversations
  const {
    data: conversations,
    isLoading: conversationsLoading,
    error: conversationsError,
    isFetching: conversationsFetching,
    refetch: refetchConversations,
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
    onError: (error) => {
      console.log(error);
    },
  });

  // Get the messages of the current conversation
  const {
    data,
    isLoading: messagesLoading,
    error: messagesError,
  } = useQuery({
    queryKey: ["messages", { conversationId: currentChat?.con_id }],
    queryFn: getMessages,
    enabled: !!currentChat?.con_id,
    onSuccess: (data) => {
      setMessages(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // Scroll to the bottom of the messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentChat?.con_id]);

  // Handle the send message
  const handleSendMessage = (values) => {
    // Send the message to the server
    socket.current.emit("sendMessage", {
      conversationId: currentChat?.con_id,
      sender: {
        userId: currentUser.id,
        name: currentUser.name,
        profilePic: currentUser.profilePic,
      },
      receiver: {
        userId: currentChat?.friend.id,
        name: currentChat?.friend.name,
        profilePic: currentChat?.friend.profilePic,
      },
      text: values.message,
    });
    // Add the message to the messages array
    setMessages((prev) => [
      ...prev,
      {
        con_id: currentChat?.con_id,
        sender_id: currentUser.id,
        text: values.message,
        createdAt: Date.now(),
        sender: {
          userId: currentUser.id,
          name: currentUser.name,
          profilePic: currentUser.profilePic,
        },
      },
    ]);
    form.resetFields();
  };

  const info = () => {
    message.info("You Not have any conversation, please create one");
  };

  return (
    <div className="messengerContainer">
      <div className="messenger">
        <div className="chatMenu">
          {/* <Input
            placeholder="Search for friends"
            size="large"
            style={{ marginBottom: "10px", marginTop: "10px" }}
          /> */}
          <span className="con-title" onClick={() => refetchConversations()}>
            <span className="refresh-btn">
              Refresh <i className="ri-refresh-line"></i>
            </span>
          </span>
          {conversationsLoading || conversationsFetching ? (
            <NormalLoader />
          ) : conversationsError ? (
            <>
              <Navigate to="/" />
              {info()}
            </>
          ) : (
            <div>
              {conversations.map((c, i) => (
                <div key={i} onClick={() => setCurrentChat(c)}>
                  <Conversation
                    conversation={c}
                    CurrentConversation={currentChat}
                    onlineUsers={onlineUsers}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="chatBox">
          {currentChat ? (
            <>
              {!messagesLoading ? (
                <div className="chatBoxTop">
                  {messages.map((m, i) => (
                    <div key={i} ref={scrollRef}>
                      <MessageField
                        message={m}
                        own={m.sender_id === currentUser.id}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <NormalLoader />
              )}
              <div className="chatBoxBottom">
                <Form
                  onFinish={handleSendMessage}
                  layout="inline"
                  style={{ width: "100%" }}
                  form={form}
                >
                  <Form.Item
                    name="message"
                    rules={[
                      { required: true, message: "Please input your message!" },
                    ]}
                    style={{ width: "80%", margin: "0px", marginRight: "10px" }}
                  >
                    <Input placeholder="Type a message" size="large" />
                  </Form.Item>
                  <Form.Item style={{ margin: "0px" }}>
                    <Button
                      type="primary"
                      size="large"
                      htmlType="submit"
                      style={{ width: "100%" }}
                    >
                      Send
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </>
          ) : (
            <span className="noConversationText">
              Open a conversation to start a chat.
            </span>
          )}
        </div>
        {/* <div className="chatOnline">
        <ChatOnline
          onlineUsers={onlineUsers}
          currentId={currentUser.id}
          setCurrentChat={setCurrentChat}
        />
      </div> */}
      </div>
    </div>
  );
};

export default Message;
