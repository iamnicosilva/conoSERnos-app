import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import api from '../services/api';
import logo from '../assets/images/logo.jpg';
import dorso from '../assets/images/dorsotarjeta.jpg';
import fondo from '../assets/images/fondo.jpg';

interface ICard {
    _id: string;
    content: string;
    category: string;
    depthLevel: number;
}

const GamePage = () => {
    const { user, logout, updateUser } = useAuth();
    const [isFlipped, setIsFlipped] = useState(false);
    const [currentCard, setCurrentCard] = useState<ICard | null>(null);
    const [loading, setLoading] = useState(false);

    const handleDrawCard = async () => {
        if (loading) return;

        // Validación optimista de créditos
        if (user && user.credits <= 0) {
            alert("¡Sin créditos! Necesitas comprar más packs para seguir jugando.");
            return;
        }

        setLoading(true);
        try {
            const response = await api.get<ICard>('/cards/draw');
            const card = response.data;

            setCurrentCard(card);
            setIsFlipped(true);

            // Actualizar créditos localmente
            if (user) {
                updateUser({ ...user, credits: user.credits - 1 });
            }
        } catch (error: any) {
            console.error('Error drawing card:', error);
            if (error.response?.status === 403 || error.response?.status === 400) {
                alert("¡Sin créditos! Necesitas comprar más packs para seguir jugando.");
            } else {
                alert("Ocurrió un error al sacar la carta. Intenta de nuevo.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setIsFlipped(false);
        // Esperar a que termine la animación para limpiar la carta (opcional)
        setTimeout(() => setCurrentCard(null), 600);
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center flex flex-col relative overflow-hidden"
            style={{ backgroundImage: `url(${fondo})` }}
        >
            {/* Overlay Blanco Semi-transparente */}
            <div className="absolute inset-0 bg-white/85 z-0" />

            {/* Header Superior */}
            <header className="relative z-10 w-full p-6 flex justify-between items-center">
                <div className="flex items-center">
                    <img
                        src={logo}
                        alt="ConoSERnos Logo"
                        className="w-32 md:w-40 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                    />
                </div>

                <div className="flex items-center gap-4">
                    {/* Badge de Créditos */}
                    <div className="bg-white px-5 py-2 rounded-full shadow-md flex items-center gap-2 border border-brand-primary/10">
                        <span className="text-2xl">💎</span>
                        <span className={`font-bold text-base md:text-lg ${user && user.credits === 0 ? 'text-red-500' : 'text-brand-primary'}`}>
                            {user?.credits ?? 0} Créditos
                        </span>
                    </div>

                    <button
                        onClick={logout}
                        className="bg-white/80 p-3 rounded-full hover:bg-red-50 text-red-500 transition-colors shadow-sm"
                        title="Cerrar Sesión"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                    </button>
                </div>
            </header>

            {/* Área Central (Tablero) */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 gap-8">

                {/* Contenedor 3D de la Carta - Proporción Horizontal (Landscape) */}
                <div className="relative w-[420px] h-[280px] [perspective:1000px] max-w-full aspect-[3/2]">
                    <motion.div
                        className="w-full h-full relative [transform-style:preserve-3d]"
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                        {/* FRENTE (Dorso del mazo) - Interactivo */}
                        <div
                            onClick={handleDrawCard}
                            className={`absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-3xl shadow-2xl overflow-hidden border-[6px] border-white cursor-pointer group transition-transform hover:scale-[1.02] active:scale-95 ${loading ? 'opacity-80 pointer-events-none' : ''}`}
                        >
                            <img
                                src={dorso}
                                alt="Dorso Carta"
                                className="w-full h-full object-cover"
                            />
                            {/* Brillo sutil */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent pointer-events-none"></div>

                            {/* Indicador de carga o CTA */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white font-bold text-lg bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                                    {loading ? 'Sacando carta...' : 'Toca para sacar carta'}
                                </span>
                            </div>
                        </div>

                        {/* DORSO (Contenido de la carta) */}
                        <div
                            className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white rounded-3xl shadow-2xl border-[6px] border-brand-secondary flex flex-col items-center justify-center p-8 text-center"
                        >
                            {/* Decoración */}
                            <div className="absolute top-0 left-0 w-full h-4 bg-brand-secondary"></div>
                            <div className="absolute bottom-0 left-0 w-full h-4 bg-brand-secondary"></div>
                            <div className="absolute -top-16 -right-16 w-48 h-48 bg-brand-background rounded-full opacity-50 blur-2xl"></div>

                            {/* Contenido Dinámico */}
                            {currentCard ? (
                                <div className="relative z-10 flex flex-col items-center gap-4 w-full h-full justify-center">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-bold uppercase tracking-widest text-brand-secondary bg-brand-background px-2 py-1 rounded">
                                            {currentCard.category}
                                        </span>
                                        <span className="text-xs font-bold text-gray-400">
                                            Nivel {currentCard.depthLevel}
                                        </span>
                                    </div>

                                    <p className="text-gray-700 text-xl md:text-2xl leading-relaxed font-bold max-w-md font-sans">
                                        "{currentCard.content}"
                                    </p>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <span className="text-gray-400">Cargando...</span>
                                </div>
                            )}

                            <div className="absolute bottom-6 text-xs text-gray-400 font-bold tracking-[0.2em] uppercase">
                                ConoSERnos
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Botón de Acción (Solo visible cuando la carta está volteada) */}
                <div className={`flex flex-col items-center gap-3 mt-4 transition-opacity duration-500 ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <button
                        onClick={handleReset}
                        className="px-10 py-4 bg-brand-primary text-white font-bold rounded-2xl shadow-xl hover:bg-brand-primary/90 hover:shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-3 text-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74-2.74L3 12" /></svg>
                        Volver al Mazo
                    </button>
                </div>

            </main>
        </div>
    );
};

export default GamePage;
