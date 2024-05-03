const productsController = require('../controllers/productsController');
const passport = require('passport');

module.exports = (app, upload) => {

    // GET -> NHẬN DỮ LIỆU
    // POST -> LƯU TRỮ DỮ LIỆU
    // PUT -> CẬP NHẬT DỮ LIỆU
    // DELETE -> XÓA DỮ LIỆU

    app.post('/api/products/create', passport.authenticate('jwt', { session: false }), upload.array('image', 3), productsController.create);


}