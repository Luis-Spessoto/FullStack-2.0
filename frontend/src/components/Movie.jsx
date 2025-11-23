import React from 'react';

const Movie = ({ movie }) => {
    const imageUrl = movie.posterUrl 
        ? movie.posterUrl 
        : "https://placehold.co/500x750/1e293b/ffffff?text=Poster+Not+Found"
    const director = movie.director || 'N/A';
    const genre = movie.genre || 'N/A';
    const year = movie.year || 'N/A';

    return (
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-indigo-400 transform hover:scale-[1.02] transition duration-300">
            <img
                src={imageUrl}
                alt={`Poster de ${movie.title}`}
                className="w-full h-40 object-cover object-center bg-gray-700"
            />
            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1 truncate" title={movie.title}>
                    {movie.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-1">
                    Ano: <span className="font-semibold">{year}</span>
                </p>
                
                <p className="text-xs text-gray-500 mb-1">
                    Dir.: <span className="font-medium">{director}</span>
                </p>
                
                <span className="text-xs font-medium text-indigo-700 bg-indigo-100 py-1 px-2 rounded-full mt-2 inline-block">
                    {genre}
                </span>

                <div className="mt-3 text-xs text-gray-400">
                    ID: {movie.imdbID}
                </div>
            </div>
        </div>
    );
};

export default Movie;