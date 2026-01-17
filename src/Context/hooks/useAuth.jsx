import { useState, useEffect, useRef, useCallback } from "react";
import api from "../../services/api";
import config from "../../services/config";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const SESSION_STORAGE_KEY = config.tokenName;

const useAuth = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const isAuthenticatedRef = useRef(false);
    const REFRESH_THRESHOLD = 60 * 1000; // 1 minuto
    let intervalId = useRef(null);

    const storeSession = (sessionData) => {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
    };

    const clearSession = () => {
        localStorage.removeItem(SESSION_STORAGE_KEY);
    };

    const setupTokenRefresh = useCallback((token) => {
        const tokenData = jwtDecode(token);
        const expirationTime = tokenData.exp * 1000; //- 1740000
    
        const checkTokenValidity = async () => {
            if (!isAuthenticatedRef.current) {
                clearInterval(intervalId);
                return;
            }

            const now = new Date().getTime();
            const requestPayload = {
                "token": token,
                "orig_iat": tokenData.orig_iat * 1000,
            };
            
            // console.log(((expirationTime - now) / 1000 ) / 60);
            
            if (now >= expirationTime) {
                clearInterval(intervalId);
                handleLogout();
            } else if (expirationTime - now <= REFRESH_THRESHOLD) {
                try {
                    const response = await api.post(config.authTokenRefreshUrl, requestPayload);
                    const newToken = response.data.token;
                    let sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
                    sessionData = sessionData ? JSON.parse(sessionData) : {};
                    sessionData['token'] = newToken;
                    storeSession(sessionData);
                    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
                    console.log("New token arrived at " + new Date());
                    clearInterval(intervalId);
                    setupTokenRefresh(newToken);
                } catch (error) {
                    console.error("Erro ao renovar token:", error);
                    handleLogout();
                }
            }
        };
    
        const startTokenCheck = () => {
            clearInterval(intervalId.current);
            intervalId.current = setInterval(checkTokenValidity, 1000 * 5); // 5 segundos
        };
        
        startTokenCheck();

        return () => {
            clearInterval(intervalId.current);
        };

    }, []);

    /* verifica se o usuário já está autenticado */
    useEffect(() => {
        const loadingStoreData = async () => {
            try {
                const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
                if (storedSession) {
                    const { token } = JSON.parse(storedSession);
                    if (token) {
                        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                        setAuthenticated(true);
                        isAuthenticatedRef.current = true;
                        setupTokenRefresh(token);
                    }
                }
            } catch (error) {
                console.error("Erro ao carregar dados do localStorage:", error);
            } finally {
                setLoading(false);
            }
        };
        loadingStoreData();
    }, [setupTokenRefresh]);

    const setRole = (sessionData, role) => {
        sessionData['role'] = role;
        storeSession(sessionData);
    };

    const verifyRole = (sessionData, openRoleDialog, selectedRole) => {
        if (!sessionData.role) {
            const availableGroups = sessionData.user.groups;
            if (availableGroups.length === 1) {
                const role = availableGroups[0];
                console.log(`"${role}" was the only available role and was automatically chosen.`);
                setRole(sessionData, role);
                return true;
            } else if (availableGroups.length > 1) {
                if (selectedRole) {
                    setRole(sessionData, selectedRole);
                    return true;
                }
                openRoleDialog(availableGroups);
                return false;
            } else {
                throw new Error("Usuário não possui papel associado.");
            }
        } else {
            console.log(`Role "${sessionData.role}" already in use.`);
            return true;
        }
    };

    const handleLogin = async(username, password, selectedRole, openRoleDialog) => {
        try {
            const response = await api.post(config.authTokenUrl, { username, password, });
            const sessionData = response.data;
            const { token } = sessionData;
            const isRole = verifyRole(sessionData, openRoleDialog, selectedRole);
            if (isRole) {
                storeSession(sessionData);
                api.defaults.headers.common["Authorization"] = `Bearer ${token}`;            
                setAuthenticated(true);
                isAuthenticatedRef.current = true;
                setupTokenRefresh(token);
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            throw error;
        }
    };

    const handleLogout = async () => {
        setAuthenticated(false);
        isAuthenticatedRef.current = false;
        clearSession();
        api.defaults.headers.common["Authorization"] = undefined;
        return <Navigate to="/" />
    };

    return { authenticated, handleLogin, handleLogout, loading }
}

export default useAuth;