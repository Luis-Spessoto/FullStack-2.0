import React, { useEffect } from 'react';
import { useAuthContext } from '../context/SearchContextAPI';
import Movie from './Movie';


const handleRefresh = () => {
    window.location.reload();
};

const SearchResult = () => {
    //Consome os estados globais do Context API
    const { results, loading, error, totalResults, searchMovies } = useAuthContext();

    //Requisito: Exibir dados iniciais ao carregar (Busca vazia no BE)
    useEffect(() => {
        if (totalResults === 0) {
            //Inicia uma busca vazia para mostrar todos os filmes (ou o primeiro erro)
            searchMovies('');
        }
    }, [searchMovies, totalResults]);

    //1. Estado de Carregamento
    if (loading && totalResults === 0) {
        return (
            <div className="text-center p-8 mt-8 bg-gray-800 rounded-xl shadow-lg">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full"></div>
                <p className="mt-4 text-xl font-medium text-indigo-400">Carregando resultados do MongoDB...</p>
            </div>
        );
    }

    //2. Mensagens de Erro da API/Busca Vazia
    if (error) {
        return (
            <div className="text-center p-8 mt-8 bg-red-800 border-l-4 border-red-400 rounded-xl text-white shadow-lg">
                <p className="font-semibold text-lg">Error!</p>
                <p className="text-sm mt-2">{error}</p>
            </div>
        );
    }

    //3. Exibição dos Resultados
    if (results.length === 0) {
    return (
      <div className="text-center p-8 mt-8 bg-blue-100 border-l-4 border-blue-500 rounded-lg max-w-xl mx-auto">
        <p className="text-blue-700 font-semibold text-lg">Nenhuma pesquisa realizada ainda.</p>
        <p className="text-blue-600 text-sm mt-2">Utilize o formulário ao lado para começar a ver filmes.</p>
      </div>
    );
    } else {
      return (
          <div className="p-4 bg-gray-800 rounded-xl shadow-2xl">
              <div className="flex justify-between items-center mb-4 border-b-2 border-indigo-400 pb-2 gap-4"> 
                <h2 className="text-xl font-bold text-white flex-grow">
                    Filmes no banco de dados ({totalResults} encontrados)
                </h2>
                <button
                    onClick={handleRefresh}
                    className="py-1 px-3 bg-red-500 text-sm hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition duration-300 flex-shrink-0"
                >
                    Limpar Resultados
                </button>
            </div>
              {totalResults === 0 ? (
                  <p className="text-gray-400 text-lg text-center p-4">Nenhum filme encontrado no BD.</p>
              ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {results.map((movie) => (
                          <Movie key={movie.imdbID} movie={movie} />
                      ))}
                  </div>
              )}
              
          </div>
      );
    }
};

export default SearchResult;