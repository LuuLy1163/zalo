import React, { useState, useEffect } from "react";
import {
    Avatar, Box, InputBase, List, ListItem, ListItemAvatar, ListItemText,
    Typography, MenuItem, Select, FormControl, IconButton, Menu, Dialog,
    Button, CircularProgress
} from "@mui/material";
import { Search, MoreVert } from "@mui/icons-material";

const fetchGroupList = async (authToken) => {
    try {
        // Giả định API trả về cấu trúc tương tự danh sách bạn bè
        const response = await fetch('http://localhost:5000/api/conversation/conversation', {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.data.filter(convo => convo.type === 'group').map(group => ({
            _id: group._id,
            name: group.name,
            avatarURL: group.imageGroup || "/static/images/avatar/default_group.png",
            memberCount: group.members ? group.members.length : 0,
            lastActive: group.updatedAt, // Sử dụng updatedAt làm thời gian hoạt động cuối
        }));
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu nhóm:", error);
        throw error;
    }
};

export default function GroupList() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('default');

    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        const loadGroupData = async () => {
            if (!accessToken) {
                setLoading(false);
                setError("Không có token.");
                return;
            }

            try {
                const data = await fetchGroupList(accessToken);
                setGroups(data);
                setLoading(false);
            } catch (err) {
                setError("Lỗi khi tải danh sách nhóm.");
                setLoading(false);
                console.error("Lỗi fetchGroupData:", err);
            }
        };

        loadGroupData();
    }, [accessToken]);

    const handleMenuClick = (event, group) => {
        setAnchorEl(event.currentTarget);
        setSelectedGroup(group);
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

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedGroups = [...filteredGroups].sort((a, b) => {
        if (sortBy === 'name_asc') {
            return a.name.localeCompare(b.name);
        } else if (sortBy === 'name_desc') {
            return b.name.localeCompare(a.name);
        }
        return 0; 
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
                    Nhóm ({sortedGroups.length})
                </Typography>

                <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", flex: 1, p: 1, border: "1px solid #ccc", borderRadius: 2 }}>
                        <Search sx={{ mr: 1 }} />
                        <InputBase placeholder="Tìm nhóm" fullWidth value={searchQuery} onChange={handleSearchChange} />
                    </Box>
                    <FormControl size="small">
                        <Select defaultValue="default" value={sortBy} onChange={handleSortChange}>
                            <MenuItem value="default">Mặc định</MenuItem>
                            <MenuItem value="name_asc">Tên (A-Z)</MenuItem>
                            <MenuItem value="name_desc">Tên (Z-A)</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small">
                        <Select defaultValue="all">
                            <MenuItem value="all">Tất cả</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <List>
                    {sortedGroups.map((group, index) => (
                        <ListItem
                            key={group._id}
                            divider
                            secondaryAction={
                                <IconButton onClick={(e) => handleMenuClick(e, group)}>
                                    <MoreVert />
                                </IconButton>
                            }
                            sx={{ alignItems: 'center' }}
                        >
                            <ListItemAvatar>
                                <Avatar src={group.avatarURL || "/static/images/avatar/default_group.png"} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={group.name}
                                secondary={`${group.memberCount} thành viên`}
                            />
                        </ListItem>
                    ))}
                </List>

                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                    <MenuItem onClick={handleViewInfo}>Xem thông tin</MenuItem>
                    <MenuItem>Rời nhóm</MenuItem>
                    <MenuItem sx={{ color: "red" }}>Xóa nhóm (nếu là trưởng nhóm)</MenuItem>
                </Menu>

                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth={false} PaperProps={{
                    sx: {
                        width: 400,
                        borderRadius: 3,
                        overflow: "hidden",
                    }
                }}>
                    {selectedGroup && (
                        <Box sx={{ bgcolor: "#fff" }}>
                            <Box sx={{ px: 3, py: 2 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>{selectedGroup.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Số thành viên: {selectedGroup.memberCount}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Hoạt động cuối: {selectedGroup.lastActive ? new Date(selectedGroup.lastActive).toLocaleString() : 'Chưa có thông tin'}
                                </Typography>
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