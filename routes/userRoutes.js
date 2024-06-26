const usersController = require('../controllers/usersController');
const passport = require('passport');

module.exports = (app, upload) => {

    // GET -> NHẬN DỮ LIỆU
    // POST -> LƯU TRỮ DỮ LIỆU
    // PUT -> CẬP NHẬT DỮ LIỆU
    // DELETE -> XÓA DỮ LIỆU
    app.delete('/api/users/delete/:id', passport.authenticate('jwt', { session: false }), usersController.delete);

    app.get('/api/users/findDeliveryMen', passport.authenticate('jwt', { session: false }), usersController.findDeliveryMen);

    app.post('/api/users/create', usersController.register);
    app.post('/api/users/createWithImage', upload.array('image', 1), usersController.registerWithImage);
    app.post('/api/users/createDriverWithImage', upload.array('image', 1), usersController.registerDriverWithImage);
    app.post('/api/users/login', usersController.login);


    // 401 KHÔNG ĐƯỢC PHÉP
    app.put('/api/users/update', passport.authenticate('jwt', { session: false }), upload.array('image', 1), usersController.updateWithImage);
    app.put('/api/users/updateWithoutImage', passport.authenticate('jwt', { session: false }), usersController.updateWithoutImage);
}