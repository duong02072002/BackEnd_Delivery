const OrdersController = require('../controllers/ordersController');
const passport = require('passport');

module.exports = (app) => {

    // GET -> NHẬN DỮ LIỆU
    // POST -> LƯU TRỮ DỮ LIỆU
    // PUT -> CẬP NHẬT DỮ LIỆU
    // DELETE -> XÓA DỮ LIỆU

    app.get('/api/orders/findByStatus/:status', passport.authenticate('jwt', { session: false }), OrdersController.findByStatus);
    app.get('/api/orders/findByDeliveryAndStatus/:id_delivery/:status', passport.authenticate('jwt', { session: false }), OrdersController.findByDeliveryAndStatus);
    app.get('/api/orders/findByClientAndStatus/:id_client/:status', passport.authenticate('jwt', { session: false }), OrdersController.findByClientAndStatus);

    app.post('/api/orders/create', passport.authenticate('jwt', { session: false }), OrdersController.create);

    app.put('/api/orders/updateToDispatched', passport.authenticate('jwt', { session: false }), OrdersController.updateToDispatched);
    app.put('/api/orders/updateToOnTheWay', passport.authenticate('jwt', { session: false }), OrdersController.updateToOnTheWay);
    app.put('/api/orders/updateToDelivered', passport.authenticate('jwt', { session: false }), OrdersController.updateToDelivered);
    app.put('/api/orders/updateLatLng', passport.authenticate('jwt', { session: false }), OrdersController.updateLatLng);

    // Thêm đường dẫn đến phương thức thống kê tổng số lượng đã bán và doanh thu
    app.get('/api/orders/totalSales', passport.authenticate('jwt', { session: false }), OrdersController.getTotalSales);
}