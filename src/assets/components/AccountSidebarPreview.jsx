import * as React from 'react';
import PropTypes from 'prop-types';
import { Stack, Divider } from '@mui/material';
import { AccountPreview } from '@toolpad/core/Account';

function AccountSidebarPreview({ handleClick, open, mini }) {
  return (
    <Stack direction="column" p={0}>
      <Divider />
      <AccountPreview
        variant={mini ? 'condensed' : 'expanded'}
        handleClick={handleClick}
        open={open}
      />
    </Stack>
  );
}

AccountSidebarPreview.propTypes = {
  handleClick: PropTypes.func,
  mini: PropTypes.bool.isRequired,
  open: PropTypes.bool,
};

export default AccountSidebarPreview;
