import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Account } from '@toolpad/core/Account';
import AccountSidebarPreview from './AccountSidebarPreview';
import SidebarFooterAccountPopover from './SidebarFooterAccountPopover';

function SidebarFooterAccount({ mini, user }) {
  const PreviewComponent = useMemo(
    () => (props) => <AccountSidebarPreview {...props} mini={mini} />,
    [mini]
  );
  

  return (
    <Account
      user={{
        name: user?.username || user?.email?.split('@')[0] || 'Người dùng',
        email: user?.email || '',
        avatar: user?.avatarURL || '/default-avatar.png',
      }}
      slots={{
        preview: PreviewComponent,
        popoverContent: () => <SidebarFooterAccountPopover user={user} />,
      }}
    />
  );
}

SidebarFooterAccount.propTypes = {
  mini: PropTypes.bool.isRequired,
  user: PropTypes.object,
};

export default SidebarFooterAccount;
