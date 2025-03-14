import * as React from 'react';
import { Stack, Typography, MenuList, MenuItem, ListItemText, Avatar, Divider } from '@mui/material';
import { AccountPopoverFooter, SignOutButton } from '@toolpad/core/Account';

const accounts = [
  {
    id: 1,
    name: 'LuuLy Ne',
    image: 'https://avatars.githubusercontent.com/u/19550456',
  }
];

function SidebarFooterAccountPopover() {
  return (
    <Stack direction="column">
      <Typography variant="body2" mx={2} mt={1}>
      </Typography>
      <MenuList>
        {accounts.map((account) => (
          <MenuItem
            key={account.id}
            component="button"
            sx={{
              justifyContent: 'flex-start',
              width: '100%',
              columnGap: 2,
            }}
          >
            <ListItemText
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: '100%',
              }}
              primary={account.name}
              primaryTypographyProps={{
                variant: 'body2',
                fontWeight: 'bold',  // Làm chữ in đậm
              }}
            />
          </MenuItem>
        ))}
        <Divider />
        {/* Thêm các lựa chọn Hồ sơ và Cài đặt */}
        <MenuItem component="button" sx={{ justifyContent: 'flex-start', width: '100%' }}>
          <ListItemText primary="Hồ sơ" primaryTypographyProps={{ variant: 'body2', align: 'left' }} />
        </MenuItem>

        <MenuItem component="button" sx={{ justifyContent: 'flex-start', width: '100%' }}>
          <ListItemText primary="Cài đặt" primaryTypographyProps={{ variant: 'body2', align: 'left' }} />
        </MenuItem>
      </MenuList>
      
      <Divider />
      
      <AccountPopoverFooter>
        <SignOutButton />
      </AccountPopoverFooter>
    </Stack>
  );
}

export default SidebarFooterAccountPopover;
