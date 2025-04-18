import React, { useState, useEffect } from 'react';
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  CardActions,
  Button,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Hàm gọi API để lấy thông tin bạn bè và lời mời
const fetchFriendData = async (authToken) => {
  try {
    const response = await fetch('http://localhost:5000/api/friend/friends', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
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

// Hàm gọi API để chấp nhận lời mời kết bạn
const acceptFriendRequest = async (authToken, senderPhone, receiverPhone) => {
    try {
      const response = await fetch('http://localhost:5000/api/friend/accept', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ senderPhone, receiverPhone }), 
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Lỗi khi chấp nhận lời mời:", error);
      throw error;
    }
  };

export default function FriendRequestPanel() {
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authToken = localStorage.getItem('accessToken');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const getUserIdFromToken = (token) => {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken._id;
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
      return null;
    }
  };

  const loadFriendRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!authToken) {
        setError("Bạn chưa đăng nhập!");
        setLoading(false);
        return;
      }

      const userId = getUserIdFromToken(authToken);
      setCurrentUserId(userId);

      const friendData = await fetchFriendData(authToken);
      if (friendData) {
        setIncomingRequests(friendData.pendingRequests || []);
        const sentRequests = friendData.pendingRequests.filter(request => request._id !== userId);
        // setOutgoingRequests(sentRequests);
      } else {
        setIncomingRequests([]);
        setOutgoingRequests([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFriendRequests();
  }, [authToken]);

  const handleAcceptFriend = async (senderPhone) => {
    if (!authToken) {
      setSnackbarMessage("Bạn chưa đăng nhập!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const receiverPhone = currentUser?.phoneNumber || '';
      const result = await acceptFriendRequest(authToken, senderPhone, receiverPhone);
      setSnackbarMessage(result.message || "Đã chấp nhận lời mời kết bạn.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      loadFriendRequests();
    } catch (error) {
      setSnackbarMessage(error.message || "Có lỗi xảy ra khi chấp nhận lời mời.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading) {
    return <Typography>Đang tải lời mời...</Typography>;
  }

  if (error) {
    return <Typography color="error">Lỗi khi tải lời mời: {error}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* ===== Lời mời đã nhận ===== */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600} color="primary">Lời mời đã nhận ({incomingRequests.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {incomingRequests.map((user, index) => (
              <Grid key={index} item xs={12} sm={6} md={4}>
                <Card variant="outlined">
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={user.avatarURL} sx={{ width: 48, height: 48 }} />
                    <Box>
                      <Typography fontWeight={600}>{user.username}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.phoneNumber || user.email || 'Không có thông tin'}
                      </Typography>
                    </Box>
                  </CardContent>
                  <Divider />
                  <CardActions sx={{ display: 'flex', px: 2, pb: 2, gap: 1 }}>
                    <Button variant="outlined" fullWidth size="small" sx={{ textTransform: 'none', borderColor: '#ccc', borderRadius: 1, fontWeight: 500 }}>Từ chối</Button>
                    <Button
                      variant="contained"
                      fullWidth
                      size="small"
                      sx={{ textTransform: 'none', borderRadius: 1, fontWeight: 500 }}
                      onClick={() => handleAcceptFriend(user.phoneNumber)} // Gọi hàm chấp nhận
                    >
                      Đồng ý
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
            {incomingRequests.length === 0 && (
              <Typography color="text.secondary">Chưa có lời mời kết bạn nào.</Typography>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ===== Lời mời đã gửi ===== */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600} color="primary">Lời mời đã gửi ({outgoingRequests.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {outgoingRequests.map((user, index) => (
              <Grid key={index} item xs={12} sm={6} md={4}>
                <Card variant="outlined">
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={user.avatarURL} sx={{ width: 48, height: 48 }} />
                    <Box>
                      <Typography fontWeight={600}>{user.username}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Đã gửi lời mời
                      </Typography>
                    </Box>
                  </CardContent>
                  <Divider />
                  <CardActions sx={{ justifyContent: 'center', px: 2, py: 1 }}>
                    <Button variant="outlined" fullWidth size="small" sx={{ textTransform: 'none', borderColor: '#ccc', borderRadius: 1, fontWeight: 500 }}>Thu hồi lời mời</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
            {outgoingRequests.length === 0 && (
              <Typography color="text.secondary">Bạn chưa gửi lời mời kết bạn nào.</Typography>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ===== Gợi ý kết bạn ===== */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Gợi ý kết bạn (0)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography color="text.secondary">Chưa có gợi ý kết bạn nào.</Typography>
        </AccordionDetails>
      </Accordion>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}