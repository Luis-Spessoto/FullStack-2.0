import React, { useState, createContext, useContext, useCallback, useMemo, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3000/api/v1';

const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext);
};

//Hook personalizado para facilitar o consumo
export const useSearchContext = () => {
    return useContext(AuthContext);
};


export const SearchProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('jwtToken'));
    const [storedUsername, setStoredUsername] = useState(localStorage.getItem('username'));
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    //Efeito para verificar o token ao carregar a página
    useEffect(() => {
        if (token) {
            //Verifica a validade mínima do token (apenas simulação no front)
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.exp * 1000 > Date.now()) {
                setIsAuthenticated(true);
                setUser({ username: storedUsername });
            } else {
                logout();
            }
        }
    }, [token]);


    //Lógica de Autenticação (Login/Logout)
    const login = useCallback(async (username, password) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || (data.errors ? data.errors[0].msg : 'Falha no login.'));
            }

            //Armazena o token e atualiza o estado
            localStorage.setItem('jwtToken', data.token);
            localStorage.setItem('username', data.username);
            setToken(data.username);
            setToken(data.token);
            setIsAuthenticated(true);
            setUser({ username: data.username });
            
            return { success: true };

        } catch (err) {
            setError(err.message || 'Erro ao conectar com o servidor.');
            setLoading(false);
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('jwtToken');
        setToken(null);
        setIsAuthenticated(false);
        setUser(null);
        setResults([]);
        setError(null);
    }, []);

    //Lógica de Busca (GET /movies)
    const searchMovies = useCallback(async (query) => {
        if (!query) return;

        setLoading(true);
        setError(null);
        setResults([]);

        try {
            //1. Requisição Autenticada (Envia o Token JWT no Header)
            const response = await fetch(`${API_BASE_URL}/movies?search=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Token JWT
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Falha na busca. Necessário login.');
            }

            if (data.movies && data.movies.length === 0) {
                throw new Error("Nenhum filme encontrado no BD para esta pesquisa.");
            }
            
            setResults(data.movies || []);

        } catch (err) {
            setError(err.message || 'Erro ao buscar filmes no servidor.');
        } finally {
            setLoading(false);
        }
    }, [token]); //Depende do token para garantir a autenticação

    
    //Lógica de Inserção (POST /movies)
    const insertMovie = useCallback(async (movieData) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`${API_BASE_URL}/movies`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, //Token JWT
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(movieData)
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMsg = data.errors ? data.errors.map(e => e.msg).join('; ') : data.message;
                throw new Error(errorMsg || 'Falha ao inserir filme.');
            }
            
            // Recarrega a lista após inserção bem-sucedida (opcional, mas bom)
            searchMovies(''); 

            return { success: true, message: data.message };

        } catch (err) {
            setError(err.message || 'Erro ao inserir filme no servidor.');
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    }, [token, searchMovies]); //Depende do token e da função de busca

    const contextValue = useMemo(() => ({
        // Auth
        isAuthenticated,
        user,
        login,
        logout,
        // Search/Data
        results,
        loading,
        error,
        searchMovies,
        insertMovie,
        totalResults: results.length,
    }), [isAuthenticated, user, login, logout, results, loading, error, searchMovies, insertMovie]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};