import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.jpg';

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password, fullName);
            }
            navigate('/game');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[url('/src/assets/images/fondo.jpg')] bg-cover bg-center flex items-center justify-center relative">
            {/* Overlay */}
            <div className="absolute inset-0 bg-brand-primary/30 backdrop-blur-sm"></div>

            {/* Tarjeta Glassmorphism */}
            <div className="relative z-10 w-full max-w-md p-8 m-4 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 animate-fade-in-up">

                <div className="text-center mb-8">
                    <img
                        src={logo}
                        alt="ConoSERnos"
                        className="w-52 h-auto mx-auto rounded-xl shadow-lg mb-6 hover:scale-105 transition-transform duration-300"
                    />
                    <h2 className="text-3xl font-bold text-brand-primary font-sans">
                        {isLogin ? '¡Hola de nuevo!' : 'Únete al viaje'}
                    </h2>
                    <p className="text-gray-600 mt-2 font-medium">
                        {isLogin ? 'Conecta para seguir jugando' : 'Empieza a conocerte mejor'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-100/80 border border-red-200 text-red-600 rounded-xl text-center text-sm font-bold animate-shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <div className="group">
                            <label className="block text-sm font-bold text-brand-primary mb-1 ml-1">Nombre Completo</label>
                            <input
                                type="text"
                                required
                                className="w-full px-5 py-3 bg-white/50 border-2 border-transparent focus:border-brand-secondary rounded-xl outline-none transition-all placeholder-gray-400 font-medium text-gray-700 focus:bg-white"
                                placeholder="Tu nombre"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="group">
                        <label className="block text-sm font-bold text-brand-primary mb-1 ml-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-5 py-3 bg-white/50 border-2 border-transparent focus:border-brand-secondary rounded-xl outline-none transition-all placeholder-gray-400 font-medium text-gray-700 focus:bg-white"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="group">
                        <label className="block text-sm font-bold text-brand-primary mb-1 ml-1">Contraseña</label>
                        <input
                            type="password"
                            required
                            className="w-full px-5 py-3 bg-white/50 border-2 border-transparent focus:border-brand-secondary rounded-xl outline-none transition-all placeholder-gray-400 font-medium text-gray-700 focus:bg-white"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-brand-primary text-white font-bold rounded-xl shadow-lg hover:bg-brand-primary/90 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Procesando...
                            </span>
                        ) : (
                            isLogin ? 'Ingresar' : 'Crear Cuenta'
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-600 font-medium">
                        {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            className="ml-2 text-brand-primary font-bold hover:text-brand-secondary hover:underline transition-colors"
                        >
                            {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
