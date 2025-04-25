import React, { useState, useEffect } from 'react';
import {
    Box, Typography, TextField, List, ListItem, ListItemIcon,
    ListItemText, Avatar, Checkbox, Button, Modal, IconButton,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import axios from 'axios';

const CreateGroupModal = ({ open, onClose, onCreateGroupSuccess, socket }) => {
    const [groupName, setGroupName] = useState('');
    const [groupMembers, setGroupMembers] = useState([]);
    const [availableFriends, setAvailableFriends] = useState([]);
    const [groupImage, setGroupImage] = useState(null);
    const [groupImagePreview, setGroupImagePreview] = useState('');
    const currentUserId = JSON.parse(localStorage.getItem("user"))?._id;
    const [isCreating, setIsCreating] = useState(false); // Thêm dòng này
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await axios.get('http://localhost:5000/api/friend/friends', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.status === 200) {
                    setAvailableFriends(response.data.acceptedFriends);
                } else {
                    console.error('Lỗi khi tải danh sách bạn bè:', response);
                }
            } catch (error) {
                console.error('Lỗi khi tải danh sách bạn bè:', error);
            }
        };

        if (open) {
            fetchFriends();
        } else {
            setGroupName('');
            setGroupMembers([]);
            setAvailableFriends([]);
            setGroupImage(null);
            setGroupImagePreview('');
        }
    }, [open]);

    const handleGroupNameChange = (event) => {
        setGroupName(event.target.value);
    };

    const handleToggleGroupMember = (userId) => {
        if (groupMembers.includes(userId)) {
            setGroupMembers(groupMembers.filter(id => id !== userId));
        } else {
            setGroupMembers([...groupMembers, userId]);
        }
    };

    const handleGroupImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setGroupImage({ uri: URL.createObjectURL(file), file }); // Cập nhật để lưu cả uri và file
            setGroupImagePreview(URL.createObjectURL(file));
        } else {
            setGroupImage(null);
            setGroupImagePreview('');
        }
    };

    const handleCreateGroup = async () => {
        if (isCreating) return;

        if (!groupName.trim()) {
            console.error('Tên nhóm không được để trống.');
            return;
        }
        if (groupMembers.length < 1) {
            console.error('Cần chọn ít nhất một thành viên cho nhóm.');
            return;
        }

        setIsCreating(true);
        let imageGroupUrl = null;

        try {
            if (groupImage && groupImage.file) {
                const fileType = groupImage.file.type.split('/')[1];
                const formData = new FormData();
                formData.append("avatarURL", groupImage.file, `group_avatar.${fileType}`);

                const uploadResponse = await axios.post(
                    "http://localhost:5000/api/message/uploadimage",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                if (uploadResponse.data.success) {
                    imageGroupUrl = uploadResponse.data.data;
                } else {
                    console.error("Lỗi tải ảnh lên:", uploadResponse.data);
                    setIsCreating(false);
                    return;
                }
            }

            socket.emit("create_group", {
                creatorId: currentUserId,
                name: groupName.trim(),
                imageGroup: imageGroupUrl,
                members: groupMembers,
            });

            alert("Tạo nhóm thành công");
            onClose();
            onCreateGroupSuccess();
            setGroupName('');
            setGroupMembers([]);
            setGroupImage(null);
            setGroupImagePreview('');

        } catch (error) {
            setIsCreating(false);
            console.error('Lỗi tạo nhóm:', error);
        } finally {
            setIsCreating(false);
        }
    };

    const styledModal = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        backgroundColor: (theme) => theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: (theme) => theme.shadows[5],
        padding: (theme) => theme.spacing(2, 4, 3),
    };

    const imagePreviewStyle = {
        width: 36,
        height: 36,
        borderRadius: '50%',
        objectFit: 'cover',
        marginRight: 8,
        backgroundColor: '#f0f0f0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

    const uploadButtonStyle = {};

    const hiddenInput = {
        display: 'none',
    };

    const inputContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 8,
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={styledModal}>
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 1 }}>
                    Tạo nhóm mới
                </Typography>

                <Box sx={{ mb: 1 }}>
                    <Box sx={inputContainerStyle}>
                        <IconButton color="primary" aria-label="upload picture" component="label" sx={uploadButtonStyle}>
                            {groupImagePreview ? (
                                <Avatar src={groupImagePreview} sx={imagePreviewStyle} />
                            ) : (
                                <Avatar sx={imagePreviewStyle}>
                                    <PhotoCamera sx={{ fontSize: 20 }} />
                                </Avatar>
                            )}
                            <input hidden accept="image/*" type="file" onChange={handleGroupImageChange} />
                        </IconButton>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Nhập tên nhóm..."
                            type="text"
                            fullWidth
                            value={groupName}
                            onChange={handleGroupNameChange}
                            variant="outlined"
                            size="small"
                            inputProps={{ style: { fontSize: '0.9rem', padding: '8px 12px' } }}
                            InputLabelProps={{ style: { fontSize: '0.9rem' } }}
                        />
                    </Box>
                </Box>

                <Typography sx={{ mt: 1, mb: 0.5, fontSize: '0.95rem' }}>Chọn thành viên:</Typography>
                <List sx={{ maxHeight: 250, overflow: 'auto', mb: 1, padding: 0 }}>
                    {availableFriends.map((friend) => (
                        <ListItem key={friend._id} sx={{ paddingY: 0.3 }}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                                <Avatar src={friend.avatarURL || '/static/images/avatar/default.jpg'} sx={{ width: 28, height: 28 }} />
                            </ListItemIcon>
                            <ListItemText
                                primaryTypographyProps={{ fontSize: '0.85rem' }}
                                secondaryTypographyProps={{ fontSize: '0.75rem' }}
                                primary={friend.username}
                                secondary={friend.phoneNumber}
                                sx={{ ml: 2 }}
                            />
                            <Checkbox
                                checked={groupMembers.includes(friend._id)}
                                onChange={(event) => handleToggleGroupMember(friend._id)}
                                size="small"
                            />
                        </ListItem>
                    ))}
                </List>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={onClose} size="small">Hủy</Button>
                    <Button variant="contained" onClick={handleCreateGroup} sx={{ ml: 1 }} size="small">
                        Tạo nhóm
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default CreateGroupModal;