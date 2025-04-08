import * as React from 'react';
import PropTypes from 'prop-types';
import { Stack, Divider } from '@mui/material';
import { AccountPreview } from '@toolpad/core/Account';

function AccountSidebarPreview({ handleClick, open, mini, user }) {
  return (
    <Stack direction="column" p={0}>
      <Divider />
      <AccountPreview
        variant={mini ? 'condensed' : 'expanded'}
        handleClick={handleClick}
        open={open}
        user={{
          name: user?.username, // ✅ Phải là `name`, KHÔNG phải `username`
          email: user?.email,
          avatar: user?.avatarURL,
        }}
      />
    </Stack>
  );
}

AccountSidebarPreview.propTypes = {
  handleClick: PropTypes.func,
  mini: PropTypes.bool.isRequired,
  open: PropTypes.bool,
  user: PropTypes.object, // ✅ Bắt buộc để nhận props từ SidebarFooterAccount
};

export default AccountSidebarPreview;
