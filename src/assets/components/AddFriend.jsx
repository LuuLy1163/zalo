import React from 'react';
import { styled } from '@mui/material/styles';
import { Modal, Box, Typography, Button } from '@mui/material';

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

const AddFriend = ({ open, onClose, onConfirm, user }) => {
    return (
        <AddFriendModal
            open={open}
            onClose={onClose}
            aria-labelledby="add-friend-modal-title"
            aria-describedby="add-friend-modal-description"
        >
            <AddFriendModalContent>
                <Typography id="add-friend-modal-title" variant="h6" component="h2">
                    Thêm bạn bè
                </Typography>
                {user && (
                    <Typography id="add-friend-modal-description" sx={{ mt: 2 }}>
                        Bạn có muốn gửi lời mời kết bạn đến <b>{user.username}</b> không?
                    </Typography>
                )}
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={onClose} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={onConfirm} color="primary" autoFocus sx={{ ml: 1 }}>
                        Gửi lời mời
                    </Button>
                </Box>
            </AddFriendModalContent>
        </AddFriendModal>
    );
};

export default AddFriend;