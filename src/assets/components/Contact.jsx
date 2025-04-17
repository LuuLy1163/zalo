import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import FriendList from './FriendsList';
import FriendRequestPanel from './FriendRequestPanel';

function TabPanel(props) {
  const { children, value, index, sx = {}, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{ flexGrow: 1, display: value === index ? 'flex' : 'none' }}
      {...other}
    >
      <Box sx={{ flex: 1, height: '100%',  bgcolor: 'background.paper', ...sx }}>
        {children}
      </Box>
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  sx: PropTypes.object,
};

export default function VerticalTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabStyle = {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    textAlign: 'left',
    whiteSpace: 'nowrap',
    '&:focus': { outline: 'none', backgroundColor: 'rgba(172, 197, 223, 0.46)' },
    '&:hover': { backgroundColor: 'rgba(172, 197, 223, 0.2)' },
  };

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        bgcolor: 'background.paper'
      }}
    >
      <Tabs
        orientation="vertical"
        value={value}
        onChange={handleChange}
        sx={{
          borderRight: 1,
          borderColor: 'divider',
          minWidth: 260,
          bgcolor: 'background.paper',
          '& .MuiTabs-indicator': { backgroundColor: 'transparent' },
        }}
      >
        <Tab icon={<AccountBoxIcon />} iconPosition="start" label="Danh sách bạn bè" sx={tabStyle} />
        <Tab icon={<GroupIcon />} iconPosition="start" label="Danh sách nhóm" sx={tabStyle} />
        <Tab icon={<PersonAddAlt1Icon />} iconPosition="start" label="Lời mời kết bạn" sx={tabStyle} />
        <Tab icon={<GroupAddIcon />} iconPosition="start" label="Lời mời vào nhóm" sx={tabStyle} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <FriendList />
      </TabPanel>
      <TabPanel value={value} index={1}>
      <Box p={2}>Item Four</Box>
      </TabPanel>
      <TabPanel value={value} index={2}>
      <FriendRequestPanel />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Box p={2}>Item Four</Box>
      </TabPanel>
    </Box>
  );
}
