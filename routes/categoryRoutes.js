const categoriesController = require('../controllers/categoriesController');
const passport = require('passport');

module.exports = (app) => {

    // GET -> NHẬN DỮ LIỆU
    // POST -> LƯU TRỮ DỮ LIỆU
    // PUT -> CẬP NHẬT DỮ LIỆU
    // DELETE -> XÓA DỮ LIỆU

    app.post('/api/categories/create', passport.authenticate('jwt', { session: false }), categoriesController.create);


}