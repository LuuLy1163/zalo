import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { createTheme } from '@mui/material/styles';
import ChatIcon from '@mui/icons-material/Chat';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import CloudIcon from '@mui/icons-material/Cloud';
import SettingsIcon from '@mui/icons-material/Settings';
import SidebarFooterAccount from '../../assets/components/SidebarFooterAccount';
import ChatPage from '../../assets/components/Chat';
import ContactPage from '../../assets/components/Contact';

const NAVIGATION = [
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
      xl: 1236,
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
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {content}
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function Home(props) {
  const { window } = props;
  const [pathname, setPathname] = React.useState('/');

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  const [session, setSession] = React.useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? { user: JSON.parse(storedUser) } : null;
  });

  // 👇 Log để kiểm tra dữ liệu user
  React.useEffect(() => {
    console.log('[Home] session:', session);
  }, [session]);

  const authentication = React.useMemo(
    () => ({
      signIn: () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setSession({ user: JSON.parse(storedUser) });
        }
      },
      signOut: () => {
        localStorage.clear();
        setSession(null);
      },
    }),
    [],
  );

  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        logo: <img src="https://mui.com/static/logo.png" alt="ZALO logo" />,
        title: 'ZALO',
        homeUrl: '/',
      }}
      router={router}
      theme={demoTheme}
      authentication={authentication}
      session={session}
    >
      <DashboardLayout
        slots={{
          toolbarAccount: () => null,
          sidebarFooter: () => (
            <SidebarFooterAccount mini={false} user={session?.user} />
          ),
        }}
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
