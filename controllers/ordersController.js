const Order = require('../models/order');
const OrderHasProducts = require('../models/order_has_products');
const User = require('../models/user');

module.exports = {

    async getTotalSales(req, res) {
        OrderHasProducts.getTotalSales((err, data) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve total sales',
                    error: err.message
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Successfully retrieved total sales',
                total_quantity_sold: data.total_quantity_sold,
                total_sales_amount: data.total_sales_amount
            });
        });
    },

    findByStatus(req, res) {
        const status = req.params.status;

        Order.findByStatus(status, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'There was an error when listing the orders',
                    error: err
                });
            }

            for (const d of data) {
                d.address = JSON.parse(d.address);
                d.client = JSON.parse(d.client);
                d.delivery = JSON.parse(d.delivery);
                d.products = JSON.parse(d.products);
            }


            return res.status(201).json(data);
        });
    },

    findByDeliveryAndStatus(req, res) {
        const id_delivery = req.params.id_delivery;
        const status = req.params.status;

        Order.findByDeliveryAndStatus(id_delivery, status, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'There was an error when listing the orders',
                    error: err
                });
            }

            for (const d of data) {
                d.address = JSON.parse(d.address);
                d.client = JSON.parse(d.client);
                d.delivery = JSON.parse(d.delivery);
                d.products = JSON.parse(d.products);
            }


            return res.status(201).json(data);
        });
    },

    findByClientAndStatus(req, res) {
        const id_client = req.params.id_client;
        const status = req.params.status;

        Order.findByClientAndStatus(id_client, status, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'There was an error when listing the orders',
                    error: err
                });
            }

            for (const d of data) {
                d.address = JSON.parse(d.address);
                d.client = JSON.parse(d.client);
                d.delivery = JSON.parse(d.delivery);
                d.products = JSON.parse(d.products);
            }


            return res.status(201).json(data);
        });
    },

    async create(req, res) {

        const order = req.body;

        Order.create(order, async (err, id) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'There was an error when creating the order',
                    error: err
                });
            }

            for (const product of order.products) {
                await OrderHasProducts.create(id, product.id, product.quantity, (err, id_data) => {
                    if (err) {
                        return res.status(501).json({
                            success: false,
                            message: 'There was an error with the creation of the products in the order',
                            error: err
                        });
                    }
                });
            }

            return res.status(201).json({
                success: true,
                message: 'The order has been created successfully',
                data: `${id}` // ID CỦA DANH MỤC MỚI
            });

        });

    },

    updateToDispatched(req, res) {
        const order = req.body;

        Order.updateToDispatched(order.id, order.id_delivery, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'There was an error when updating the order',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'The order has been updated successfully',
                data: `${id_order}` // EL ID 
            });

        });
    },

    updateToOnTheWay(req, res) {
        const order = req.body;


        Order.updateToOnTheWay(order.id, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'There was an error when updating the order',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'The order has been updated successfully',
                data: `${id_order}` // EL ID 
            });

        });
    },

    updateToDelivered(req, res) {
        const order = req.body;

        Order.updateToDelivered(order.id, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'There was an error when updating the order',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'The order has been updated successfully',
                data: `${id_order}` // EL ID 
            });

        });
    },

    updateLatLng(req, res) {
        const order = req.body;

        Order.updateLatLng(order, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'There was an error when updating the order',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'The order has been updated successfully',
                data: `${id_order}` // EL ID 
            });

        });
    }

}