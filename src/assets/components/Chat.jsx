import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
    Box, AppBar, Toolbar, IconButton, Typography, List, ListItem, ListItemButton, ListItemIcon,
    ListItemText, Avatar, TextField, InputAdornment, Tabs, Tab, MenuItem, Modal, Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';
import { blue } from '@mui/material/colors';
import { Scrollbar } from 'react-scrollbars-custom';
import axios from 'axios';

const initialChatList = [
    { id: 1, name: 'Quang Hùng', lastMessage: 'Xin chào bạn', time: '10 phút', type: 'person', avatar: '/assets/images/User-avatar.svg.png'}
];

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

  const ChatDetailContainer = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  }));

  const ChatDetailHeader = styled(Toolbar)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: 'none',
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    alignItems: 'center',
  }));

  const ChatDetailBody = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(2),
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
  }));

  const ChatDetailInput = styled(Toolbar)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
  }));

  const StyledTextField = styled(TextField)(({ theme }) => ({
    flexGrow: 1,
    marginRight: theme.spacing(1),
    '& .MuiOutlinedInput-root': {
      borderRadius: '20px',
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
    },
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

  const HoverMenuItem = styled(MenuItem)(({ theme }) => ({
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
  }));

  const AddFriendModal = styled(Modal)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const AddFriendModalContent = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: theme.shape.borderRadius,
    textAlign: 'center',
    color: theme.palette.text.primary,
  }));

