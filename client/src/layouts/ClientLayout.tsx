import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import type { Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import type { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BarChart3, CalendarDays, ClipboardList, DollarSign, Folder, HelpCircle,  Mail, Settings, ChevronRight as ChevronRightLucide, ChevronDown as ChevronDownLucide, Rocket } from 'lucide-react';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {Logos} from '../utils/assets/index';
import { logoutUser } from '../store/actions/authActions';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/index';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

export default function ClientLayout() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [settingsAnchorEl, setSettingsAnchorEl] = React.useState<null | HTMLElement>(null);
  const [profileAnchorEl, setProfileAnchorEl] = React.useState<null | HTMLElement>(null);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

  const handleOpenSettingsMenu = (event: React.MouseEvent<HTMLElement>) => setSettingsAnchorEl(event.currentTarget);
  const handleCloseSettingsMenu = () => setSettingsAnchorEl(null);
  const handleOpenProfileMenu = (event: React.MouseEvent<HTMLElement>) => setProfileAnchorEl(event.currentTarget);
  const handleCloseProfileMenu = () => setProfileAnchorEl(null);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  interface NavItem {
    label: string;
    to?: string;
    icon?: React.ReactNode;
    children?: NavItem[];
  }

  const navSections: { subheader: string; items: NavItem[] }[] = [
    {
      subheader: 'DASHBOARD',
      items: [
        { label: 'Overview', to: '/client/dashboard', icon: <BarChart3 size={20} /> },
        { label: 'My Requests', to: '/client/requests', icon: <ClipboardList size={20} /> },
        { label: 'Calendar', to: '/client/appointments', icon: <CalendarDays size={20} /> },
        { label: 'Certificates', to: '/client/certificates', icon: <Folder size={20} /> },
        { label: 'Payments', to: '/client/payments', icon: <DollarSign size={20} /> },
        { label: 'Subscriptions', to: '/client/subscriptions', icon: <Rocket size={20} /> },
      ],
    },
    {
      subheader: 'HELP',
      items: [
        { label: 'Support', to: '/client/support', icon: <HelpCircle size={20} /> },
        { label: 'Contact Us', to: '/client/contact', icon: <Mail size={20} /> },
      ],
    },
  ];

  const toggleExpand = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderChild = (child: NavItem) => (
    <ListItem key={child.label} disablePadding sx={{ display: 'block' }}>
      <NavLink
        to={child.to || '#'}
        style={() => ({ display: 'block', textDecoration: 'none', color: 'inherit' })}
      >
        {({ isActive }) => (
          <ListItemButton
            selected={isActive}
            sx={[
              { minHeight: 36, pl: open ? 7 : 2.5 },
              {
                borderRadius: 1,
                '&.Mui-selected': {
                  bgcolor: 'action.selected',
                  '& .MuiListItemText-primary': { color: 'primary.main', fontWeight: 700 },
                },
              },
            ]}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 1.5 : 'auto', justifyContent: 'center' }}>
              <Box sx={{ width: 6, height: 6, bgcolor: 'text.disabled', borderRadius: '50%' }} />
            </ListItemIcon>
            <ListItemText primary={child.label} sx={[open ? { opacity: 1 } : { opacity: 0 }]} />
          </ListItemButton>
        )}
      </NavLink>
    </ListItem>
  );

  const renderItem = (item: NavItem) => {
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
    if (!hasChildren && item.to) {
      return (
        <ListItem key={item.label} disablePadding sx={{ display: 'block' }}>
          <NavLink to={item.to} style={() => ({ display: 'block', textDecoration: 'none', color: 'inherit' })}>
            {({ isActive }) => (
              <ListItemButton
                selected={isActive}
                sx={[
                  { minHeight: 44, px: 2 },
                  open ? { justifyContent: 'initial' } : { justifyContent: 'center' },
                  {
                    borderRadius: 1,
                    '&.Mui-selected': {
                      bgcolor: 'action.selected',
                      '& .MuiListItemIcon-root': { color: 'primary.main' },
                      '& .MuiListItemText-primary': { color: 'primary.main', fontWeight: 700 },
                    },
                  },
                ]}
              >
                <ListItemIcon sx={[{ minWidth: 0, justifyContent: 'center', color: 'text.secondary' }, open ? { mr: 2 } : { mr: 'auto' }]}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} sx={[open ? { opacity: 1 } : { opacity: 0 }]} />
              </ListItemButton>
            )}
          </NavLink>
        </ListItem>
      );
    }

    const key = item.label;
    return (
      <React.Fragment key={key}>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={() => toggleExpand(key)}
            sx={[{ minHeight: 44, px: 2 }, open ? { justifyContent: 'initial' } : { justifyContent: 'center' }, { borderRadius: 1 }]}
          >
            <ListItemIcon sx={[{ minWidth: 0, justifyContent: 'center', color: 'text.secondary' }, open ? { mr: 2 } : { mr: 'auto' }]}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} sx={[open ? { opacity: 1 } : { opacity: 0 }]} />
            {open ? (expanded[key] ? <ChevronDownLucide size={18} /> : <ChevronRightLucide size={18} />) : null}
          </ListItemButton>
        </ListItem>
        <Collapse in={Boolean(expanded[key])} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children?.map((child) => renderChild(child))}
          </List>
        </Collapse>
      </React.Fragment>
    );
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        color="default"
        elevation={0}
        sx={{
          backdropFilter: 'blur(8px)',
          borderColor: 'divider',
          backgroundColor: 'white',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              { marginRight: 2 },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>
          
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Tooltip title="Notifications">
              <IconButton color="inherit" aria-label="notifications">
                <Badge color="error" variant="dot" overlap="circular">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 9.5C6.5 6.46243 8.96243 4 12 4C15.0376 4 17.5 6.46243 17.5 9.5V13.25L18.6768 15.459C19.0909 16.2308 18.5314 17.1667 17.6542 17.1667H6.34577C5.46858 17.1667 4.90912 16.2308 5.32319 15.459L6.5 13.25V9.5Z" stroke="currentColor" strokeWidth="1.5" /><path d="M9.5 18C10.1667 19.3333 11.5 20 12 20C12.5 20 13.8333 19.3333 14.5 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Settings">
              <IconButton color="inherit" aria-label="settings" onClick={handleOpenSettingsMenu}>
                <Settings size={20} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Account">
              <IconButton color="inherit" aria-label="account" onClick={handleOpenProfileMenu}>
                <Avatar src={Logos.primary} sx={{ width: 30, height: 30 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>

        <Menu
          anchorEl={settingsAnchorEl}
          open={Boolean(settingsAnchorEl)}
          onClose={handleCloseSettingsMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={() => { handleCloseSettingsMenu(); navigate('/client/settings'); }}>General</MenuItem>
          <MenuItem onClick={() => { handleCloseSettingsMenu(); navigate('/client/settings?tab=appearance'); }}>Appearance</MenuItem>
          <MenuItem onClick={() => { handleCloseSettingsMenu(); navigate('/client/payments'); }}>Billing</MenuItem>
        </Menu>

        <Menu
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={handleCloseProfileMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={() => { handleCloseProfileMenu(); navigate('/client/profile'); }}>My Profile</MenuItem>
          <MenuItem onClick={() => { handleCloseProfileMenu(); navigate('/client/account'); }}>Account Settings</MenuItem>
          <MenuItem onClick={() => { 
            handleCloseProfileMenu(); 
            dispatch(logoutUser());
          }}>Logout</MenuItem>
        </Menu>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Stack onClick={() => navigate('/client/dashboard')} direction="row" alignItems="center" spacing={1.5} sx={{ flexGrow: 1, pl: 1, cursor: 'pointer' }}>
            <Avatar src={Logos.small} sx={{ width: 36, height: 36 }} />
            <Typography variant="subtitle1" fontWeight={700} sx={[open ? { opacity: 1 } : { opacity: 0 }]}>
              InspectConnect
            </Typography>
          </Stack>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        {navSections.map((section) => (
          <List
            key={section.subheader}
            sx={{ px: 0.5 }}
            subheader={
              <ListSubheader component="div" sx={{ lineHeight: 2.5, letterSpacing: 0.5 }}>
                {section.subheader}
              </ListSubheader>
            }
          >
            {section.items.map((item) => renderItem(item))}
          </List>
        ))}
        

      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 4, height: '100vh', overflowY: 'auto', backgroundColor: '#f5f5f5' }}>
        

        <Outlet />
      </Box>
    </Box>
  );
}
