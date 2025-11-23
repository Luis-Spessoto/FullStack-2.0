import React from 'react';
import { useForm } from 'react-hook-form'; 
import { useAuthContext } from '../context/SearchContextAPI'; 

const SearchForm = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const { searchMovies } = useAuthContext();

    const onSubmit = (data) => {
        searchMovies(data.query); 
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-indigo-500">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Buscar Filmes no BD</h3>
            <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="flex flex-col gap-4"
            >
                <label htmlFor="query" className="block text-sm font-medium text-gray-700">
                    Título ou Diretor para Busca (Full-text)
                </label>
                
                <input
                    id="query"
                    type="text"
                    placeholder="Ex: Superman, Duna, Nolan..."
                    {...register("query", { required: "A busca é obrigatória." })}
                    className={`w-full p-3 border-2 rounded-lg transition duration-200 focus:outline-none focus:ring-2 ${
                        errors.query ? 'border-red-500' : 'border-gray-300 focus:border-indigo-500'
                    }`}
                    disabled={isSubmitting}
                />
                
                {errors.query && (
                    <p className="text-red-600 text-xs font-medium">{errors.query.message}</p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition disabled:opacity-50"
                >
                    {isSubmitting ? 'Buscando...' : 'Buscar Filmes'}
                </button>
            </form>
        </div>
    );
};

export default SearchForm;