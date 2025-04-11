import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Stack,
  Typography,
  MenuList,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
} from '@mui/material';
import { AccountPopoverFooter, SignOutButton } from '@toolpad/core/Account';
import ProfileModal from './ProfileModal';

function SidebarFooterAccountPopover({ user }) {
  const handleClick = (e) => {
    e.stopPropagation();
    if (onCloseMenu) onCloseMenu(); 
    setTimeout(() => setOpenModal(true), 100); 
  };

  const username = user?.username || 'Người dùng';
  const avatar = user?.avatarURL || '';
  const email = user?.email || '';

  const [openModal, setOpenModal] = React.useState(false);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  return (
    <>
      <Stack direction="column">
        <Typography variant="body2" mx={2} mt={1}>
          Tài khoản
        </Typography>
        <MenuList>
        <MenuItem
          component="button"
          onClick={(e) => {
            e.stopPropagation(); 
            setTimeout(() => {
              setOpenModal(true);
            }, 100);
          }}
          sx={{
            justifyContent: 'flex-start',
            width: '100%',
            columnGap: 2,
          }}
        >
            <ListItemIcon>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: '0.95rem',
                }}
                src={avatar}
                alt={username}
              >
                {username[0]?.toUpperCase()}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: '100%',
              }}
              primary={username}
              secondary={email}
              primaryTypographyProps={{ variant: 'body2' }}
              secondaryTypographyProps={{ variant: 'caption' }}
            />
          </MenuItem>
        </MenuList>
        <Divider />
        <AccountPopoverFooter>
          <SignOutButton />
        </AccountPopoverFooter>
      </Stack>

      <ProfileModal open={openModal} onClose={handleClose} user={user} />
    </>
  );
}

SidebarFooterAccountPopover.propTypes = {
  user: PropTypes.object,
};

export default SidebarFooterAccountPopover;
