import React, { useState, useEffect, useRef } from 'react';
import { Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Box, AppBar, Toolbar, IconButton, Typography, List, ListItem,
    ListItemButton, ListItemIcon, ListItemText, Avatar, TextField,
    InputAdornment, Tabs, Tab, Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddFriend from './AddFriend';
import { Scrollbar } from 'react-scrollbars-custom';
import axios from 'axios';
import ChatDetail from './ChatDetail';
import CreateGroupModal from './CreateGroupModal';
import io from 'socket.io-client';
import PeopleIcon from '@mui/icons-material/People';

const ChatListContainer = styled(Box)(({ theme }) => ({
  width: 350,
  backgroundColor: theme.palette.background.paper,
  borderRight: "1px solid ${theme.palette.divider}",
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));

const ChatListHeader = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: 'none',
  borderBottom: "1px solid ${theme.palette.divider}",
  position: 'static',
}));

const ChatListContent = styled(Box)(({ theme }) => ({
  overflowY: 'auto',
  flexGrow: 1,
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
}));

const HoverIconButton = styled(IconButton)(({ theme }) => ({
  '&:hover': {
      backgroundColor: theme.palette.primary.light,
  },
}));

const HoverListItemButton = styled(ListItemButton)(({ theme }) => ({
  '&:hover': {
      backgroundColor: theme.palette.primary.light,
  },
  '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.text.secondary,
  },
}));

const HoverTab = styled(Tab)(({ theme }) => ({
  '&:hover': {
      backgroundColor: theme.palette.primary.light,
  },
}));

const Chat = () => {
    const [searchText, setSearchText] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [selectedChat, setSelectedChat] = useState(null);
    const [chatList, setChatList] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
    const [selectedUserToAdd, setSelectedUserToAdd] = useState(null);
    const [friendRequestsSent, setFriendRequestsSent] = useState([]);
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const socket = useRef();
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false); 
    const [availableFriends, setAvailableFriends] = useState([]);
