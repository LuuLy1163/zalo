import * as React from 'react';
import {
  Modal,
  Box,
  Typography,
  Avatar,
  Divider,
  Button,
  Stack,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UpdateProfileModal from './UpdateProfileModal';
import UpdateAvatarModal from './UpdateAvatarModal';
import UpdateCoverModal from './UpdateCoverModal';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
  overflow: 'hidden'
};

const formatDate = (isoString) => {
  if (!isoString) return 'Không rõ';
  const date = new Date(isoString);
  const day = date.getDate();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day} tháng ${month}, ${year}`;
};

const translateGender = (gender) => {
  switch (gender) {
    case 'male':
      return 'Nam';
    case 'female':
      return 'Nữ';
    case 'other':
      return 'Khác';
    default:
      return 'Không rõ';
  }
};
const formatPhoneNumber = (phone) => {
  if (!phone || phone.length !== 10) return phone;
  return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
};

export default function ProfileModal({ user, open, onClose, onUpdateUser }) {
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = React.useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = React.useState(false);


  if (!user) return null;

  const username = user?.username || 'Không rõ';
  const avatar = user?.avatarURL;
  const gender = user?.gender || 'Không rõ';
  const phone = user?.phoneNumber || 'Không rõ';
  const date = user?.dateOfBirth;
  const cover = user?.coverImage;

  return (
    <>
      <Modal
        open={open && !isUpdating}
        onClose={(event, reason) => {
          if (reason === 'backdropClick') return;
          onClose?.();
        }}
      >
        <Box sx={modalStyle} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 3,
              py: 2,
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            <Typography variant="h6">Thông tin tài khoản</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Cover + Avatar */}
          <Box sx={{ position: 'relative', width: '100%', height: 140 }}>
          <Box
            component="img"
            src={cover}
            alt="cover"
            sx={{
              width: '100%',
              height: 140,
              objectFit: 'cover',
              cursor: 'pointer' // thêm cursor
            }}
            onClick={() => setIsCoverModalOpen(true)}
          />

            <Box
              sx={{
                position: 'absolute',
                top: 100,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <Box sx={{ position: 'relative', width: 80, height: 80 }}>
                <Avatar
                  src={avatar}
                  sx={{
                    width: 80,
                    height: 80,
                    border: '3px solid white',
                    cursor: 'pointer',
                  }}
                  onClick={() => setIsAvatarModalOpen(true)}
                />
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'white',
                    boxShadow: 1,
                    '&:hover': { backgroundColor: '#f0f0f0' },
                  }}
                  onClick={() => setIsAvatarModalOpen(true)}
                >
                  <CameraAltIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Box>

          {/* Thông tin */}
          <Box sx={{ pt: 6, pb: 3, px: 3 }}>
            <Typography variant="h6" textAlign="center">{username}</Typography>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1} mt={1}>
              <Typography variant="body2">
                <strong>Giới tính:</strong> {translateGender(gender)}
              </Typography>
              <Typography variant="body2">
                <strong>Ngày sinh:</strong> {formatDate(date)}
              </Typography>
              <Typography variant="body2">
                <strong>Điện thoại:</strong> {formatPhoneNumber(phone)}
              </Typography>
            </Stack>

            <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
              Chỉ bạn bè có lưu số của bạn trong danh bạ máy xem được số này
            </Typography>

            <Button
              fullWidth
              variant="contained"
              onClick={() => setIsUpdating(true)}
              sx={{
                mt: 2,
                backgroundColor: '#0084ff',
                textTransform: 'none',
                borderRadius: 2,
                px: 4,
                '&:hover': {
                  backgroundColor: '#006fd6',
                },
              }}
            >
              Cập nhật
            </Button>
          </Box>
        </Box>
      </Modal>

      <UpdateProfileModal
        open={isUpdating}
        onClose={() => setIsUpdating(false)}
        user={user}
      />

      <UpdateAvatarModal
        open={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        user={user}
        onUpdateUser={onUpdateUser}
      />


      <UpdateCoverModal
        open={isCoverModalOpen}
        onClose={() => setIsCoverModalOpen(false)}
        user={user}
      />

    </>
  );
}