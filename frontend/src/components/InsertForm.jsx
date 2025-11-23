import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '../context/SearchContextAPI';

const InsertForm = () => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
    const { insertMovie } = useAuthContext();
    const [statusMessage, setStatusMessage] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const onSubmit = async (data) => {
        setStatusMessage(null);
        const result = await insertMovie(data);
        
        if (result.success) {
            setStatusMessage(result.message);
            setIsSuccess(true);
            reset(); 
        } else {
            setStatusMessage(result.message);
            setIsSuccess(false);
        }
    };

    return (
        <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border-t-4 border-indigo-500">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Inserir Novo Filme</h3>
            
            {statusMessage && (
                <div className={`p-3 mb-4 rounded-lg font-semibold text-sm ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {statusMessage}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                
                <input placeholder="Título (Obrigatório)" {...register("title", { required: true })} 
                    className="w-full p-2 border rounded-lg" />
                {errors.title && <p className="text-red-500 text-xs">Título é obrigatório.</p>}

                <div className="flex gap-4">
                    <input placeholder="Ano (4 dígitos)" {...register("year", { 
                            required: true, 
                            minLength: 4, 
                            maxLength: 4 
                        })} 
                        className="w-1/3 p-2 border rounded-lg" />
                    
                    <input placeholder="IMDB ID (Ex: tt0133093)" {...register("imdbID", { required: true })} 
                        className="w-2/3 p-2 border rounded-lg" />
                </div>
                {(errors.year || errors.imdbID) && <p className="text-red-500 text-xs">Ano (4 dígitos) é obrigatório</p>}

                <input placeholder="Diretor" {...register("director")} className="w-full p-2 border rounded-lg" />
                <input placeholder="Gênero" {...register("genre")} className="w-full p-2 border rounded-lg" />
                <input placeholder="URL do Poster (Opcional)" {...register("posterUrl")} className="w-full p-2 border rounded-lg" />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition disabled:opacity-50"
                >
                    {isSubmitting ? 'Salvando...' : 'Salvar no MongoDB'}
                </button>
            </form>
        </div>
    );
};

export default InsertForm;