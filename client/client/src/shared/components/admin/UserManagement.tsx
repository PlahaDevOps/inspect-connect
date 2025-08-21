import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { Search, Plus, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Inspector' | 'Client';
  status: 'Active' | 'Pending' | 'Suspended';
  createdAt: string; // ISO
};

const initialUsers: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', createdAt: '2025-08-01' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Inspector', status: 'Pending', createdAt: '2025-08-02' },
  { id: '3', name: 'Carol Lee', email: 'carol@example.com', role: 'Client', status: 'Active', createdAt: '2025-08-03' },
  { id: '4', name: 'David Kim', email: 'david@example.com', role: 'Inspector', status: 'Suspended', createdAt: '2025-08-03' },
];

export default function UserManagement() {
  const [query, setQuery] = React.useState('');
  const [users, setUsers] = React.useState<User[]>(initialUsers);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [activeUser, setActiveUser] = React.useState<null | User>(null);

  const [openAdd, setOpenAdd] = React.useState(false);
  const [newUser, setNewUser] = React.useState<Omit<User, 'id' | 'createdAt'>>({
    name: '',
    email: '',
    role: 'Client',
    status: 'Active',
  });

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [query, users]);

  const handleOpenRowMenu = (event: React.MouseEvent<HTMLButtonElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setActiveUser(user);
  };
  const handleCloseRowMenu = () => {
    setAnchorEl(null);
    setActiveUser(null);
  };

  const handleDelete = () => {
    if (activeUser) {
      setUsers((prev) => prev.filter((u) => u.id !== activeUser.id));
    }
    handleCloseRowMenu();
  };

  const handleAdd = () => {
    setOpenAdd(true);
  };
  const handleAddClose = () => setOpenAdd(false);
  const handleAddSave = () => {
    if (!newUser.name || !newUser.email) return;
    const id = String(Date.now());
    setUsers((prev) => [
      { id, createdAt: new Date().toISOString().slice(0, 10), ...newUser },
      ...prev,
    ]);
    setNewUser({ name: '', email: '', role: 'Client', status: 'Active' });
    setOpenAdd(false);
  };

  type ChipColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  const statusColor = (status: User['status']): ChipColor => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight={800}>Users</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
            <TextField
              size="small"
              placeholder="Search users..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} />
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" startIcon={<Plus size={18} />} onClick={handleAdd} sx={{ textTransform: 'none', fontWeight: 700 }}>
              Add User
            </Button>
          </Stack>
        </Stack>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>
                    <Chip size="small" label={u.status} color={statusColor(u.status) as any} variant="outlined" />
                  </TableCell>
                  <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={(e) => handleOpenRowMenu(e as any, u)}>
                      <MoreVertical size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography variant="body2" color="text.secondary">No users found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Row actions menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseRowMenu}>
        <MenuItem onClick={handleCloseRowMenu}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Eye size={16} />
            <span>View</span>
          </Stack>
        </MenuItem>
        <MenuItem onClick={handleCloseRowMenu}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Edit size={16} />
            <span>Edit</span>
          </Stack>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Trash2 size={16} />
            <span>Delete</span>
          </Stack>
        </MenuItem>
      </Menu>

      {/* Add user dialog */}
      <Dialog open={openAdd} onClose={handleAddClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Full Name"
              value={newUser.name}
              onChange={(e) => setNewUser((p) => ({ ...p, name: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                label="Role"
                native
                value={newUser.role}
                onChange={(e) => setNewUser((p) => ({ ...p, role: e.target.value as User['role'] }))}
              >
                <option value="Admin">Admin</option>
                <option value="Inspector">Inspector</option>
                <option value="Client">Client</option>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                label="Status"
                native
                value={newUser.status}
                onChange={(e) => setNewUser((p) => ({ ...p, status: e.target.value as User['status'] }))}
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>Cancel</Button>
          <Button onClick={handleAddSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