const Chat = () => {
    const [searchText, setSearchText] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const [selectedChat, setSelectedChat] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
    const [selectedUserToAdd, setSelectedUserToAdd] = useState(null);
    const [friendRequestsSent, setFriendRequestsSent] = useState([]);
    const [chatList, setChatList] = useState(initialChatList);

    const currentUserPhone = 'YOUR_PHONE_NUMBER'; 

    const handleChatClick = (chat) => {
        setSelectedChat(chat);
    };

    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleBackToChatList = () => {
        setSelectedChat(null);
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
                const data = response.data;
                setSearchResults([data]);
            } else if (response.status === 404) {
                console.log('Không tìm thấy người dùng');
                setSearchResults([]);
            } else {
                console.error('Lỗi tìm kiếm người dùng:', response.status, response.data);
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Lỗi tìm kiếm người dùng (catch):', error);
            if (error.response) {
                console.error('Chi tiết lỗi từ server:', error.response.status, error.response.data);
            }
            setSearchResults([]);
        } finally {
            console.log('Kết thúc quá trình tìm kiếm');
        }
    };

    const handleCloseSearch = () => {
        setIsSearching(false);
        setSearchKeyword('');
        setSearchResults([]);
    };

    const handleOpenAddFriendModal = (user) => {
        setSelectedUserToAdd(user);
        setIsAddFriendModalOpen(true);
    };

    const handleCloseAddFriendModal = () => {
        setIsAddFriendModalOpen(false);
        setSelectedUserToAdd(null);
    };

    const handleAddFriend = async () => {
        if (selectedUserToAdd) {
            console.log('Gửi yêu cầu kết bạn đến:', selectedUserToAdd.phoneNumber);
            try {
                const response = await fetch('http://localhost:5000/api/friends/request', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        senderPhone: currentUserPhone,
                        receiverPhone: selectedUserToAdd.phoneNumber,
                    }),
                });
                console.log('Response từ API gửi yêu cầu kết bạn:', response);

                if (response.ok) {
                    setFriendRequestsSent(prev => [...prev, selectedUserToAdd._id]);
                    handleCloseAddFriendModal();
                    setChatList(prev => {
                        const alreadyInChat = prev.some(chat => chat.id === selectedUserToAdd._id);
                        if (alreadyInChat) {
                            return prev;
                        }
                        return [
                            ...prev,
                            {
                                id: selectedUserToAdd._id,
                                name: selectedUserToAdd.username,
                                avatar: selectedUserToAdd.avatarURL || '/static/images/avatar/default.jpg',
                                lastMessage: 'Đã gửi lời mời kết bạn',
                                time: 'Vài giây trước',
                                type: 'person',
                            }
                        ];
                    });
                    console.log('Gửi yêu cầu kết bạn thành công');
                } else {
                    try {
                        const errorData = await response.json();
                        console.error('Lỗi gửi yêu cầu kết bạn:', errorData);
                    } catch (error) {
                        console.error('Lỗi gửi yêu cầu kết bạn (không parse được JSON lỗi):', response.status, response.statusText);
                    }
                }
            } catch (error) {
                console.error('Lỗi gửi yêu cầu kết bạn (catch):', error);
            }
        }
    };

    const checkIfFriendRequestSent = (userId) => {
        return friendRequestsSent.includes(userId);
    };

    const filteredChats = chatList.filter((chat) =>
        chat.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <Box sx={{ display: 'flex', height: '100%' }}>
            {/* Chat List Sidebar */}
            <ChatListContainer>
                <ChatListHeader position="static">
                    <Toolbar>
                        <Tabs value={tabValue} onChange={handleTabChange} aria-label="chat tabs" sx={{ flexGrow: 1 }}>
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
                            <HoverIconButton onClick={handleCloseSearch} sx={{ ml: 1 }}>
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
                                        onClick={() => handleOpenAddFriendModal(user)}
                                        disabled={checkIfFriendRequestSent(user._id) || user.phoneNumber === currentUserPhone}
                                    >
                                        {user.phoneNumber === currentUserPhone
                                            ? 'Bạn'
                                            : checkIfFriendRequestSent(user._id)
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
                        {filteredChats.map((chat) => (
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
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
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

            {/* Chat Detail Area (Right Side) */}
            {selectedChat ? (
                <ChatDetailContainer>
                    <ChatDetailHeader>
                        <HoverIconButton color="inherit" onClick={handleBackToChatList}>
                            <ArrowBackIcon />
                        </HoverIconButton>
                        <Avatar src={selectedChat.avatar} sx={{ mr: 2 }} />
                        <Typography variant="h6">{selectedChat.name}</Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        {selectedChat.type === 'person' && (
                            <React.Fragment>
                                <HoverIconButton color="inherit">
                                    <CallIcon />
                                </HoverIconButton>
                                <HoverIconButton color="inherit">
                                    <VideocamIcon />
                                </HoverIconButton>
                                <HoverIconButton color="inherit">
                                    <PersonAddIcon />
                                </HoverIconButton>
                            </React.Fragment>
                        )}
                        <HoverIconButton color="inherit">
                            <MoreVertIcon />
                        </HoverIconButton>
                    </ChatDetailHeader>
                    <ChatDetailBody>
                        {selectedChat.isCurrentUser ? (
                            <Typography variant="subtitle1" color="textSecondary">
                                Đây là giao diện khi bạn chọn chính mình (hoặc một liên hệ chưa có tin nhắn cụ thể).
                                Trong ứng dụng thực tế, bạn sẽ hiển thị lịch sử tin nhắn ở đây.
                            </Typography>
                        ) : (
                            <Typography variant="subtitle1" color="textSecondary">
                                Trong ứng dụng thực tế, bạn sẽ hiển thị lịch sử tin nhắn ở đây.
                            </Typography>
                        )}
                        {/* In a real application, messages would be rendered here */}
                    </ChatDetailBody>
                    <ChatDetailInput>
                        <HoverIconButton color="inherit">
                            <AttachFileIcon />
                        </HoverIconButton>
                        <HoverIconButton color="inherit">
                            <EmojiEmotionsIcon />
                        </HoverIconButton>
                        <HoverIconButton color="inherit">
                            <ImageIcon />
                        </HoverIconButton>
                        <StyledTextField
                            variant="outlined"
                            size="small"
                            placeholder={`Nhập tin nhắn gửi ${selectedChat.name}`}
                        />
                        <HoverIconButton color="primary">
                            <SendIcon />
                        </HoverIconButton>
                    </ChatDetailInput>
                </ChatDetailContainer>
            ) : (
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f0f2f5', height: '100%' }}>
                    <Typography variant="h6" color="textSecondary">
                        Chọn một cuộc trò chuyện để xem chi tiết
                    </Typography>
                </Box>
            )}

            {/* Add Friend Confirmation Modal */}
            <AddFriendModal
                open={isAddFriendModalOpen}
                onClose={handleCloseAddFriendModal}
                aria-labelledby="add-friend-modal-title"
                aria-describedby="add-friend-modal-description"
            >
                <AddFriendModalContent>
                    <Typography id="add-friend-modal-title" variant="h6" component="h2">
                        Thêm bạn bè
                    </Typography>
                    {selectedUserToAdd && (<Typography id="add-friend-modal-description" sx={{ mt: 2 }}>
                        Bạn có muốn gửi lời mời kết bạn đến <b>{selectedUserToAdd.username}</b> không?
                    </Typography>
                    )}
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={handleCloseAddFriendModal} color="primary">
                            Hủy
                        </Button>
                        <Button onClick={handleAddFriend} color="primary" autoFocus sx={{ ml: 1 }}>
                            Gửi lời mời
                        </Button>
                    </Box>
                </AddFriendModalContent>
            </AddFriendModal>
        </Box>
    );
};

export default Chat;