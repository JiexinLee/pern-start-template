import React from 'react'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import UserTO, { toUserTO } from '../to/UserTO';
import { api } from '../api';
import { loginEndpoint, logoutEndpoint, signupEndpoint } from '../api/endpoints';

interface AuthContextProps {
    user?: UserTO;
    logout: () => Promise<void>;
    token?: string
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string, confirmPass: string) => Promise<void>;
}
const AuthContext = React.createContext<AuthContextProps>({
    user: undefined,
    token: '',
    logout: () => Promise.reject('not implemented'),
    login: () => Promise.reject('not implemented'),
    signup: () => Promise.reject('not implemented'),
})

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = React.useState<UserTO | undefined>(undefined);
    const [token, setToken] = React.useState<string>(localStorage.getItem('token') || '');

    const logout = React.useCallback(async () => {
        try {
            await api.post(logoutEndpoint, { userId: currentUser?.id })
            setCurrentUser(undefined);
            setToken('')
            localStorage.removeItem('token');
            navigate('/auth')
        } catch {
            toast.error('Something went wrong, try again later.')
        }

    }, [currentUser?.id, navigate])

    const onLogin = React.useCallback(async (email: string, password: string) => {
        const payload = { email, credential: password }
        const response = await api.post(loginEndpoint, payload)
        const { data: { result, successful } } = response
        if (!successful) {
            toast.error('Invalid username or password')
            return
        }
        setCurrentUser(toUserTO(result.user))
        localStorage.setItem('token', result.accessToken)
        if (!token) {
            setToken(result.accessToken)
        }
        navigate('/home')
    }, [navigate, token])

    const onSignup = React.useCallback(async (name: string, email: string, password: string, confirmPass: string,) => {
        if (confirmPass && password !== confirmPass) {
            return alert('Password does not match')
        }
        const payload = { email, credential: password, name }
        const response = await api.post(signupEndpoint, payload)
        const { data: { result, successful } } = response
        if (!successful) {
            toast.error('Failed to create account')
            return
        }
        toast.success(`Success! Created account`)
        localStorage.setItem('token', result.accessToken)
        if (!token) {
            setToken(result.accessToken)
        }
        navigate('/home')
    }, [navigate, token])


    React.useEffect(() => {
        let isMounted = true;
        // Fetch user
        if (token && !currentUser) {
            (async () => {
                try {
                    const response = await api.get('/user/userDetail')
                    if (isMounted) {
                        const { data: { result, successful } } = response;
                        if (!successful) {
                            toast.error('Failed to retrieve user');
                            return;
                        }
                        setCurrentUser(toUserTO(result));
                    }
                } catch {
                    if (isMounted) await logout();
                }

            })()
        }
        return () => {
            isMounted = false; // Cleanup flag
        };
    }, [currentUser, logout, token])

    const value = React.useMemo(() => ({
        user: currentUser,
        logout,
        token,
        login: onLogin,
        signup: onSignup
    }),
        [currentUser, logout, onLogin, onSignup, token]);
    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    )
}

export default AuthProvider