const currentConversationRef = useRef(null);
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const currentUserId = currentUser?._id;
    const currentUserPhone = currentUser?.phoneNumber || '';
    useEffect(() => {
  currentConversationRef.current = currentConversationId;
}, [currentConversationId]);
useEffect(() => {
  if (!currentUserId) return;

  socket.current = io('http://localhost:5000');

  socket.current.on('connect', () => {
    console.log('✅ Socket connected, id:', socket.current.id);

    // Join room riêng cho user
    socket.current.emit('joinUserRoom', currentUserId);
    console.log(`🚪 Đã emit joinUserRoom với userId: ${currentUserId}`);

    // Lấy tất cả conversation và join đúng loại room
    const joinAllRooms = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get('http://localhost:5000/api/conversation/conversation', {
          headers: { Authorization: `Bearer ${token}` },
        });
console.log("response.data", response.data);

        const conversations = response.data.data || [];

        conversations.forEach((conv) => {
          if (!conv._id || !conv.type) return;

          if (conv.type === "group") {
            socket.current.emit("join_group_conversation", {
              conversationId: conv._id,
              userId: currentUserId,
            });
            console.log(`👥 Join group room: ${conv._id}`);
          } else if (conv.type === "private") {
            socket.current.emit("join_conversation", {
              senderId: currentUserId,
              conversationId: conv._id,
            });
            console.log(`🧍 Join private room: ${conv._id}`);
          }
        });
      } catch (error) {
        console.error('❌ Lỗi khi lấy danh sách conversation:', error);
      }
    };

    joinAllRooms();
  });

  socket.current.on('disconnect', () => {
    console.log('⚠️ Socket disconnected');
  });

  // Đăng ký sự kiện nhận tin nhắn mới
  const handleNewMessage = (message) => {
    console.log("📩 Tin nhắn mới nhận được:", message);
    console.log("id",  currentConversationId, message.conversationId)
    const activeConversationId = currentConversationRef.current;
if (
    // chắc chắn đã chọn chat
    message.senderId?._id !== currentUserId &&
    activeConversationId !== message.conversationId
  ) {
    toast.info(`💬 Tin nhắn mới từ ${message.senderId?.username || 'Người lạ'}: ${message.content || message.text}`, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
      theme: 'light',
    });
  }
    setChatList((prev) => {
  let found = false;
  const updated = prev.map((chat) => {
    if (chat?.conversationId === message.conversationId) {
      found = true;
      let newCount = chat.unreadCount || 0;

      if (message.senderId?._id !== currentUserId &&
    activeConversationId !== message.conversationId
        ) {
        newCount = newCount + 1;
      }

      return {
        ...chat,
        lastMessage: message.content || message.text,
        time: new Date(message.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        unreadCount: newCount,
        updatedAt: new Date(message.createdAt),
      };
    }
    return chat;
  });

  if (!found) {
    // ✅ Xác định có cần tăng unreadCount không
    const shouldCount =
      message.senderId?._id !== currentUserId &&
      selectedChat?.id !== message.conversationId;

    const newChat = {
      conversationId: message.conversationId,
      lastMessage: message.content || message.text,
      unreadCount: shouldCount ? 1 : 0,
      updatedAt: new Date(message.createdAt),
      name: message.senderId?.username || 'Người lạ',
      avatar: message.senderId?.avatarURL || '/static/images/avatar/default.jpg',
      id: message.conversationId,
      time: new Date(message.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    return [newChat, ...updated];
  }

  updated.sort((a, b) => b.updatedAt - a.updatedAt);
  return updated;
});

  };

  socket.current.on("new_message", handleNewMessage);
  console.log('📨 Đã đăng ký event new_message');

  // Đăng ký sự kiện conversation được cập nhật
  const handleConversationUpdated = (updatedConversation) => {
    console.log("🔄 Cập nhật conversation:", updatedConversation);
    // TODO: xử lý cập nhật UI nếu cần
  };
  socket.current.on("conversation_updated", handleConversationUpdated);

  // Gọi API lấy danh sách hội thoại lần đầu (nếu cần cho UI)
  fetchData();

  return () => {
    socket.current.off("new_message", handleNewMessage);
    socket.current.off("conversation_updated", handleConversationUpdated);
    socket.current.disconnect();
    console.log("🧹 Socket đã ngắt kết nối và dọn dẹp sự kiện");
  };
}, [currentUserId]);




    useEffect(() => {
        if (chatList.length) {
            localStorage.setItem('chatList', JSON.stringify(chatList));
        }
    }, [chatList]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get('http://localhost:5000/api/conversation/conversation', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = response.data?.data || [];
            const chatListFormatted = data.map(convo => {
                const isGroup = convo.type === 'group';
                const updatedAt = convo.updatedAt ? new Date(convo.updatedAt) : new Date(0);
let chatInfo = {
    id: convo._id,
    lastMessage: convo.lastMessage?.text || '',
    updatedAt,
    time: updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: convo.type,
    conversationId: convo._id,
};


                if (isGroup) {
                    chatInfo.name = convo.name;
                    chatInfo.avatar = convo.imageGroup || '/static/images/avatar/default_group.png'; 
                } else {
                    const otherUserObject = convo.members.find(member => member.userId._id !== currentUserId);
                    const otherUser = otherUserObject ? otherUserObject.userId : null;
                    if (otherUser) {
                        chatInfo.id = otherUser._id;
                        chatInfo.name = otherUser.username;
                        chatInfo.avatar = otherUser.avatarURL || '/static/images/avatar/default.jpg';
                        chatInfo.phoneNumber = otherUser.phoneNumber;
                    } else {
                        return null; 
                    }
                }
                return chatInfo;
            }).filter(chat => chat !== null);
            setChatList(chatListFormatted);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách hội thoại:', error);
        }
    };

   const handleChatClick = (chat) => {
  setSelectedChat(chat);
  setCurrentConversationId(chat.conversationId);

  setChatList(prev => {
      return prev.map(c => {
          if (c.conversationId === chat.conversationId) {
              return { ...c, unreadCount: 0 };
          }
          return c;
      });
  });
};



    const handleSearchInputChange = (event) => {
        setSearchKeyword(event.target.value);
    };

    const handleStartSearch = async () => {
        setIsSearching(true);
        setSearchResults([]);
        try {
            const response = await axios.get('http://localhost:5000/api/auth/searchphone?phoneNumber=${searchKeyword}');
            if (response.status === 200) {
                setSearchResults([response.data]);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            setSearchResults([]);
        }
    };

    const handleOpenGroupCreation = () => {
        setIsCreateGroupModalOpen(true); // Mở modal từ component Chat
    };

    const handleCloseCreateGroupModal = () => {
        setIsCreateGroupModalOpen(false); // Đóng modal từ component Chat
    };

    const handleCreateGroupSuccess = () => {
        fetchData(); // Gọi lại fetchData để cập nhật danh sách chat
    };

    const handleAddFriend = async () => {
        if (selectedUserToAdd) {
            try {
                const response = await axios.post('http://localhost:5000/api/friend/request', {
                    senderPhone: currentUserPhone,
                    receiverPhone: selectedUserToAdd.phoneNumber,
                }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
                });
                if (response.status === 200) {
                    setFriendRequestsSent(prev => [...prev, selectedUserToAdd._id]);
                    setIsSearching(false);
                    setSearchKeyword('');
                    setSearchResults([]);
                    setIsAddFriendModalOpen(false);
                }
            } catch (error) {
                console.error('Lỗi gửi yêu cầu kết bạn:', error);
            }
        }
    };
