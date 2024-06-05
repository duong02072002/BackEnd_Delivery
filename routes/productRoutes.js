const productsController = require('../controllers/productsController');
const passport = require('passport');

module.exports = (app, upload) => {

    // GET -> NHẬN DỮ LIỆU
    // POST -> LƯU TRỮ DỮ LIỆU
    // PUT -> CẬP NHẬT DỮ LIỆU
    // DELETE -> XÓA DỮ LIỆU
    app.delete('/api/products/delete/:productId', passport.authenticate('jwt', { session: false }), productsController.deleteProduct); // Thêm route cho việc xóa sản phẩm


    app.get('/api/products/findByName/:name', passport.authenticate('jwt', { session: false }), productsController.findByName);
    app.get('/api/products/findAllProducts', passport.authenticate('jwt', { session: false }), productsController.findAllProducts);
    app.get('/api/products/findByCategory/:id_category', passport.authenticate('jwt', { session: false }), productsController.findByCategory);

    app.get('/api/products/findByNameAndCategory/:id_category/:name', passport.authenticate('jwt', { session: false }), productsController.findByNameAndCategory);
    app.post('/api/products/create', passport.authenticate('jwt', { session: false }), upload.array('image', 3), productsController.create);


}