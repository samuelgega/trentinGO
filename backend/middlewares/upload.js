const multer = require('multer');
const path = require('path');

//dove e come salvare i file caricati
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Crea un nome random per evitare conflitti tra i file caricati
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

//filtro per accettare solo immagini
const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Formato non supportato. Carica solo immagini.'));
        }
    }
});

module.exports = upload;