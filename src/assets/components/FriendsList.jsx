import React, { useState } from "react";
import {
  Avatar, Box, InputBase, List, ListItem, ListItemAvatar, ListItemText,
  Typography, MenuItem, Select, FormControl, IconButton, Menu, Dialog,
  DialogTitle, DialogContent, DialogActions, Button
} from "@mui/material";
import { Search, MoreVert } from "@mui/icons-material";
import Grid from '@mui/material/Grid';
// Danh sách bạn bè mẫu
const friends = [
  {
    name: "Aminh ><",
    avatar: "https://i.imgur.com/abc123.jpg",
    bio: "Sun",
    gender: "Nữ",
    dob: "01 tháng 01, 2003",
    phone: "+84 344 562 816"
  },
  {
    name: "An",
    avatar: "https://i.imgur.com/xyz123.jpg",
    bio: "Coder",
    gender: "Nam",
    dob: "10 tháng 08, 2000",
    phone: "+84 911 111 111"
  },
  // Thêm bạn bè khác...
];

export default function FriendList() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

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

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', padding: 3}}>
      <Box sx={{ width: '100%' }}>
        <Typography variant="h6" gutterBottom>
          Bạn bè ({friends.length})
        </Typography>

        {/* Search + Filter */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", flex: 1, p: 1, border: "1px solid #ccc", borderRadius: 2 }}>
            <Search sx={{ mr: 1 }} />
            <InputBase placeholder="Tìm bạn" fullWidth />
          </Box>
          <FormControl size="small">
            <Select defaultValue="az">
              <MenuItem value="az">Tên (A-Z)</MenuItem>
              <MenuItem value="za">Tên (Z-A)</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small">
            <Select defaultValue="all">
              <MenuItem value="all">Tất cả</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Danh sách bạn */}
        <List>
          {friends.map((friend, index) => (
            <ListItem
              key={index}
              divider
              secondaryAction={
                <IconButton onClick={(e) => handleMenuClick(e, friend)}>
                  <MoreVert />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar src={friend.avatar} />
              </ListItemAvatar>
              <ListItemText primary={friend.name} />
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
    width: 400, // Ốm hơn
    borderRadius: 3,
    overflow: "hidden",
  }
}}>
  {selectedFriend && (
    <Box sx={{ bgcolor: "#fff" }}>
      
      {/* Ảnh bìa */}
      <Box sx={{
        height: 180, // Cao hơn
        backgroundImage: `url(https://i.imgur.com/XxXxXxX.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }} />

      {/* Avatar + tên */}
      <Box sx={{ px: 3, mt: -7 }}>
        <Avatar
          src={selectedFriend.avatar}
          sx={{
            width: 72,
            height: 72,
            border: "3px solid white",
          }}
        />
        <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h6" fontWeight={600}>{selectedFriend.name}</Typography>
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
      <Typography variant="body2" color="text.primary">{selectedFriend.bio}</Typography>
    </Grid>

    {/* Giới tính */}
    <Grid item xs={4}>
      <Typography variant="body2" color="grey"><b>Giới tính:</b></Typography>
    </Grid>
    <Grid item xs={8}>
      <Typography variant="body2" color="text.primary">{selectedFriend.gender}</Typography>
    </Grid>

    {/* Ngày sinh */}
    <Grid item xs={4}>
      <Typography variant="body2" color="grey"><b>Ngày sinh:</b></Typography>
    </Grid>
    <Grid item xs={8}>
      <Typography variant="body2" color="text.primary">{selectedFriend.dob}</Typography>
    </Grid>

    {/* Điện thoại */}
    <Grid item xs={4}>
      <Typography variant="body2" color="grey"><b>Điện thoại:</b></Typography>
    </Grid>
    <Grid item xs={8}>
      <Typography variant="body2" color="text.primary">{selectedFriend.phone}</Typography>
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
    Nhóm chung (39)
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
