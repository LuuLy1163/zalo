import React from 'react';
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
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Dữ liệu mẫu
const incoming = [
  { name: 'Zobe', avatar: 'https://i.imgur.com/abc123.jpg', via: '7 ngày · Quét mã QR' },
  { name: 'Nguyễn Kim Kiên', avatar: 'https://i.imgur.com/xyz123.jpg', via: '23/10 · Từ số điện thoại' },
  { name: 'Trần Xuân Tùng', avatar: 'https://i.imgur.com/def456.jpg', via: '09/09 · Từ số điện thoại' },
];

const outgoing = [
  { name: 'Lẩu Ếch', avatar: 'https://i.imgur.com/ghi789.jpg' },
  { name: 'Đaont', avatar: 'https://i.imgur.com/jkl012.jpg' },
];

// (Ví dụ) danh sách gợi ý
const suggestions = [
  { name: 'Minh', avatar: 'https://i.imgur.com/mno345.jpg' },
  { name: 'Lan', avatar: 'https://i.imgur.com/pqr678.jpg' },
];

export default function FriendRequestPanel() {
  return (
    <Box sx={{ p: 3 }}>
      {/* ===== Lời mời đã nhận ===== */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600} color="primary">Lời mời đã nhận ({incoming.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {incoming.map((u, i) => (
              <Grid key={i} item xs={12} sm={6} md={4}>
                <Card variant="outlined">
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={u.avatar} sx={{ width: 48, height: 48 }} />
                    <Box>
                      <Typography fontWeight={600}>{u.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {u.via}
                      </Typography>
                    </Box>
                  </CardContent>
                  <Divider />
                  <CardActions sx={{ display: 'flex', px: 2, pb: 2, gap: 1 }}>
    <Button
      variant="outlined"
      fullWidth
      size="small"
      sx={{
        textTransform: 'none',
        borderColor: '#ccc',
        borderRadius: 1,
        fontWeight: 500
      }}
    >
      Từ chối
    </Button>
    <Button
      variant="contained"
      fullWidth
      size="small"
      sx={{
        textTransform: 'none',
        borderRadius: 1,
        fontWeight: 500
      }}
    >
      Đồng ý
    </Button>
  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ===== Lời mời đã gửi ===== */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600} color="primary">Lời mời đã gửi ({outgoing.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {outgoing.map((u, i) => (
              <Grid key={i} item xs={12} sm={6} md={4}>
                <Card variant="outlined">
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={u.avatar} sx={{ width: 48, height: 48 }} />
                    <Box>
                      <Typography fontWeight={600}>{u.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Bạn đã gửi lời mời
                      </Typography>
                    </Box>
                  </CardContent>
                  <Divider />
                  <CardActions sx={{ justifyContent: 'center', px: 2, py: 1 }}>
                  <Button
      variant="outlined"
      fullWidth
      size="small"
      sx={{
        textTransform: 'none',
        borderColor: '#ccc',
        borderRadius: 1,
        fontWeight: 500
      }}
    >
      Thu hồi lời mời
    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ===== Gợi ý kết bạn ===== */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Gợi ý kết bạn ({suggestions.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {suggestions.map((u, i) => (
              <Grid key={i} item xs={12} sm={6} md={4}>
                <Card variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2, py: 1.5 }}>
    <Avatar src={u.avatar} sx={{ width: 48, height: 48 }} />
    <Box>
      <Typography fontWeight={600}>{u.name}</Typography>
      <Typography variant="body2" color="text.secondary">
        {u.via || `${u.commonGroups} nhóm chung`}
      </Typography>
    </Box>
  </CardContent>
  <Divider />
  <CardActions sx={{ display: 'flex', px: 2, pb: 2, gap: 1 }}>
    <Button
      variant="outlined"
      fullWidth
      size="small"
      sx={{
        textTransform: 'none',
        borderColor: '#ccc',
        borderRadius: 1,
        fontWeight: 500
      }}
    >
      Bỏ qua
    </Button>
    <Button
      variant="contained"
      fullWidth
      size="small"
      sx={{
        textTransform: 'none',
        borderRadius: 1,
        fontWeight: 500
      }}
    >
      Kết bạn
    </Button>
  </CardActions>
</Card>

              </Grid>
            ))}
            {suggestions.length === 0 && (
              <Typography color="text.secondary">Chưa có gợi ý kết bạn nào.</Typography>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
