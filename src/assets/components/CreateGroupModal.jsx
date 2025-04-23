import React, { useState, useEffect } from 'react';
import {
    Box, Typography, TextField, List, ListItem, ListItemIcon,
    ListItemText, Avatar, Checkbox, Button, Modal, IconButton,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import axios from 'axios';

const CreateGroupModal = ({ open, onClose, onCreateGroupSuccess }) => {
    const [groupName, setGroupName] = useState('');
    const [groupMembers, setGroupMembers] = useState([]);
    const [availableFriends, setAvailableFriends] = useState([]);
    const [groupImage, setGroupImage] = useState(null);
    const [groupImagePreview, setGroupImagePreview] = useState('');
    const currentUserId = JSON.parse(localStorage.getItem("user"))?._id;

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
            setGroupImage(file);
            setGroupImagePreview(URL.createObjectURL(file));
        } else {
            setGroupImage(null);
            setGroupImagePreview('');
        }
    };

    const handleCreateGroup = async () => {
        console.log('Bắt đầu hàm handleCreateGroup');

        if (!groupName.trim()) {
            console.error('Tên nhóm không được để trống.');
            return;
        }
        if (groupMembers.length < 1) {
            console.error('Cần chọn ít nhất một thành viên cho nhóm.');
            return;
        }

        try {
            const token = localStorage.getItem("accessToken");
            const membersArray = groupMembers.map(memberId => ({
                userId: memberId,
                role: 'member',
                joinedAt: new Date()
            }));

            membersArray.push({
                userId: currentUserId,
                role: 'admin',
                joinedAt: new Date()
            });

            const response = await axios.post('http://localhost:5000/api/conversation/conversation', {
                name: groupName,
                type: 'group',
                members: membersArray,
                imageGroup: 'default_group_image_url'
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response từ backend:', response);

            if (response.status === 201) {
                console.log('Tạo nhóm thành công:', response.data);
                onClose();
                onCreateGroupSuccess();
                setGroupName('');
                setGroupMembers([]);
                setGroupImage(null);
                setGroupImagePreview('');
            } else {
                console.error('Lỗi tạo nhóm:', response);
            }
        } catch (error) {
            console.error('Lỗi tạo nhóm (catch block):', error);
        } finally {
            console.log('Kết thúc hàm handleCreateGroup');
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
        width: 36, // Giảm kích thước avatar chọn ảnh
        height: 36, // Giảm kích thước avatar chọn ảnh
        borderRadius: '50%',
        objectFit: 'cover',
        marginRight: 8, // Giảm marginRight
        backgroundColor: '#f0f0f0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

    const uploadButtonStyle = {
        // Các style khác nếu cần
    };

    const hiddenInput = {
        display: 'none',
    };

    const inputContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 8, // Giảm margin dưới
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={styledModal}>
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 1 }}> {/* Giảm margin dưới */}
                    Tạo nhóm mới
                </Typography>

                <Box sx={{ mb: 1 }}> {/* Giảm margin dưới của container chứa ảnh và tên */}
                    <Box sx={inputContainerStyle}>
                        <IconButton color="primary" aria-label="upload picture" component="label" sx={uploadButtonStyle}>
                            {groupImagePreview ? (
                                <Avatar src={groupImagePreview} sx={imagePreviewStyle} />
                            ) : (
                                <Avatar sx={imagePreviewStyle}>
                                    <PhotoCamera sx={{ fontSize: 20 }} /> {/* Giảm kích thước icon camera */}
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
                            inputProps={{ style: { fontSize: '0.9rem', padding: '8px 12px' } }} // Giảm padding và font chữ input
                            InputLabelProps={{ style: { fontSize: '0.9rem' } }} // Giảm font chữ label
                        />
                    </Box>
                </Box>

                <Typography sx={{ mt: 1, mb: 0.5, fontSize: '0.95rem' }}>Chọn thành viên:</Typography> {/* Giảm margin và font chữ */}
                <List sx={{ maxHeight: 250, overflow: 'auto', mb: 1, padding: 0 }}> {/* Giảm maxHeight và margin */}
                    {availableFriends.map((friend) => (
                        <ListItem key={friend._id} sx={{ paddingY: 0.3 }}> {/* Giảm padding dọc */}
                            <ListItemIcon sx={{ minWidth: 30 }}> {/* Giảm minWidth */}
                                <Avatar src={friend.avatarURL || '/static/images/avatar/default.jpg'} sx={{ width: 28, height: 28 }} /> {/* Giảm kích thước avatar */}
                            </ListItemIcon>
                            <ListItemText
                                primaryTypographyProps={{ fontSize: '0.85rem' }} // Giảm kích thước font chữ primary
                                secondaryTypographyProps={{ fontSize: '0.75rem' }} // Giảm kích thước font chữ secondary
                                primary={friend.username}
                                secondary={friend.phoneNumber}
                                sx={{ ml: 2 }} // Giảm margin trái
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
                    <Button onClick={onClose} size="small">Hủy</Button> {/* Sử dụng size="small" cho button */}
                    <Button variant="contained" onClick={handleCreateGroup} sx={{ ml: 1 }} size="small"> {/* Sử dụng size="small" cho button */}
                        Tạo nhóm
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default CreateGroupModal;