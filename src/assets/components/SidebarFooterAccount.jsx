import * as React from 'react';
import PropTypes from 'prop-types';
import { Account } from '@toolpad/core/Account';
import AccountSidebarPreview from './AccountSidebarPreview';
import SidebarFooterAccountPopover from './SidebarFooterAccountPopover';

const createPreviewComponent = (mini, user) => {
  return function PreviewComponent(props) {
    return <AccountSidebarPreview {...props} mini={mini} user={user} />;
  };
};

function SidebarFooterAccount({ mini, user }) {
  const PreviewComponent = React.useMemo(() => createPreviewComponent(mini, user), [mini, user]);

  return (
    <Account
      user={{
        name: user?.username,        // ✅ Đổi từ "username" thành "name"
        email: user?.email,
        avatar: user?.avatarURL,
      }}
      slots={{
        preview: PreviewComponent,
        popoverContent: () => <SidebarFooterAccountPopover user={user} />,
      }}
      slotProps={{
        popover: {
          transformOrigin: { horizontal: 'left', vertical: 'bottom' },
          anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
          disableAutoFocus: true,
          slotProps: {
            paper: {
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: (theme) =>
                  `drop-shadow(0px 2px 8px ${
                    theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.10)'
                      : 'rgba(0,0,0,0.32)'
                  })`,
                mt: 1,
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  bottom: 10,
                  left: 0,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translate(-50%, -50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            },
          },
        },
      }}
    />
  );
}

SidebarFooterAccount.propTypes = {
  mini: PropTypes.bool.isRequired,
  user: PropTypes.object,
};

export default SidebarFooterAccount;
