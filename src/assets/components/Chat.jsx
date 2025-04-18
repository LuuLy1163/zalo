import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box, AppBar, Toolbar, IconButton, Typography, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Avatar, TextField,
  InputAdornment, Tabs, Tab, Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddFriend from './AddFriend';
import { Scrollbar } from 'react-scrollbars-custom';
import axios from 'axios';
import ChatDetail from './ChatDetail';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const ChatListContainer = styled(Box)(({ theme }) => ({
  width: 350,
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));

const ChatListHeader = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
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

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserPhone = currentUser?.phoneNumber || '';

  useEffect(() => {
    if (currentUser && currentUser._id) {
      socket.emit('joinUserRoom', currentUser._id); // ✅ Join room của user
    }

    // Fetch data khi component mount
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:5000/api/conversation/conversation', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const data = response.data.data || [];
        const oneToOneChats = data.filter(convo => convo.members.length === 2);

        const chatListFormatted = oneToOneChats.map(convo => {
          const otherUser = convo.members.find(m => m._id !== currentUser._id);
          return {
            id: otherUser._id,
            name: otherUser.username,
            avatar: otherUser.avatarURL || '/static/images/avatar/default.jpg',
            lastMessage: convo.lastMessage?.text || '',
            time: new Date(convo.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'person',
            phoneNumber: otherUser.phoneNumber,
          };
        });

        // Cập nhật chatList nếu dữ liệu có thay đổi
        setChatList(prevChatList => {
          if (JSON.stringify(prevChatList) !== JSON.stringify(chatListFormatted)) {
            return chatListFormatted;
          }
          return prevChatList;
        });
      } catch (error) {
        console.error('Lỗi khi lấy danh sách hội thoại:', error);
      }
    };

    fetchData();

    socket.on('updateFriendsList', (updatedFriendsList) => {
      console.log('Cập nhật danh sách bạn bè mới:', updatedFriendsList);
      setChatList(updatedFriendsList);
    });

    // Cleanup socket khi component unmount
    return () => {
      socket.off('updateFriendsList');
    };
  }, []); // Chạy một lần khi component mount

  useEffect(() => {
    if (chatList.length) {
      localStorage.setItem('chatList', JSON.stringify(chatList));
    }
  }, [chatList]); // Lưu chatList vào localStorage khi có sự thay đổi

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
  };

  const handleSearchInputChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handleStartSearch = async () => {
    setIsSearching(true);
    setSearchResults([]);
    try {
      const response = await axios.get(`http://localhost:5000/api/auth/searchphone?phoneNumber=${searchKeyword}`);
      if (response.status === 200) {
        setSearchResults([response.data]);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      setSearchResults([]);
    }
  };

  const handleAddFriend = async () => {
    if (selectedUserToAdd) {
      try {
        const response = await axios.post('http://localhost:5000/api/friend/request', {
          senderPhone: currentUserPhone,
          receiverPhone: selectedUserToAdd.phoneNumber,
        });

        if (response.status === 200) {
          const newUserChat = {
            id: selectedUserToAdd._id,
            name: selectedUserToAdd.username,
            avatar: selectedUserToAdd.avatarURL || '/static/images/avatar/default.jpg',
            lastMessage: 'Đã gửi lời mời kết bạn',
            time: 'Vài giây trước',
            type: 'person',
            phoneNumber: selectedUserToAdd.phoneNumber
          };

          setChatList(prev => [newUserChat, ...prev]);
          setSelectedChat(newUserChat);

          socket.emit('update_friends', { userId: currentUser._id }); // ✅ Gửi sự kiện cập nhật bạn bè realtime
        }
      } catch (error) {
        console.error('Lỗi gửi yêu cầu kết bạn:', error);
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <ChatListContainer>
        <ChatListHeader position="static">
          <Toolbar>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} aria-label="chat tabs" sx={{ flexGrow: 1 }}>
              <HoverTab label="Tất cả" />
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
            <HoverIconButton onClick={handleStartSearch} sx={{ ml: 1 }}>
              <PersonAddIcon />
            </HoverIconButton>
            {isSearching && (
              <HoverIconButton onClick={() => { setIsSearching(false); setSearchKeyword(''); setSearchResults([]); }} sx={{ ml: 1 }}>
                <CloseIcon />
              </HoverIconButton>
            )}
          </Box>

          {isSearching && searchResults.length > 0 && (
            <List>
              {searchResults.map((user) => (
                <ListItem key={user._id} alignItems="center" secondaryAction={
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => {
                      setSelectedUserToAdd(user);
                      setIsAddFriendModalOpen(true);
                    }}
                    disabled={friendRequestsSent.includes(user._id) || user.phoneNumber === currentUserPhone}
                  >
                    {user.phoneNumber === currentUserPhone
                      ? 'Bạn'
                      : friendRequestsSent.includes(user._id)
                        ? 'Đã gửi'
                        : 'Thêm bạn bè'}
                  </Button>
                }>
                  <ListItemIcon>
                    <Avatar src={user.avatarURL || '/static/images/avatar/default.jpg'} />
                  </ListItemIcon>
                  <ListItemText primary={user.username} secondary={user.phoneNumber} />
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
            {chatList.filter(chat => chat.name.toLowerCase().includes(searchText.toLowerCase())).map((chat) => (
              <HoverListItemButton
                key={chat.id}
                selected={selectedChat?.id === chat.id}
                onClick={() => handleChatClick(chat)}
                alignItems="flex-start"
              >
                <ListItemIcon>
                  <Avatar src={chat.avatar} />
                </ListItemIcon>
                <ListItemText
                  primary={chat.name}
                  secondary={
                    <React.Fragment>
                      <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                        {chat.lastMessage}
                      </Typography>
                      {` — ${chat.time}`}
                    </React.Fragment>
                  }
                />
              </HoverListItemButton>
            ))}
          </Scrollbar>
        </ChatListContent>
      </ChatListContainer>

      <ChatDetail selectedChat={selectedChat} onBackToChatList={() => setSelectedChat(null)} />

      <AddFriend
        open={isAddFriendModalOpen}
        onClose={() => setIsAddFriendModalOpen(false)}
        onConfirm={handleAddFriend}
        user={selectedUserToAdd}
      />
    </Box>
  );
};

export default Chat;
