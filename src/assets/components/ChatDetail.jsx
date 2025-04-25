import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Toolbar, IconButton, Typography, Avatar, TextField, Tooltip, Menu, MenuItem } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import axios from 'axios';
import { io } from 'socket.io-client';
import moment from 'moment';
import { Scrollbar } from 'react-scrollbars-custom';
import EmojiPicker from 'emoji-picker-react';

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
    backgroundColor: theme.palette.background.default,
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

const ChatDetail = ({ selectedChat, onBackToChatList }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [conversationId, setConversationId] = useState(null);
    const socket = useRef();
    const messagesEndRef = useRef(null);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    useEffect(() => {
        if (!socket.current) {
            socket.current = io('ws://localhost:5000'); 
            socket.current.emit('joinUserRoom', currentUser._id);
        }
    
        const handleReceive = (message) => {
            if (message.conversationId === conversationId) {
                setMessages((prev) => [...prev, message]);
            }
        };
    
        socket.current.on('receive_message', handleReceive);
    
        return () => {
            socket.current.off('receive_message', handleReceive);
        };
    }, [conversationId]);
    
    
      
    useEffect(() => {
        if (!selectedChat || !currentUser || !socket.current) return;
   
        // Đảm bảo chỉ gọi join_conversation khi cần thiết
        if (conversationId !== selectedChat.id) {
            socket.current.emit('join_conversation', {
                senderId: currentUser._id,
                rereceiveId: selectedChat.id,
            });
   
            setConversationId(selectedChat.id);  // Cập nhật conversationId để tránh gọi lại
        }
   
        const handleJoinRoom = ({ conversationId }) => {
            setConversationId(conversationId);
            fetchMessages(conversationId);
        };
   
        socket.current.on('joined_room', handleJoinRoom);
   
        return () => {
            socket.current.off('joined_room', handleJoinRoom);
        };
    }, [selectedChat, currentUser, conversationId]);
   
    


    const fetchMessages = async (convId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/message/${convId}`);
            setMessages(res.data.data);
        } catch (err) {
            console.error('Lỗi tải tin nhắn:', err.response || err.message || err);
        }
    };


    const handleEmojiClick = (emojiData) => {
        setNewMessage((prev) => prev + emojiData.emoji);
        setPickerOpen(false);
    };

    const handleSendMessage = () => {
        const content = newMessage.trim();
        if (!content || !conversationId) return;

        const tempMessage = {
            senderId: currentUser._id,
            content,
            messageType: 'text',
            createdAt: new Date(),
        };

        setMessages((prev) => [...prev, tempMessage]);
        setNewMessage('');

        socket.current.emit('sendMessage', {
            conversationId,
            senderId: currentUser._id,
            content,
            messageType: 'text',
        });
    };

    const handleSendFile = (file) => {
        const formData = new FormData();
        formData.append('file', file);  // Đảm bảo bạn gửi đúng tên 'file'
        const getMessageTypeFromFile = (file) => {
            const mime = file.type;
          
            if (mime.startsWith("image/")) return "image";
            if (mime.startsWith("video/")) return "video";
            if (mime.startsWith("audio/")) return "audio";
            return "file"; // fallback
          };
          const type = getMessageTypeFromFile(file);
        axios.post('http://localhost:5000/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',  // Đảm bảo gửi đúng header
            }
        })
        .then(response => {
            const fileUrl = response.data.fileUrl;  // Lấy URL của file từ response
            console.log('File uploaded successfully', fileUrl);
    
            // Kiểm tra fileUrl trước khi tiếp tục
            if (!fileUrl) {
                console.error('File URL không có giá trị!');
                return;
            }
    
            // Tạo tin nhắn với URL file
            const message = {
                senderId: currentUser._id,
                content: fileUrl,  // URL của file được lưu trong nội dung tin nhắn
                messageType: type,  // Bạn có thể xác định loại tin nhắn là file
                createdAt: new Date(),
            };
    
            setMessages((prev) => [...prev, message]);  // Thêm tin nhắn vào state
    
            // Gửi tin nhắn qua socket
            

socket.current.emit("sendMessage", {
  conversationId,
  senderId: currentUser._id,
  content: fileUrl,
  messageType: type,
});
        })
        .catch(error => {
            console.error('Error uploading file', error);
        });
    };
    
    

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            handleSendFile(selectedFile);
        }
    };

    const handleOpenMenu = (event, message) => {
        setAnchorEl(event.currentTarget);
        setSelectedMessage(message);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setSelectedMessage(null);
    };
    const handleRecall = (msgId) => {
        // Gửi sự kiện thu hồi tin nhắn tới server
        socket.current.emit('recall_message', { messageId: msgId, conversationId });
        
        // Cập nhật trạng thái thu hồi tin nhắn trong UI
        setMessages((prev) => prev.map(msg => msg._id === msgId ? { ...msg, isRevoked: true } : msg));
        handleCloseMenu();
    };
    

    const handleDelete = async (msgId) => {
        try {
            await axios.delete(`http://localhost:5000/api/message/delete-local/${msgId}`);
            setMessages((prev) => prev.filter((m) => m._id !== msgId));
        } catch (err) {
            console.error('Lỗi xóa:', err.response || err.message || err);
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        handleCloseMenu();
    };


    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!selectedChat) {
        return (
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f0f2f5', height: '100%' }}>
                <Typography variant="h6" color="textSecondary">
                    Chọn một cuộc trò chuyện để xem chi tiết
                </Typography>
            </Box>
        );
    }

    return (
            
            <ChatDetailContainer>
            <ChatDetailHeader>
                <HoverIconButton color="inherit" onClick={onBackToChatList}>
                    <ArrowBackIcon />
                </HoverIconButton>
                <Avatar src={selectedChat.avatar} sx={{ mr: 2 }} />
                <Typography variant="h6">{selectedChat.name}</Typography>
                <Box sx={{ flexGrow: 1 }} />
                {selectedChat.type === 'person' && (
                    <>
                        <HoverIconButton color="inherit"><CallIcon /></HoverIconButton>
                        <HoverIconButton color="inherit"><VideocamIcon /></HoverIconButton>
                        <HoverIconButton color="inherit"><PersonAddIcon /></HoverIconButton>
                    </>
                )}
                <HoverIconButton color="inherit">
                    <MoreVertIcon />
                </HoverIconButton>
            </ChatDetailHeader>
            <ChatDetailBody>
                <Scrollbar style={{ width: '100%', height: '100%' }}>
                {messages.map((msg, index) => {
    const isMine = msg.senderId?._id === currentUser._id || msg.senderId === currentUser._id;

    const renderMessageContent = (msg) => {
        if (msg.isRevoked) {
            return <Typography variant="body2" fontStyle="italic" color="text.secondary">Tin nhắn đã thu hồi</Typography>;
        }
    
        const fileName = msg.content?.split('/').pop();
    
        switch (msg.messageType) {
            case 'image':
                return (
                    <a href={msg.content} target="_blank" rel="noopener noreferrer">
                        <img src={msg.content} alt="image" style={{ maxWidth: '100%', borderRadius: 8 }} />
                    </a>
                );
            case 'video':
                return (
                    <video controls style={{ maxWidth: '100%' }}>
                        <source src={msg.content} type="video/mp4" />
                        Trình duyệt không hỗ trợ video.
                    </video>
                );
            case 'audio':
                return (
                    <audio controls>
                        <source src={msg.content} type="audio/mpeg" />
                        Trình duyệt không hỗ trợ audio.
                    </audio>
                );
            case 'file':
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ImageIcon sx={{ fontSize: 24 }} />
                        <Box>
                            <Typography variant="body2" noWrap>{fileName}</Typography>
                            <a href={msg.content} download style={{ fontSize: 12, color: '#1976d2' }}>
                                Tải xuống
                            </a>
                        </Box>
                    </Box>
                );
            default:
                return msg.content;
        }
    };
    

    return (
        <Box key={index} sx={{
            display: 'flex',
            flexDirection: isMine ? 'row-reverse' : 'row',
            alignItems: 'center',
            mb: 1,
        }}>
            {!isMine && <Avatar src={selectedChat.avatar} sx={{ mr: 1 }} />}
            <Tooltip title={moment(msg.createdAt || msg.timestamp).format('HH:mm DD/MM')} arrow>
                <Box sx={{
                    position: 'relative',
                    bgcolor: isMine ? 'primary.light' : 'grey.300',
                    color: 'black',
                    p: 1.5,
                    borderRadius: 2,
                    maxWidth: '70%',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    {renderMessageContent(msg)}
                    <IconButton
                        size="small"
                        onClick={(e) => handleOpenMenu(e, msg)}
                        sx={{
                            position: 'absolute',
                            left: isMine ? -30 : 'unset',
                            right: !isMine ? -30 : 'unset',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 1000,
                        }}
                    >
                        <MoreHorizIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Tooltip>
        </Box>
    );
})}


                    <div ref={messagesEndRef} />
                </Scrollbar>
            </ChatDetailBody>

            <ChatDetailInput>
            <HoverIconButton color="inherit">
    <label htmlFor="file-upload">
        <AttachFileIcon />
    </label>
    <input
        id="file-upload"
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileChange}
    />
</HoverIconButton>


                <StyledTextField
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    variant="outlined"
                    placeholder="Nhập tin nhắn..."
                    size="small"
                    multiline
                    minRows={1}
                />

                <HoverIconButton color="inherit" onClick={handleSendMessage}>
                    <SendIcon />
                </HoverIconButton>

                <HoverIconButton color="inherit" onClick={() => setPickerOpen(!pickerOpen)}>
                    <EmojiEmotionsIcon />
                </HoverIconButton>
            </ChatDetailInput>

            {pickerOpen && (
                <Box sx={{
                    position: 'absolute',
                    bottom: 90,
                    right: 30,
                    zIndex: 10,
                }}>
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                </Box>
            )}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                sx={{ position: 'absolute', left: '-80px', zIndex: 1000 }}
            >
                <MenuItem onClick={() => handleCopy(selectedMessage?.content)}>Sao chép</MenuItem>
                <MenuItem onClick={() => handleRecall(selectedMessage?._id)}>Thu hồi</MenuItem>
                <MenuItem onClick={() => handleDelete(selectedMessage?._id)}>Xóa</MenuItem>
            </Menu>
        </ChatDetailContainer>
    );
};

export default ChatDetail;
