import React from 'react';
import { styled } from '@mui/material/styles';
import {
    Box, Toolbar, IconButton, Typography, Avatar, TextField
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

const ChatDetail = ({ selectedChat, onBackToChatList }) => {
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
    );
};

export default ChatDetail;