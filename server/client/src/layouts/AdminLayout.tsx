// src/layouts/AdminLayout.jsx
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
import { Users, Settings, LogOut, Bell, Rocket, BarChart3, Bot, HelpCircle, CalendarDays, Folder, Mail, ChevronRight as ChevronRightLucide, ChevronDown as ChevronDownLucide, DollarSign } from 'lucide-react';
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

export default function AdminLayout() {
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
                { label: 'Users', to: '/admin/users', icon: <Users size={20} /> },
                { label: 'Requests', to: '/admin/requests', icon: <Rocket size={20} /> },
                { label: 'Payments', to: '/admin/payments', icon: <DollarSign size={20} /> },
                { label: 'Subscriptions', to: '/admin/settings', icon: <BarChart3 size={20} /> },
            ],
        },
        {
            subheader: 'CONCEPTS',
            items: [
                {
                    label: 'AI', icon: <Bot size={20} />, children: [
                        { label: 'Chat', to: '/admin/ai/chat' },
                        { label: 'Image', to: '/admin/ai/image' },
                    ]
                },

                { label: 'Privacy Policy', to: '/admin/help', icon: <HelpCircle size={20} /> },
                { label: 'Terms of Service', to: '/admin/calendar', icon: <CalendarDays size={20} /> },
                { label: 'Refund Policy', to: '/admin/files', icon: <Folder size={20} /> },
                { label: 'Contact Us', to: '/admin/mail', icon: <Mail size={20} /> },
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
                color="transparent"
                elevation={0}
                sx={{
                    backdropFilter: 'blur(8px)',
                    borderColor: 'divider',
                    backgroundColor: 'white'
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
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flexGrow: 1 }}>
                      
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <Tooltip title="Notifications">
                            <IconButton color="inherit" aria-label="notifications">
                                <Badge color="error" variant="dot" overlap="circular">
                                    <Bell size={20} />
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

                {/* Settings Menu */}
                <Menu
                    anchorEl={settingsAnchorEl}
                    open={Boolean(settingsAnchorEl)}
                    onClose={handleCloseSettingsMenu}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <MenuItem onClick={() => { handleCloseSettingsMenu(); navigate('/admin/settings'); }}>General</MenuItem>
                    <MenuItem onClick={() => { handleCloseSettingsMenu(); navigate('/admin/settings?tab=appearance'); }}>Appearance</MenuItem>
                    <MenuItem onClick={() => { handleCloseSettingsMenu(); navigate('/admin/payments'); }}>Billing</MenuItem>
                </Menu>

                {/* Profile Menu */}
                <Menu
                    anchorEl={profileAnchorEl}
                    open={Boolean(profileAnchorEl)}
                    onClose={handleCloseProfileMenu}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <MenuItem onClick={() => { handleCloseProfileMenu(); navigate('/admin/profile'); }}>My Profile</MenuItem>
                    <MenuItem onClick={() => { handleCloseProfileMenu(); navigate('/admin/account'); }}>Account Settings</MenuItem>
                    <MenuItem onClick={() => { handleCloseProfileMenu(); dispatch(logoutUser()); }}>Logout</MenuItem>
                </Menu>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <Stack onClick={() => navigate('/admin/dashboard')} direction="row" alignItems="center" spacing={1.5} sx={{ flexGrow: 1, pl: 1, cursor: "pointer" }}>
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
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 4, height: "100vh", overflowY: "auto", backgroundColor: "#f5f5f5" }}>
                

                <Outlet />
            </Box>
        </Box>
    );
}
