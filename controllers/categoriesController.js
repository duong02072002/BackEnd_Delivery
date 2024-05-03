const Category = require('../models/category');

module.exports = {

    create(req, res) {

        const category = req.body;

        Category.create(category, (err, id) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'There Was An Error With The User Registration',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'The Category Was Created Correctly',
                data: `${id}` // ID CỦA DANH MỤC MỚI
            });

        });

    }

}