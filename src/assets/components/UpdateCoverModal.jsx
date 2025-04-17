import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Stack,
  IconButton
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
  position: 'relative'
};

export default function UpdateCoverModal({ open, onClose, user }) {
  const [preview, setPreview] = useState(user.coverImage || '');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selected);
    }
  };

  const handleSave = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('coverImage', file);
    formData.append('email', user.email);

    try {
      setLoading(true);
      const res = await axios.put('http://localhost:5000/api/auth/updateImageCover', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert(res.data.message || 'Cập nhật ảnh bìa thành công');
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Cập nhật ảnh bìa thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        if (reason === 'backdropClick') return;
        onClose?.();
      }}
    >
      <Box sx={modalStyle} onClick={(e) => e.stopPropagation()}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" mb={2}>Cập nhật ảnh bìa</Typography>

        <Stack alignItems="center" spacing={2}>
          <Box
            component="img"
            src={preview}
            alt="preview"
            sx={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 1 }}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="upload-cover-input"
          />
          <label htmlFor="upload-cover-input">
            <Button variant="outlined" component="span">
              Chọn ảnh
            </Button>
          </label>

          <Button
            fullWidth
            variant="contained"
            onClick={handleSave}
            disabled={!file || loading}
            sx={{ backgroundColor: '#0084ff', '&:hover': { backgroundColor: '#006fd6' } }}
          >
            {loading ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
