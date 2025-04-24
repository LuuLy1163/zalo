import React, { useState, useEffect } from "react";
import {
    Avatar, Box, InputBase, List, ListItem, ListItemAvatar, ListItemText,
    Typography, MenuItem, Select, FormControl, IconButton, Menu, Dialog,
    DialogTitle, DialogContent, DialogActions, Button, CircularProgress
} from "@mui/material";
import { Search, MoreVert } from "@mui/icons-material";
import Grid from '@mui/material/Grid';

const fetchFriendData = async (accessToken) => {
    try {
        const response = await fetch('http://localhost:5000/api/friend/friends', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bạn bè:", error);
        throw error;
    }
};

export default function FriendList() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterOption, setFilterOption] = useState('all');

    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        const loadFriendData = async () => {
            if (!accessToken) {
                setLoading(false);
                setError("Không có token.");
                return;
            }

            try {
                const data = await fetchFriendData(accessToken);
                setFriends(data.acceptedFriends);
                setLoading(false);
            } catch (err) {
                setError("Lỗi khi tải danh sách bạn bè.");
                setLoading(false);
                console.error("Lỗi fetchFriendData:", err);
            }
        };

        loadFriendData();
    }, [accessToken]);

    const handleMenuClick = (event, friend) => {
        setAnchorEl(event.currentTarget);
        setSelectedFriend(friend);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleViewInfo = () => {
        setOpenDialog(true);
        handleCloseMenu();
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleFilterChange = (event) => {
        setFilterOption(event.target.value);
    };

    const filteredFriends = friends.filter(friend => {
        const searchMatch = friend.username.toLowerCase().includes(searchQuery.toLowerCase());
        let filterMatch = true;

        if (filterOption === 'online') {
            // Giả sử bạn có thuộc tính 'isOnline' trong dữ liệu bạn bè
            filterMatch = friend.isOnline;
        } else if (filterOption === 'offline') {
            filterMatch = !friend.isOnline;
        }

        return searchMatch && filterMatch;
    });

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', padding: 3 }}>
            <Box sx={{ width: '100%', maxWidth: 600 }}>
                <Typography variant="h6" gutterBottom>
                    Bạn bè ({filteredFriends.length})
                </Typography>

                {/* Search + Filter */}
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", flex: 1, p: 1, border: "1px solid #ccc", borderRadius: 2 }}>
                        <Search sx={{ mr: 1 }} />
                        <InputBase
                            placeholder="Tìm bạn"
                            fullWidth
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </Box>
                    <FormControl size="small">
                        <Select defaultValue="az">
                            <MenuItem value="az">Tên (A-Z)</MenuItem>
                            <MenuItem value="za">Tên (Z-A)</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small">
                        <Select value={filterOption} onChange={handleFilterChange}>
                            <MenuItem value="all">Tất cả</MenuItem>
                            {/* Thêm các tùy chọn lọc khác nếu cần */}
                            {/* <MenuItem value="online">Đang hoạt động</MenuItem> */}
                            {/* <MenuItem value="offline">Không hoạt động</MenuItem> */}
                        </Select>
                    </FormControl>
                </Box>

                {/* Danh sách bạn */}
                <List>
                    {filteredFriends.map((friend, index) => (
                        <ListItem
                            key={friend._id}
                            divider
                            secondaryAction={
                                <IconButton onClick={(e) => handleMenuClick(e, friend)}>
                                    <MoreVert />
                                </IconButton>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar src={friend.avatarURL || "/static/images/avatar/default.jpg"} />
                            </ListItemAvatar>
                            <ListItemText primary={friend.username} secondary={friend.phoneNumber} />
                        </ListItem>
                    ))}
                </List>

                {/* Menu khi bấm vào More */}
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                    <MenuItem onClick={handleViewInfo}>Xem thông tin</MenuItem>
                    <MenuItem>Phân loại</MenuItem>
                    <MenuItem>Đặt tên gợi nhớ</MenuItem>
                    <MenuItem>Chặn người này</MenuItem>
                    <MenuItem sx={{ color: "red" }}>Xóa bạn</MenuItem>
                </Menu>

                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth={false} PaperProps={{
                    sx: {
                        width: 400,
                        borderRadius: 3,
                        overflow: "hidden",
                    }
                }}>
                    {selectedFriend && (
                        <Box sx={{ bgcolor: "#fff" }}>

                            {/* Ảnh bìa */}
                            <Box sx={{
                                height: 180,
                                backgroundImage: `url(https://source.unsplash.com/random)`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }} />

                            {/* Avatar + tên */}
                            <Box sx={{ px: 3, mt: -7 }}>
                                <Avatar
                                    src={selectedFriend.avatarURL || "/static/images/avatar/default.jpg"}
                                    sx={{
                                        width: 72,
                                        height: 72,
                                        border: "3px solid white",
                                    }}
                                />
                                <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
                                    <Typography variant="h6" fontWeight={600}>{selectedFriend.username}</Typography>
                                    <IconButton size="small">
                                        <span role="img" aria-label="edit">✏️</span>
                                    </IconButton>
                                </Box>
                            </Box>

                            {/* Nút hành động */}
                            <Box sx={{ px: 3, pt: 2, display: "flex", gap: 1 }}>
                                <Button variant="outlined" fullWidth size="small">Gọi điện</Button>
                                <Button variant="contained" fullWidth size="small">Nhắn tin</Button>
                            </Box>

                            <Box sx={{ px: 3, py: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="body4" fontWeight="bold" gutterBottom>Thông tin cá nhân</Typography>
                                    </Grid>
                                    {/* Bio */}
                                    <Grid item xs={4}>
                                        <Typography variant="body2" color="grey"><b>Bio:</b></Typography>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Typography variant="body2" color="text.primary">{selectedFriend.bio || "Chưa có thông tin"}</Typography>
                                    </Grid>

                                    {/* Giới tính */}
                                    <Grid item xs={4}>
                                        <Typography variant="body2" color="grey"><b>Giới tính:</b></Typography>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Typography variant="body2" color="text.primary">{selectedFriend.gender || "Chưa có thông tin"}</Typography>
                                    </Grid>

                                    {/* Ngày sinh */}
                                    <Grid item xs={4}>
                                        <Typography variant="body2" color="grey"><b>Ngày sinh:</b></Typography>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Typography variant="body2" color="text.primary">{selectedFriend.dob || "Chưa có thông tin"}</Typography>
                                    </Grid>

                                    {/* Điện thoại */}
                                    <Grid item xs={4}>
                                        <Typography variant="body2" color="grey"><b>Điện thoại:</b></Typography>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Typography variant="body2" color="text.primary">{selectedFriend.phoneNumber}</Typography>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Box sx={{ px: 3, pb: 2 }}>
                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Hình ảnh</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>Chưa có ảnh nào được chia sẻ</Typography>

                                <Box sx={{ mt: 2 }}>
                                    {/* Nhóm chung Button */}
                                    <Button
                                        variant="text"
                                        fullWidth
                                        size="medium"
                                        sx={{
                                            textTransform: 'none',
                                            justifyContent: 'flex-start',
                                            color: 'text.secondary',
                                            fontWeight: 'normal',
                                        }}
                                    >
                                        Nhóm chung (0) {/* Cập nhật số lượng nhóm chung nếu có */}
                                    </Button>

                                    {/* Chia sẻ danh thiếp Button */}
                                    <Button
                                        variant="text"
                                        fullWidth
                                        size="medium"
                                        sx={{
                                            textTransform: 'none',
                                            justifyContent: 'flex-start',
                                            color: 'text.secondary',
                                            fontWeight: 'normal',
                                        }}
                                    >
                                        Chia sẻ danh thiếp
                                    </Button>
                                </Box>
                            </Box>

                            <Box sx={{ px: 3, py: 2, textAlign: "right" }}>
                                <Button onClick={handleCloseDialog} size="small">Đóng</Button>
                            </Box>
                        </Box>
                    )}
                </Dialog>
            </Box>
        </Box>
    );
}