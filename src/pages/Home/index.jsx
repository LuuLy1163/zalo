import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { createTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import CloudIcon from '@mui/icons-material/Cloud';
import SettingsIcon from '@mui/icons-material/Settings';
import ChatPage from '../../assets/components/Chat';
import ContactPage from '../../assets/components/Contact';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import {
  Account,
  AccountPreview,
  AccountPopoverFooter,
  SignOutButton,
} from '@toolpad/core/Account';

const NAVIGATION = [
  { kind: 'header', title: '' },
  { segment: 'chat', title: 'Tin nhắn', icon: <ChatIcon /> },
  { segment: 'contact', title: 'Danh bạ', icon: <PermContactCalendarIcon /> },
  { segment: 'cloud', title: 'Cloud của tôi', icon: <CloudIcon /> },
  { segment: 'setting', title: 'Cài đặt', icon: <SettingsIcon /> },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  let content;

  switch (pathname) {
    case '/chat':
      content = <ChatPage />;
      break;
    case '/contact':
      content = <ContactPage />;
      break;
    default:
      content = <Typography>Chưa có nội dung cho trang này</Typography>;
      break;
  }

  return (
    <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      {content}
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function AccountSidebarPreview(props) {
  const { handleClick, open, mini } = props;
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

const storedUser = localStorage.getItem('user');
console.log(storedUser);
const user = storedUser ? JSON.parse(storedUser) : null;

const accounts = user ? [{
  id: user._id?.$oid || 1,
  name: user.username || 'Người dùng',
  email: user.email || '',
  image: user.avatarURL || '',
  color: '#1976d2',
}] : [];

function SidebarFooterAccountPopover({ authentication, router }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    authentication.signOut();
    setTimeout(() => {
      navigate('/');
    }, 100);
    router.navigate('/');
  };

  return (
    <Stack direction="column">
      <Typography variant="body2" mx={2} mt={1}>Accounts</Typography>
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
            <ListItemIcon>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: '0.95rem',
                  bgcolor: account.color,
                }}
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
        <SignOutButton onClick={handleSignOut} />
      </AccountPopoverFooter>
    </Stack>
  );
}

SidebarFooterAccountPopover.propTypes = {
  authentication: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
};

function createPreviewComponent(mini) {
  return function PreviewComponent(props) {
    return <AccountSidebarPreview {...props} mini={mini} />;
  };
}

function SidebarFooterAccount({ mini, authentication, router }) {
  const PreviewComponent = React.useMemo(() => createPreviewComponent(mini), [mini]);

  return (
    <Account
      slots={{
        preview: PreviewComponent,
        popoverContent: () => <SidebarFooterAccountPopover authentication={authentication} router={router} />,
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
  authentication: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
};

const demoSession = user
  ? {
      user: {
        name: user.username || 'Người dùng',
        email: user.email || '',
        image: user.avatarURL || '',
      },
    }
  : null;

function Home(props) {
  const { window } = props;

  const [pathname, setPathname] = React.useState('/dashboard');

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  const demoWindow = window !== undefined ? window() : undefined;

  const [session, setSession] = React.useState(() => demoSession);
  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        setSession(demoSession);
      },
      signOut: () => {
        setSession(null);
        router.navigate('/');
      },
    };
  }, [router]);

  const SidebarFooter = React.useMemo(
    () => (props) => (
      <SidebarFooterAccount {...props} authentication={authentication} router={router} />
    ),
    [authentication, router]
  );

  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        logo: <img src="https://mui.com/static/logo.png" alt="ZALO logo" />,
        title: 'ZALO',
        homeUrl: '/home',
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      authentication={authentication}
      session={session}
    >
      <DashboardLayout
        slots={{ toolbarAccount: () => null, sidebarFooter: SidebarFooter }}
      >
        <DemoPageContent pathname={pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}

Home.propTypes = {
  window: PropTypes.func,
};

export default Home;
