import React from 'react';
import { Box, IconButton, Typography, Tooltip } from '@mui/material';
import { Delete as DeleteIcon, ContentCopy as CopyIcon } from '@mui/icons-material';

const MessageBubble = ({ message, onMenuClick }) => {
    const { content, messageType, createdAt, senderId, isRevoked } = message;
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const renderContent = () => {
        switch (messageType) {
            case 'text':
                return <Typography variant="body1">{content}</Typography>;
            case 'image':
                return <img src={content} alt="message" style={{ maxWidth: '100%', borderRadius: '8px' }} />;
            case 'video':
                return <video controls style={{ maxWidth: '100%', borderRadius: '8px' }}><source src={content} type="video/mp4" /></video>;
            case 'audio':
                return <audio controls style={{ maxWidth: '100%' }}><source src={content} type="audio/mp3" /></audio>;
            case 'file':
                return <a href={content} target="_blank" rel="noopener noreferrer">Download File</a>;
            default:
                return <Typography variant="body1">Unsupported Message Type</Typography>;
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: senderId === currentUser._id ? 'row-reverse' : 'row',
                alignItems: 'center',
                marginBottom: 2,
                justifyContent: senderId === currentUser._id ? 'flex-end' : 'flex-start',
            }}
        >
            <Box
                sx={{
                    backgroundColor: senderId === currentUser._id ? '#DCF8C6' : '#FFFFFF',
                    borderRadius: 2,
                    padding: 1,
                    maxWidth: '80%',
                    boxShadow: 2,
                    position: 'relative',
                }}
            >
                {isRevoked ? (
                    <Typography variant="body2" color="textSecondary">
                        This message has been deleted
                    </Typography>
                ) : (
                    <>
                        {renderContent()}
                        <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
                            <Tooltip title="More Options">
                                <IconButton onClick={onMenuClick} size="small">
                                    <MoreHorizIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default MessageBubble;
