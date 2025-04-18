import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import {
    Box, Toolbar, IconButton, Typography, Avatar, TextField, Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { io } from 'socket.io-client';
import moment from 'moment';

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

    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!selectedChat || !currentUser) return;

        socket.current = io('http://localhost:5000');

        // Tham gia cuộc trò chuyện
        socket.current.emit('join_conversation', {
            senderId: currentUser._id,
            rereceiveId: selectedChat.id, // đúng với BE
        });
        

        socket.current.on('joined_room', ({ conversationId }) => {
            setConversationId(conversationId);
            fetchMessages(conversationId);
        });

        socket.current.on('receive_message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        socket.current.on('message_sent', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        socket.current.on('conversation_updated', (data) => {
            // Optional: cập nhật UI conversation nếu cần
            console.log('Conversation updated:', data);
        });

        return () => {
            socket.current.disconnect();
        };
    }, [selectedChat]);

    const fetchMessages = async (convId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/message/${convId}`);
            setMessages(res.data.data);
        } catch (err) {
            console.error('Lỗi tải tin nhắn:', err);
        }
    };

    const handleSendMessage = () => {
        const content = newMessage.trim();
        if (!content || !conversationId) return;

        const messageData = {
            conversationId,
            senderId: currentUser._id,
            content,
            messageType: 'text',
        };

        socket.current.emit('sendMessage', messageData);
        setNewMessage('');
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
                {messages.map((msg, index) => {
                    const isMine = msg.senderId?._id === currentUser._id || msg.senderId === currentUser._id;
                    return (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                flexDirection: isMine ? 'row-reverse' : 'row',
                                alignItems: 'center',
                                mb: 1,
                            }}
                        >
                            {!isMine && <Avatar src={selectedChat.avatar} sx={{ mr: 1 }} />}
                            <Tooltip title={moment(msg.createdAt || msg.timestamp).format('HH:mm DD/MM')} arrow>
                                <Box
                                    sx={{
                                        bgcolor: isMine ? 'primary.light' : 'grey.300',
                                        color: 'black',
                                        p: 1.5,
                                        borderRadius: 2,
                                        maxWidth: '70%',
                                    }}
                                >
                                    {msg.content}
                                </Box>
                            </Tooltip>
                        </Box>
                    );
                })}
                <div ref={messagesEndRef} />
            </ChatDetailBody>

            <ChatDetailInput>
                <HoverIconButton color="inherit"><AttachFileIcon /></HoverIconButton>
                <HoverIconButton color="inherit"><EmojiEmotionsIcon /></HoverIconButton>
                <HoverIconButton color="inherit"><ImageIcon /></HoverIconButton>
                <StyledTextField
                    variant="outlined"
                    size="small"
                    placeholder={`Nhập tin nhắn gửi ${selectedChat.name}`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <HoverIconButton color="primary" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <SendIcon />
                </HoverIconButton>
            </ChatDetailInput>
        </ChatDetailContainer>
    );
};

export default ChatDetail;
