import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import PhoneMissedIcon from '@mui/icons-material/PhoneMissed';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const tabStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    textAlign: 'left',
      '&:focus': { outline: 'none', backgroundColor: 'rgba(172, 197, 223, 0.46)'  }, 
  };
  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' , width: "100%", height: "100%"}}
    >
     <Tabs
      orientation="vertical"
      value={value}
      onChange={handleChange}
      aria-label="Vertical icon position tabs example"
      sx={{
        borderRight: 1,
        borderColor: 'divider',
        '& .MuiTabs-indicator': { backgroundColor: 'transparent' }, 
      }}
    >
  
    <Tab icon={<AccountBoxIcon />} iconPosition="start" label="Danh sách banh bè"  sx={tabStyle}/>
    <Tab icon={<GroupIcon />} iconPosition="start" label="Danh sách nhóm và cộng đồng"  sx={tabStyle} />
    <Tab icon={<PersonAddAlt1Icon />} iconPosition="start" label="Lời mời kết bạn"  sx={tabStyle}/>
    <Tab icon={<GroupAddIcon />} iconPosition="start" label="Lời mời vào nhóm và cộng đồng" sx={tabStyle}/>
</Tabs>

<TabPanel value={value} index={0}>
  <Box>
    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
      Bạn bè (487)
    </Typography>

    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <Box sx={{ flex: 1 }}>
        <input
          type="text"
          placeholder="Tìm bạn"
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid #ccc',
            outline: 'none',
          }}
        />
      </Box>

      <Box>
        <select
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid #ccc',
            outline: 'none',
          }}
        >
          <option value="name">Tên (A-Z)</option>
          <option value="new">Mới thêm</option>
        </select>
      </Box>

      <Box>
        <select
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid #ccc',
            outline: 'none',
          }}
        >
          <option value="all">Tất cả</option>
          <option value="online">Đang hoạt động</option>
        </select>
      </Box>
    </Box>

    <Box>
      <Typography variant="subtitle2" sx={{ color: '#999', mb: 1 }}>A</Typography>

      {[
        { name: 'Aminh > <', avatar: 'https://cong-nghe-moi.s3.ap-southeast-1.amazonaws.com/ck49-1744391025475-User-avatar.svg.png' },
        { name: 'Ân', avatar: 'https://cong-nghe-moi.s3.ap-southeast-1.amazonaws.com/ck49-1744391025475-User-avatar.svg.png' },
        { name: 'An Nhiên', avatar: 'https://cong-nghe-moi.s3.ap-southeast-1.amazonaws.com/ck49-1744391025475-User-avatar.svg.png' },
        { name: 'Ăn Vặt Titifoods', avatar: 'https://cong-nghe-moi.s3.ap-southeast-1.amazonaws.com/ck49-1744391025475-User-avatar.svg.png' },
        { name: 'Ánh Ánh', avatar: 'https://cong-nghe-moi.s3.ap-southeast-1.amazonaws.com/ck49-1744391025475-User-avatar.svg.png' },
      ].map((friend, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            py: 1,
            borderBottom: '1px solid #eee',
            '&:hover': { backgroundColor: '#f9f9f9' },
          }}
        >
          <img
            src={friend.avatar}
            alt={friend.name}
            style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 12 }}
          />
          <Typography variant="body1" sx={{ flexGrow: 1 }}>{friend.name}</Typography>
          <Typography variant="body2" sx={{ color: '#aaa' }}>⋯</Typography>
        </Box>
      ))}
    </Box>
  </Box>
</TabPanel>

      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
    </Box>
  );
}