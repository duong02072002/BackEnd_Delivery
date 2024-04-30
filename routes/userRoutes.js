const usersController = require('../controllers/usersController');

module.exports = (app, upload) => {

    // GET -> NHẬN DỮ LIỆU
    // POST -> LƯU TRỮ DỮ LIỆU
    // PUT -> CẬP NHẬT DỮ LIỆU
    // DELETE -> XÓA DỮ LIỆU

    app.post('/api/users/create', usersController.register);
    app.post('/api/users/createWithImage', upload.array('image', 1), usersController.registerWithImage);
    app.post('/api/users/login', usersController.login);

}