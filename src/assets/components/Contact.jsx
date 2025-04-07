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
      '&:focus': { outline: 'none', backgroundColor: 'rgba(172, 197, 223, 0.46)'  }, // Bỏ viền khi nhấp vào
      '&:hover': { backgroundColor: 'gba(172, 197, 223, 0.46)' },
  };
  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 224 , width: "100%", height: "100%"}}
    >
     <Tabs
  orientation="vertical"
  value={value}
  onChange={handleChange}
  aria-label="Vertical icon position tabs example"
  sx={{
    borderRight: 1,
    borderColor: 'divider',
    '& .MuiTabs-indicator': { backgroundColor: 'transparent' }, // Ẩn thanh chỉ báo mặc định
  }}
>
  
    <Tab icon={<AccountBoxIcon />} iconPosition="start" label="Danh sách banh bè"  sx={tabStyle}/>
    <Tab icon={<GroupIcon />} iconPosition="start" label="Danh sách nhóm và cộng đồng"  sx={tabStyle} />
    <Tab icon={<PersonAddAlt1Icon />} iconPosition="start" label="Lời mời kết bạn"  sx={tabStyle}/>
    <Tab icon={<GroupAddIcon />} iconPosition="start" label="Lời mời vào nhóm và cộng đồng" sx={tabStyle}/>
</Tabs>

      <TabPanel value={value} index={0}>
        Danh sách bạn bè
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