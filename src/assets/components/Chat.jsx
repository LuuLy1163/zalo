import React, { useState, useEffect, useRef } from 'react';
import { Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Box, AppBar, Toolbar, IconButton, Typography, List, ListItem,
    ListItemButton, ListItemIcon, ListItemText, Avatar, TextField,
    InputAdornment, Tabs, Tab, Button,DialogContent, Dialog 
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

const CustomMessageDialogContent = styled(DialogContent)(({ theme }) => ({
    textAlign: 'center',
    padding: theme.spacing(4),
    minWidth: 300,
    maxWidth: 400,
}));

const CustomMessageTypography = styled(Typography)(({ theme }) => ({
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: theme.palette.text.primary,
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
     const [acceptedFriends, setAcceptedFriends] = useState([]);
    
        const [dialogOpen, setDialogOpen] = useState(false);
        const [dialogMessage, setDialogMessage] = useState('');
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
  const activeConversationId = currentConversationRef.current;

  if (
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

    return {
      ...chat,
      lastMessage: message.content || message.text,
      time: new Date(message.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      updatedAt: new Date(message.createdAt),
      // giữ nguyên unreadCount — đợi socket "unread_updated"
    };
  }
  return chat;
});


    if (!found) {
      // Tạo mới chat với unreadCount = 0, đợi server gửi update
      const newChat = {
        conversationId: message.conversationId,
        lastMessage: message.content || message.text,
        unreadCount: 0,
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
  const updatedAt = new Date(updatedConversation.updatedAt);

  setChatList(prevChatList =>
    prevChatList.map(chat =>
      chat.conversationId === updatedConversation._id
        ? {
            ...chat,
            lastMessage: updatedConversation.lastMessage?.text || '',
            updatedAt,
            time: updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unreadCount: updatedConversation.unreadCount?.[currentUserId] || 0,
          }
        : chat
    )
  );
};

  socket.current.on("conversation_updated", handleConversationUpdated);

  // Gọi API lấy danh sách hội thoại lần đầu (nếu cần cho UI)
  fetchData();
fetchFriendRequestsSent();
        fetchAcceptedFriends();
  return () => {
    socket.current.off("new_message", handleNewMessage);
    socket.current.off("conversation_updated", handleConversationUpdated);
    socket.current.disconnect();
    console.log("🧹 Socket đã ngắt kết nối và dọn dẹp sự kiện");
  };
}, [currentUserId]);

 const fetchFriendRequestsSent = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(`http://localhost:5000/api/friend/sentRequests?userId=${currentUserId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFriendRequestsSent(response.data.map(request => request.receiverId));
        } catch (error) {
            console.error('Lỗi khi lấy yêu cầu kết bạn đã gửi:', error);
        }
    };

    const fetchAcceptedFriends = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(`http://localhost:5000/api/friend/friends`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Lưu cả ID và thông tin đầy đủ để dễ dàng tìm conversation sau này
            setAcceptedFriends(response.data.acceptedFriends.map(friend => friend._id));
            setAvailableFriends(response.data.acceptedFriends); // Giữ nguyên cho tạo nhóm
        } catch (error) {
            console.error('Lỗi khi lấy danh sách bạn bè đã chấp nhận:', error);
        }
    };
useEffect(() => {
  if (!socket.current) return;

  const handleUnreadUpdate = ({ conversationId, count }) => {
    setChatList(prev =>
      prev.map(c =>
        c.conversationId === conversationId
          ? { ...c, unreadCount: count }
          : c
      )
    );
  };

  socket.current.on("unread_updated", handleUnreadUpdate);

  return () => {
    socket.current.off("unread_updated", handleUnreadUpdate);
  };
}, []);



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
    unreadCount: convo.unreadCount?.[currentUserId] || 0, 
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
  currentConversationRef.current = chat.conversationId; // cập nhật ngay lập tức

  socket.current.emit("mark_conversation_read", {
    conversationId: chat.conversationId,
    userId: currentUserId,
  });

  setChatList(prev =>
    prev.map(c =>
      c.conversationId === chat.conversationId
        ? { ...c, unreadCount: 0 }
        : c
    )
  );
};




    const handleSearchInputChange = (event) => {
        setSearchKeyword(event.target.value);
    };

     const handleStartSearch = async () => {
            setIsSearching(true);
            setSearchResults([]);
            if (!searchKeyword) {
                setDialogMessage('Vui lòng nhập số điện thoại để tìm kiếm.');
                setDialogOpen(true);
                setIsSearching(false);
                return;
            }
            try {
                const response = await axios.get(`http://localhost:5000/api/auth/searchphone?phoneNumber=${searchKeyword}`);
                if (response.status === 200 && response.data) {
                    // Kiểm tra nếu tìm thấy chính mình hoặc đã là bạn bè
                    if (response.data.phoneNumber === currentUserPhone) {
                        setSearchResults([{ ...response.data, isSelf: true }]);
                    } else if (acceptedFriends.includes(response.data._id)) {
                        // Nếu là bạn bè, tìm conversationId
                        const existingChat = chatList.find(chat =>
                            chat.type === 'private' && chat.id === response.data._id
                        );
                        setSearchResults([{ ...response.data, isFriend: true, conversationId: existingChat ? existingChat.conversationId : null }]);
                    } else {
                        setSearchResults([response.data]);
                    }
                } else {
                    setSearchResults([]);
                    setDialogMessage('Không tìm thấy người dùng với số điện thoại này.');
                    setDialogOpen(true);
                }
            } catch (error) {
                console.error('Lỗi khi tìm kiếm người dùng:', error);
                setSearchResults([]);
                setDialogMessage('Lỗi khi tìm kiếm người dùng. Vui lòng thử lại.');
                setDialogOpen(true);
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
                        setDialogMessage('Đã gửi lời mời kết bạn thành công!');
                        setDialogOpen(true);
                        setIsAddFriendModalOpen(false); 
                        fetchData(); // Tải lại danh sách chat và bạn bè
                        fetchAcceptedFriends(); 
                    }
                } catch (error) {
                    console.error('Lỗi gửi yêu cầu kết bạn:', error);
                    if (error.response && error.response.status === 400) {
                        setDialogMessage(error.response.data.message || 'Lời mời kết bạn đã được gửi hoặc đang chờ phản hồi.');
                    } else {
                        setDialogMessage('Không thể gửi lời mời kết bạn. Vui lòng thử lại.');
                    }
                    setDialogOpen(true);
                } finally {
                    // Đặt lại các trạng thái sau khi xử lý (thành công hoặc thất bại)
                    setIsSearching(false); 
                    setSearchKeyword('');
                    setSearchResults([]); 
                    setSelectedUserToAdd(null);
                }
            }
        };

         // Hàm mới để xử lý việc nhắn tin trực tiếp từ kết quả tìm kiếm
    const handleMessageFriend = (user) => {
        const existingChat = chatList.find(chat => 
            chat.type === 'private' && chat.id === user._id
        );

        if (existingChat) {
            handleChatClick(existingChat);
        } else {
            // Trường hợp này có thể xảy ra nếu người đó là bạn bè nhưng chưa có cuộc trò chuyện nào được khởi tạo.
            // Cần tạo một cuộc trò chuyện mới hoặc xử lý tùy theo logic backend của bạn.
            // Hiện tại, chúng ta sẽ giả định rằng nếu đã là bạn bè thì luôn có cuộc trò chuyện.
            // Nếu API backend của bạn không tự động tạo conversation khi kết bạn, bạn cần thêm logic tạo conversation ở đây.
            // Ví dụ:
            // const newChat = {
            //     id: user._id,
            //     name: user.username,
            //     avatar: user.avatarURL || '/static/images/avatar/default.jpg',
            //     lastMessage: '',
            //     time: '',
            //     type: 'private',
            //     conversationId: 'NEWLY_CREATED_CONVERSATION_ID_FROM_BACKEND'
            // };
            // setChatList(prev => [...prev, newChat]);
            // handleChatClick(newChat);
            setDialogMessage('Không tìm thấy cuộc trò chuyện. Vui lòng thử lại.');
            setDialogOpen(true);
            console.warn('Không tìm thấy cuộc trò chuyện hiện có cho người bạn này.');
        }
        setIsSearching(false); // Thoát khỏi chế độ tìm kiếm
        setSearchKeyword('');
        setSearchResults([]);
    };

    const handleDialogClose = () => {
        setDialogOpen(false); 
        setIsSearching(false); 
        setSearchKeyword('');
        setSearchResults([]); 
        setIsAddFriendModalOpen(false);
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
                                <ListItem key={user?._id} alignItems="center" secondaryAction={
                                    // Logic cho nút "Thêm bạn bè" / "Bạn" / "Đã gửi" / "Nhắn tin"
                                    user.isSelf ? (
                                        <Button variant="text" size="small" disabled>Bạn</Button>
                                    ) : user.isFriend ? (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            onClick={() => handleMessageFriend(user)} // Xử lý nhắn tin
                                        >
                                            Nhắn tin
                                        </Button>
                                    ) : friendRequestsSent.includes(user?._id) ? (
                                        <Button variant="outlined" size="small" disabled>Đã gửi</Button>
                                    ) : (
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            onClick={() => {
                                                setSelectedUserToAdd(user);
                                                setIsAddFriendModalOpen(true);
                                            }}
                                        >
                                            Thêm bạn bè
                                        </Button>
                                    )
                                }>
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
 <Badge
  badgeContent={chat.unreadCount}
  color="error"
  invisible={!chat.unreadCount || currentConversationId === chat.conversationId}
>
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
                        {chat.unreadCount > 0 && currentConversationId !== chat.conversationId && (
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
      
                  <Dialog
                      open={dialogOpen}
                      onClose={handleDialogClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                  >
                      <CustomMessageDialogContent>
                          <CustomMessageTypography id="alert-dialog-description">
                              {dialogMessage}
                          </CustomMessageTypography>
                          <Button onClick={handleDialogClose} autoFocus sx={{ mt: 2 }}>
                              Đóng
                          </Button>
                      </CustomMessageDialogContent>
                  </Dialog>
                  <ToastContainer />
    </Box>
    
  );
};


export default Chat;