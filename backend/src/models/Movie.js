const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: String,
        required: true
    },
    director: {
        type: String,
        default: 'N/A'
    },
    genre: {
        type: String,
        default: 'N/A'
    },
    imdbID: {
        type: String,
        unique: true
    },
    userId: {
        type: String,
        ref: 'User'
    },
    posterUrl: {
        type: String,
    }
}, { timestamps: true });

//Indice de texto para busca eficiente 
MovieSchema.index({ title: 'text', director: 'text' });

module.exports = mongoose.model('Movie', MovieSchema);