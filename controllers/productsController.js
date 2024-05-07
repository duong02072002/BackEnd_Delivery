const Product = require('../models/product');
const storage = require('../utils/cloud_storage');
const asyncForEach = require('../utils/async_foreach');


module.exports = {

    findByCategory(req, res) {
        const id_category = req.params.id_category;

        Product.findByCategory(id_category, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'There Was An Error When Listing The Categories',
                    error: err
                });
            }

            return res.status(201).json(data);
        });
    },

    findByNameAndCategory(req, res) {
        const id_category = req.params.id_category;
        const name = req.params.name;

        Product.findByNameAndCategory(name, id_category, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'There Was An Error When Listing The Categories',
                    error: err
                });
            }

            return res.status(201).json(data);
        });
    },

    create(req, res) {

        const product = JSON.parse(req.body.product); // TÔI LẤY DỮ LIỆU KHÁCH HÀNG GỬI CHO TÔI
        const files = req.files;

        let inserts = 0;

        if (files.length === 0) {
            return res.status(501).json({
                success: false,
                message: 'Error When Registering The Product Does Not Have Images',
            });
        }
        else {
            Product.create(product, (err, id_product) => {


                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'There Was An Error With The Product Registration',
                        error: err
                    });
                }

                product.id = id_product;
                const start = async () => {
                    await asyncForEach(files, async (file) => {
                        const path = `image_${Date.now()}`;
                        const url = await storage(file, path);

                        if (url != undefined && url != null) { // TẠO HÌNH ẢNH TRONG FIREBASE
                            if (inserts == 0) { // ảnh 1
                                product.image1 = url;
                            }
                            else if (inserts == 1) { // ảnh 2
                                product.image2 = url;
                            }
                            else if (inserts == 2) { // ảnh 3
                                product.image3 = url;
                            }
                        }

                        await Product.update(product, (err, data) => {
                            if (err) {
                                return res.status(501).json({
                                    success: false,
                                    message: 'There Was An Error With The Product Registration',
                                    error: err
                                });
                            }

                            inserts = inserts + 1;

                            if (inserts == files.length) { //ĐÃ LƯU TRỮ ĐƯỢC BA HÌNH ẢNH
                                return res.status(201).json({
                                    success: true,
                                    message: 'The Product was Stored Correctly',
                                    data: data
                                });
                            }

                        });
                    });
                }

                start();

            });
        }

    }

}