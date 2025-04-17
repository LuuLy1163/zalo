import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Avatar,
  Stack,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 320,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

export default function UpdateAvatarModal({ open, onClose, user }) {
  const [preview, setPreview] = useState(user.avatarURL || '');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selected);
    }
  };

  const handleSave = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('avatarURL', file);
    formData.append('email', user.email);

    try {
      setLoading(true);
      const res = await axios.put(
        'http://localhost:5000/api/auth/updateAvatar',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      // Cập nhật localStorage và reload để lấy avatar mới
      const updatedUser = {
        ...user,
        avatarURL: res.data.avatarURL || preview,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      alert(res.data.message || 'Cập nhật thành công');
      onClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        if (reason === 'backdropClick') return;
        onClose();
      }}
    >
      <Box sx={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Nút đóng */}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" mb={2}>
          Cập nhật ảnh đại diện
        </Typography>
        <Stack alignItems="center" spacing={2}>
          <Avatar src={preview} sx={{ width: 100, height: 100 }} />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="upload-avatar-input"
          />
          <label htmlFor="upload-avatar-input">
            <Button variant="outlined" component="span">
              Chọn ảnh
            </Button>
          </label>

          <Button
            fullWidth
            variant="contained"
            onClick={handleSave}
            disabled={!file || loading}
            sx={{
              backgroundColor: '#0084ff',
              '&:hover': { backgroundColor: '#006fd6' },
            }}
          >
            {loading ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
