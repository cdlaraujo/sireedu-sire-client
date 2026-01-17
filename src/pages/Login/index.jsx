import React, { useContext, useState } from "react";
import "./styles.css";
import { Context } from "../../Context/AuthContext";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockIcon from '@mui/icons-material/Lock';
import CircularProgress from "@mui/material/CircularProgress";
import MessageHandler from "../../components/MessageHandler";
import Role from "../../components/Role";
import PageTitleUpdater from "../../components/PageTitleUpdater";

const Login = () => {
    const { authenticated, handleLogin } = useContext(Context);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");      
    const [emailError, setEmailError] = useState(false);                                                               
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [messageType, setMessageType] = useState("success"); // 'success', 'error', 'info', 'warning'
    const [open, setOpen] = useState(false);

    const [openRoleDialog, setOpenRoleDialog] = useState(false);
    
    const availableRoles = ['Student', 'Professor'];

    const validateEmail = () => {
        const allowedDomains = ["unifesp.br", "ifsp.edu.br", "aluno.ifsp.edu.br", "edu.azores.gov.pt", "ime.unicamp.br"];
        const emailDomain = username.split("@")[1];
    
        if (!username.includes("@") || !allowedDomains.includes(emailDomain)) {
            setEmailError(true);
            setTimeout(() => setEmailError(false), 5000);
            return false
        }
        return true;
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const onSubmit = async(event) => {
        event.preventDefault();

        const isValid = validateEmail();
        if(!isValid) return;

        await login(null);
    };

    const handleRoleSelection = (role) => {
        setOpenRoleDialog(false);
        if (role) {
            // console.log(`Role "${role}" foi selecionado.`);
            login(role);
        }
    };

    const login = async(selectedRole) => {
        setLoading(true);
        try {
            await handleLogin(username, password, selectedRole, (roles) => {
                // setAvailableRoles(roles);
                setOpenRoleDialog(true);
            });
            setMessageType("success");
            setError("");
        } catch (error) {
            setError("Erro ao fazer login. Verifique suas credenciais.");
            setMessageType('error');
            setOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => setOpen(false);

    if (authenticated) {
        return <Navigate to="/home"/>;
    }

    return (
        <div className="login-container">
            <PageTitleUpdater title={"Login"} />
            <form className="form-container" onSubmit={onSubmit}>
                <p className="login-heading">Faça seu login</p>
                {emailError && <span className="error-message">Utilize um e-mail institucional</span>}
                <FormControl fullWidth sx={{ width: '100%', marginBottom: '10px' }}>
                    <OutlinedInput
                        id="email"
                        placeholder="Email"
                        startAdornment={<InputAdornment position="start"><MailOutlineIcon /></InputAdornment>}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        error={emailError}
                    />
                </FormControl>

                <FormControl sx={{ width: '100%', marginBottom: '10px' }}>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        placeholder="Senha"
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        startAdornment={<InputAdornment position="start"><LockIcon /></InputAdornment>}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                        }
                    />
                </FormControl>

                {open && <MessageHandler message={error} type={messageType} open={open} onClose={handleClose} />}
                
                <div className="forgot-password">
                    <Link className="forgot-password-link" to="../password-reset">Esqueceu a senha?</Link>
                </div>
                
                <button className="bg-primary-color login-button" type="submit" disabled={loading}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
                </button>

                <p className="create-account-text">
                    Não tem uma conta? <Link className="primary-color create-account-link" to="/signup/">Crie agora</Link>
                </p>
            </form>

            {openRoleDialog && (
                <Role 
                    open={openRoleDialog} 
                    onClose={handleRoleSelection} 
                    availableRoles={availableRoles} 
                />
            )}
            
        </div>
    );
}

export default Login;
