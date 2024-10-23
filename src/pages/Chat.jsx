import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    Sidebar,
    Search,
    Conversation,
    Avatar,
    ConversationList,
    ConversationHeader,
    TypingIndicator
} from "@chatscope/chat-ui-kit-react";
import { useState, useEffect, useCallback, useContext, useMemo } from "react";
import { formatDistance } from "date-fns";
import { IoMdLogOut } from "react-icons/io";
import { auth, signOut, collection, query, where, db, addDoc, onSnapshot, orderBy, serverTimestamp, updateDoc, doc } from "../config/firebase";
import { useSearchParams, useNavigate } from "react-router-dom";
import User from "../context/user";
import { useDebounce } from 'use-debounce';

function UserChat() {
    const [messageInputValue, setMessageInputValue] = useState("");
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [sidebarStyle, setSidebarStyle] = useState({});
    const [chatContainerStyle, setChatContainerStyle] = useState({});
    const [conversationContentStyle, setConversationContentStyle] = useState({});
    const [conversationAvatarStyle, setConversationAvatarStyle] = useState({});
    const [chats, setChats] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [currentChat, setCurrentChat] = useState({});
    const user = useContext(User).user;
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const chatIdParam = searchParams.get('chatId');
    const [value] = useDebounce(messageInputValue, 2000);

    const logout = () => {
        signOut(auth);
    };

    const chatId = (currentId) => {
        return user.uid < currentId ? `${user.uid}${currentId}` : `${currentId}${user.uid}`;
    };

    const onSend = async () => {
        setMessageInputValue("");
        await addDoc(collection(db, "messages"), {
            message: messageInputValue,
            sentTime: new Date().toISOString(),
            sender: user.uid,
            receiver: currentChat.uid,
            chatId: chatId(currentChat.uid),
            timeStamp: serverTimestamp()
        });
        await updateDoc(doc(db, "users", currentChat.uid), {
            [`lastMessages.${chatId(currentChat.uid)}`]: {
                lastMessage: messageInputValue,
                chatId: chatId(currentChat.uid)
            }
        });
        await updateDoc(doc(db, "users", user.uid), {
            [`lastMessages.${chatId(currentChat.uid)}`]: {
                lastMessage: messageInputValue,
                chatId: chatId(currentChat.uid)
            }
        });
    };

    const handleBackClick = () => setSidebarVisible(!sidebarVisible);

    const handleConversationClick = useCallback(() => {
        if (sidebarVisible) {
            setSidebarVisible(false);
        }
    }, [sidebarVisible]);

    const getAllUsers = async () => {
        const q = query(collection(db, "users"), where("email", "!=", user.email));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const users = [];
            querySnapshot.forEach((doc) => {
                const user = { ...doc.data(), id: doc.id, bgColor: randomColor() };
                users.push(user);
            });
            setChats(users);
        });
    };

    const setTyping = async (typing) => {
        // Logic for handling typing indication
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    useEffect(() => {
        if (chats.length) {
            const currentChatIndex = chats.findIndex(v => v.id === chatIdParam);
            if (currentChatIndex !== -1) {
                searchParams.set("chatId", chats[currentChatIndex].id);
                navigate(`/chat?${searchParams}`);
                setCurrentChat(chats[currentChatIndex]);
            } else {
                searchParams.set("chatId", chats[0].id);
                navigate(`/chat?${searchParams}`);
                setCurrentChat(chats[0]);
            }
        }
    }, [chatIdParam, chats]);

    const getAllMessages = async () => {
        const q = query(collection(db, "messages"), where("chatId", "==", chatId(currentChat.uid)), orderBy("timeStamp", "asc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messages = [];
            querySnapshot.forEach((doc) => {
                messages.push({
                    ...doc.data(),
                    id: doc.id,
                    direction: doc.data().sender === user.uid ? "outgoing" : "incoming"
                });
            });
            setChatMessages(messages);
        });
    };

    useEffect(() => {
        getAllMessages();
    }, [currentChat]);

    useEffect(() => {
        if (sidebarVisible) {
            setSidebarStyle({ display: "flex", flexBasis: "auto", width: "100%", maxWidth: "100%" });
            setChatContainerStyle({ display: "none" });
        } else {
            setSidebarStyle({});
            setChatContainerStyle({});
        }
    }, [sidebarVisible]);

    const randomColor = () => {
        const colors = ["757ce8", "f44336", '0D8ABC'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const isTyping = currentChat?.isTyping?.[chatId(currentChat.uid)]?.[currentChat.uid];

    return (
        <div style={{ height: "100vh", position: "relative", width: "100vw" }}>
            <MainContainer responsive style={{ width: "100%", height: "100%" }}>
                <Sidebar position="left" scrollable={false} style={sidebarStyle}>
                    <ConversationHeader>
                        <Avatar src={`https://ui-avatars.com/api/?background=random&color=fff&name=${user.full_name}`} name="Zoe" />
                        <ConversationHeader.Content userName={user.full_name} />
                        <ConversationHeader.Actions>
                            <IoMdLogOut onClick={logout} cursor={"pointer"} size={30} />
                        </ConversationHeader.Actions>
                    </ConversationHeader>
                    <Search placeholder="Search..." />
                    <ConversationList>
                        {chats.map((v) => (
                            <Conversation
                                style={{ backgroundColor: searchParams.get("chatId") === v.id ? "#c6e3fa" : "" }}
                                key={v.id}
                                onClick={() => {
                                    handleConversationClick();
                                    setCurrentChat(v);
                                    searchParams.set("chatId", v.id);
                                    navigate(`/chat?${searchParams}`);
                                }}
                            >
                                <Avatar src={`https://ui-avatars.com/api/?background=random&color=fff&name=${v.full_name}`} name={v.full_name} status="available" style={conversationAvatarStyle} />
                                <Conversation.Content name={v.full_name}
                                    info={v?.lastMessages?.[chatId(v.id)]?.lastMessage || ""}
                                    style={conversationContentStyle} />
                            </Conversation>
                        ))}
                    </ConversationList>
                </Sidebar>
                <ChatContainer style={chatContainerStyle}>
                    <ConversationHeader>
                        <ConversationHeader.Back onClick={handleBackClick} />
                        <Avatar src={`https://ui-avatars.com/api/?background=random&color=fff&name=${currentChat?.full_name}`} name={currentChat?.full_name} />
                        <ConversationHeader.Content userName={currentChat?.full_name} info="Active 10 mins ago" />
                    </ConversationHeader>

                    <MessageList typingIndicator={isTyping ? <TypingIndicator content={currentChat.full_name} /> : false}>
                        {chatMessages.map((v, i) => (
                            <Message key={i} model={v}>
                                <Avatar src={`https://ui-avatars.com/api/?background=random&color=fff&name=${user.uid === v.sender ? user.full_name : currentChat?.full_name}`} name="Zoe" />
                                <Message.Footer sentTime={formatDistance(new Date(v.sentTime), new Date(), { addSuffix: true })} />
                            </Message>
                        ))}
                    </MessageList>
                    <MessageInput placeholder="Type message here" value={messageInputValue} onChange={val => setMessageInputValue(val)} onSend={onSend} />
                </ChatContainer>
            </MainContainer>
        </div>
    );
}

export default UserChat;
