import React, { useEffect, useState } from 'react';
import { SearchProvider, useAuthContext } from './context/SearchContextAPI'; 
import SearchForm from './components/SearchForm'; 
import SearchResult from './components/SearchResult';
import Login from './components/Login';
import InsertForm from './components/InsertForm';

//Componente que lida com o Conteúdo Principal (Busca e Inserção)
const MainContent = () => {
    const { logout, user } = useAuthContext();
    
    return (
        <div className="container mx-auto px-4 pt-10">
          <button 
                onClick={logout}
                // Classes para fixar no canto: absolute top-4 right-4 z-10
                className="absolute top-4 right-4 z-10 py-1 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition duration-300"
            >
                Logout
            </button>
            <header className="text-center mb-10 px-4 text-white">
                <h1 className="text-4xl font-extrabold mb-2">
                    Fullstack - Movie Search Engine 2.0 🎞️
                </h1>
                <p className="text-xl text-gray-300">
                    Logado como: <span className="font-semibold">{user.username}</span>
                </p>
                
            </header>
            
            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna 1: Busca e Inserção */}
                <div className="lg:col-span-1 space-y-8">
                    <SearchForm />
                    <InsertForm /> {/* Requisito: Inserção */}
                </div>
                
                {/* Coluna 2/3: Resultados */}
                <div className="lg:col-span-2">
                    <SearchResult />
                </div>
            </main>
        </div>
    );
};

const App = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        document.title = "FilmSearch";
        setTimeout(() => setIsLoading(false), 50); 
    }, []);

    const { isAuthenticated } = useAuthContext();

    if (isLoading) {
        return <div className="min-h-screen bg-gray-900"></div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 font-sans relative pb-20 
                    bg-gradient-to-br from-gray-900 to-indigo-900/20"> 
            
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
                body { font-family: 'Inter', sans-serif; background-color: #111827; overflow-x: hidden; }
                `}
            </style>

            {/* Roteamento Condicional (Requisito: Login) */}
            {isAuthenticated ? <MainContent /> : <Login />}

            <footer className="fixed bottom-0 left-0 w-full py-3 text-center text-xs text-gray-100 bg-indigo-700/90 shadow-lg backdrop-blur-sm">
                <p className="font-semibold">Projeto 02 - FullStack UTFPR [2025.02] <br/> © ®Spessoto - FilmSearch: 2025® ©</p>
            </footer>
        </div>
    );
};


const RootApp = () => (
    <SearchProvider>
        <App />
    </SearchProvider>
);

export default RootApp;