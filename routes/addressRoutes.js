const addressController = require('../controllers/addressController');
const passport = require('passport');

module.exports = (app) => {

    // GET -> NHẬN DỮ LIỆU
    // POST -> LƯU TRỮ DỮ LIỆU
    // PUT -> CẬP NHẬT DỮ LIỆU
    // DELETE -> XÓA DỮ LIỆU

    app.get('/api/address/findByUser/:id_user', passport.authenticate('jwt', { session: false }), addressController.findByUser);

    app.post('/api/address/create', passport.authenticate('jwt', { session: false }), addressController.create);


}