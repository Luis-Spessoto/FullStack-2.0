import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '../context/SearchContextAPI';

const Login = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const { login } = useAuthContext();
    const [loginError, setLoginError] = useState(null);

    const onSubmit = async (data) => {
        setLoginError(null);
        const result = await login(data.username, data.password);
        
        if (!result.success) {
            setLoginError(result.message || 'Erro desconhecido. Verifique o servidor.');
        }
    };

    return (
        <div className="flex justify-center items-start min-h-screen pt-20 bg-gray-900">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email/Username</label>
                        <input
                            type="email"
                            placeholder="email@email.com"
                            {...register("username", { required: "Email é obrigatório." })}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Senha</label>
                        <input
                            type="password"
                            placeholder="senha123"
                            {...register("password", { required: "Senha é obrigatória." })}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    {loginError && (
                        <div className="text-red-700 bg-red-100 p-3 rounded-lg text-sm font-semibold">
                            {loginError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Entrando...' : 'Entrar'}
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-4">
                        OBS para logar: <br/>
                        Usuário de teste: admin@site.com <br/>
                        Senha: senha123
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;