// Tính tổng số tin nhắn chưa đọc
  const totalUnread = chatList.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);

  // Tạo danh sách có thêm thời gian đã format
  const formattedChatList = chatList.map(chat => {
    const lastTime = chat.updatedAt || chat.lastMessage?.createdAt;
    const time = lastTime
      ? new Date(lastTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';
    return { ...chat, time };
  });
     return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <ChatListContainer>
        <ChatListHeader position="static">
          <Toolbar>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              aria-label="chat tabs"
              sx={{ flexGrow: 1 }}
            >
              <HoverTab
  label={
    <Badge
      color="error"
      badgeContent={totalUnread}
      invisible={totalUnread === 0}
      max={99}
    >
      Tất cả
    </Badge>
  }
/>

              <HoverTab label="Chưa đọc" />
            </Tabs>
          </Toolbar>

          <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Tìm kiếm bằng số điện thoại"
              value={searchKeyword}
              onChange={handleSearchInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HoverIconButton onClick={handleStartSearch} sx={{ ml: 1 }}>
                <PersonAddIcon />
              </HoverIconButton>
              <HoverIconButton onClick={handleOpenGroupCreation} sx={{ ml: 1 }}>
                <PeopleIcon />
              </HoverIconButton>
              {isSearching && (
                <HoverIconButton
                  onClick={() => {
                    setIsSearching(false);
                    setSearchKeyword('');
                    setSearchResults([]);
                  }}
                  sx={{ ml: 1 }}
                >
                  <CloseIcon />
                </HoverIconButton>
              )}
            </Box>
          </Box>

          {isSearching && searchResults.length > 0 && (
            <List>
              {searchResults.map((user) => (
                <ListItem
                  key={user?._id}
                  alignItems="center"
                  secondaryAction={
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => {
                        setSelectedUserToAdd(user);
                        setIsAddFriendModalOpen(true);
                      }}
                      disabled={
                        friendRequestsSent.includes(user?._id) || user?.phoneNumber === currentUserPhone
                      }
                    >
                      {user?.phoneNumber === currentUserPhone
                        ? 'Bạn'
                        : friendRequestsSent.includes(user?._id)
                        ? 'Đã gửi'
                        : 'Thêm bạn bè'}
                    </Button>
                  }
                >
                  <ListItemIcon>
                    <Avatar src={user?.avatarURL || '/static/images/avatar/default.jpg'} />
                  </ListItemIcon>
                  <ListItemText primary={user?.username} secondary={user?.phoneNumber} />
                </ListItem>
              ))}
            </List>
          )}

          {isSearching && searchResults.length === 0 && searchKeyword && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography color="textSecondary">Không tìm thấy người dùng</Typography>
            </Box>
          )}
        </ChatListHeader>

        <ChatListContent>
          <Scrollbar style={{ width: '100%', height: '100%' }}>
            {formattedChatList
              .filter(chat =>
  chat?.name?.toLowerCase().includes(searchKeyword.toLowerCase())

              )
              .map((chat) => (
                <HoverListItemButton
                  key={chat?.id}
                  selected={selectedChat?.id === chat?.id}
                  onClick={() => handleChatClick(chat)}
                  alignItems="flex-start"
                >
                  <ListItemIcon>
  <Badge badgeContent={chat.unreadCount} color="error" invisible={!chat.unreadCount}>
    <Avatar src={chat?.avatar} />
  </Badge>
</ListItemIcon>

                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="subtitle1">{chat?.name}</Typography>
                        {chat.unreadCount > 0 && (
                          <Box
                            sx={{
                              backgroundColor: 'red',
                              color: 'white',
                              borderRadius: '50%',
                              minWidth: 20,
                              height: 20,
                              fontSize: 12,
                              textAlign: 'center',
                              lineHeight: '20px',
                              ml: 1,
                              px: 0.5,
                            }}
                          >
                            {chat.unreadCount}
                          </Box>
                        )}
                      </Box>
                    }
                    secondary={
                     <React.Fragment>
  <Typography
    sx={{ display: 'inline' }}
    component="span"
    variant="body2"
    color="text.primary"
  >
    {chat?.lastMessage}
  </Typography>
  {' — ' + chat?.time}
</React.Fragment>

                    }
                  />
                </HoverListItemButton>
              ))}
          </Scrollbar>
        </ChatListContent>
      </ChatListContainer>

      <ChatDetail
        selectedChat={selectedChat}
        onBackToChatList={() => setSelectedChat(null)}
        conversationId={currentConversationId}
        socket={socket.current}
      />

      <AddFriend
        open={isAddFriendModalOpen}
        onClose={() => setIsAddFriendModalOpen(false)}
        onConfirm={handleAddFriend}
        user={selectedUserToAdd}
      />

      <CreateGroupModal
        open={isCreateGroupModalOpen}
        onClose={handleCloseCreateGroupModal}
        onCreateGroupSuccess={handleCreateGroupSuccess}
        availableFriends={availableFriends}
        socket={socket.current}
      />
      <ToastContainer />
    </Box>
    
  );
};


export default Chat;