import { styled } from "@mui/material/styles";
import { Box, Toolbar, TextField, IconButton } from "@mui/material";
export const Main = styled('main', {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  }));
  export const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));
  
export const ChatDetailContainer = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    display: "flex",
    flexDirection: "column",
    height: "100%",
  }));
  
  export const ChatDetailHeader = styled(Toolbar)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: "none",
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: "flex",
    alignItems: "center",
  }));
  
  export const ChatDetailBody = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(2),
    overflowY: "auto",
    overflowX: "hidden",
    position: "relative",        // allow absolutely-positioned drawer inside
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.background.default,
  }));
  
  export const ChatDetailInput = styled(Toolbar)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1),
    display: "flex",
    alignItems: "center",
  }));
  
  export const StyledTextField = styled(TextField)(({ theme }) => ({
    flexGrow: 1,
    marginRight: theme.spacing(1),
    "& .MuiOutlinedInput-root": {
      borderRadius: "20px",
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
    },
  }));
  
  export const HoverIconButton = styled(IconButton)(({ theme }) => ({
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
  }));