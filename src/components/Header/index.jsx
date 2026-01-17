import * as React from 'react';
import "./styles.css";
import { Context } from "../../Context/AuthContext" 
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from './Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import config from '../../services/config';
import Logo from "../../assets/logotipo.PNG";
import { useNavigate } from 'react-router-dom';
import Role from '../Role';

const SESSION_STORAGE_KEY = config.tokenName;

const Header = () => {
    const pages = ['Início'];
    // settings será definido dinamicamente conforme o papel do usuário
    const [settings, setSettings] = React.useState(['Sair']);
    
    const navigate = useNavigate();

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const { handleLogout } = React.useContext(Context);
    
    const [openRoleDialog, setOpenRoleDialog] = React.useState(false);
    const [availableRoles, setAvailableRoles] = React.useState([]);

    // const [user, setUser] = React.useState("");
    const [firstName, setFirstName] = React.useState("");

    React.useEffect(() => {
        const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
        const { user, role } = sessionData ? JSON.parse(sessionData) : {};
        const firstName = user ? user.first_name : "Sire";
        setFirstName(firstName);
        // Define opções do menu conforme o papel
        if (role === "Professor") {
            setSettings(["Trocar de perfil", "Sair"]);
        } else {
            setSettings(["Sair"]);
        }
    }, []);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleUserMenuClick = (setting) => {
        handleCloseUserMenu();
        if (setting === 'Sair') {
            handleLogout();
        } else if (setting === 'Trocar de perfil') {
            const sessionData = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY));
            verifyRole(sessionData, (roles) => {
                setOpenRoleDialog(true);
            });
        }
    };

    const handlePageClick = (page) => {
        handleCloseNavMenu();
        if (page === "Início") {
            navigate("./home");
        }
    }

    const handleRoleSelection = (role) => {
        setOpenRoleDialog(false);
        if (role) {
            const sessionData = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY));
            setRole(sessionData, role);
            console.log(`Role "${role}" foi selecionada.`);
            navigate("./");
        }
    };

    const storeSession = (sessionData) => {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
    };

    const setRole = (sessionData, role) => {
        sessionData['role'] = role;
        storeSession(sessionData);
    };

    const verifyRole = (sessionData, openRoleDialog) => {
        console.log(sessionData);
        const availableGroups = sessionData.user.groups;
        if (availableGroups.length === 1) {
            const role = availableGroups[0];
            console.log(`"${role}" was the only available role and was automatically chosen.`);
        } else if (availableGroups.length > 1) {
            setAvailableRoles(availableGroups);
            openRoleDialog(availableGroups);
        } else {
            console.log("Usuário não possui papel associado.");
        }
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: "#40A3A6", boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px' }} data-tutorial="header">
            <Container maxWidth="lg">
            {/* <Container style={{ width: '70vw', maxWidth: '1100px' }}> */}
                <Toolbar disableGutters>
                    {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
                    <Typography 
                        variant="h6"
                        noWrap
                        component="a"
                        href="/home"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: '#fff',
                            textDecoration: 'none',
                        }}
                    >
                        <img className="header-logo" src={Logo} alt="Logo" />
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="#000"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={() => handlePageClick(page)}>
                                    <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/home"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: '#fff',
                            textDecoration: 'none',
                            margin: '.5rem',
                        }}
                    >
                        <img className="header-logo" src={Logo} alt="Logo" />
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={() => handlePageClick(page)}
                                sx={{ my: 2, color: '#fff', display: 'block' }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar name={firstName} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={() => handleUserMenuClick(setting)}>
                                    <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>

            {openRoleDialog && (
                <Role 
                    open={openRoleDialog} 
                    onClose={handleRoleSelection} 
                    availableRoles={availableRoles} 
                />
            )}
        </AppBar>
    );
}

export default Header;
