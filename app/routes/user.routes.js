module.exports = (app) => {
    const user = require('../controllers/user.controller.js');
    const multer  = require('multer');
    const upload = multer();

    app.get('/', user.indexPage)

    app.get('/signup', user.getSignUp);

    app.post('/signup', upload.single('profileimage'), user.signUp);

    app.get('/login', user.getLogin);

    app.post('/login', user.login);
}
