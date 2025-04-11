import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { AccountPopoverFooter, SignOutButton } from '@toolpad/core/Account';

const storedUser = localStorage.getItem('user');
const user = storedUser ? JSON.parse(storedUser) : null;

const accounts = user ? [{
  id: user._id?.$oid || 1,
  name: user.username || 'Người dùng',
  email: user.email || '',
  image: user.avatarURL || '',
  color: '#1976d2',
}] : [];

function SidebarFooterAccountPopover() {
  return (
    <Stack direction="column">
      <Typography variant="body2" mx={2} mt={1}>Accounts</Typography>
      <MenuList>
        {accounts.map((account) => (
          <MenuItem key={account.id} component="button" sx={{ justifyContent: 'flex-start', width: '100%', columnGap: 2 }}>
            <ListItemIcon>
              <Avatar
                sx={{ width: 32, height: 32, fontSize: '0.95rem', bgcolor: account.color }}
                src={account.image}
                alt={account.name}
              >
                {account.name[0]}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}
              primary={account.name}
              secondary={account.email}
              primaryTypographyProps={{ variant: 'body2' }}
              secondaryTypographyProps={{ variant: 'caption' }}
            />
          </MenuItem>
        ))}
      </MenuList>
      <Divider />
      <AccountPopoverFooter>
        <SignOutButton />
      </AccountPopoverFooter>
    </Stack>
  );
}

export default SidebarFooterAccountPopover;
