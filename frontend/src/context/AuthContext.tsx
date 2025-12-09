import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import api from '../services/api';

interface User {
    _id: string;
    email: string;
    fullName: string;
    credits: number;
    roles: string[];
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, fullName: string) => Promise<void>;
    logout: () => void;
    updateUser: (user: User) => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken) {
                setToken(storedToken);
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }

                // Refrescar perfil para obtener créditos actualizados
                try {
                    const response = await api.get('/auth/profile');
                    const updatedUser = response.data;
                    setUser(updatedUser);
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                } catch (error) {
                    console.error('Error refreshing profile:', error);
                    // Si el token es inválido, podríamos hacer logout automático aquí
                    // logout(); 
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { access_token, user } = response.data;

            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));
            setToken(access_token);
            setUser(user);
        } catch (error) {
            throw error;
        }
    };

    const register = async (email: string, password: string, fullName: string) => {
        try {
            const response = await api.post('/auth/register', { email, password, fullName });
            const { access_token, user } = response.data;

            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));
            setToken(access_token);
            setUser(user);
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            register,
            logout,
            updateUser,
            isAuthenticated: !!token,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
