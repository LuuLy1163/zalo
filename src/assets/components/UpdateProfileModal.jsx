import axios from 'axios';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useState, useEffect } from 'react';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

export default function UpdateProfileModal({ open, onClose, user }) {
  const [form, setForm] = useState({
    _id: '',
    username: '',
    gender: '',
    dateOfBirth: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        _id: user._id,
        username: user.username || '',
        gender: user.gender || '',
        dateOfBirth: user.dateOfBirth?.substring(0, 10) || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.put('http://localhost:5000/api/auth/updateProfile', form);
      alert(res.data.message);
      onClose();
    } catch (err) {
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
        onClose?.();
      }}
    >
      <Box sx={modalStyle} onClick={(e) => e.stopPropagation()}>
        <Typography variant="h6" mb={2}>Cập nhật thông tin</Typography>

        <TextField
          name="username"
          label="Tên người dùng"
          fullWidth
          margin="normal"
          value={form.username}
          onChange={handleChange}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="gender-label">Giới tính</InputLabel>
          <Select
            labelId="gender-label"
            name="gender"
            value={form.gender}
            label="Giới tính"
            onChange={handleChange}
          >
            <MenuItem value="male">Nam</MenuItem>
            <MenuItem value="female">Nữ</MenuItem>
            <MenuItem value="other">Khác</MenuItem>
          </Select>
        </FormControl>

        <TextField
          name="dateOfBirth"
          label="Ngày sinh"
          type="date"
          fullWidth
          margin="normal"
          value={form.dateOfBirth}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ mt: 2, borderRadius: 2 }}
        >
          {loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
        </Button>
      </Box>
    </Modal>
  );
}
