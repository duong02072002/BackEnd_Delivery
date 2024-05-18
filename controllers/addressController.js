const Address = require('../models/address');

module.exports = {

    findByUser(req, res) {
        const id_user = req.params.id_user;
        Address.findByUser(id_user, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'There was an error trying to get addresses',
                    error: err
                });
            }

            return res.status(201).json(data);
        })
    },

    create(req, res) {

        const address = req.body;
        console.log('ADDRESS: ', address);

        Address.create(address, (err, id) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'There was an error with the address registration',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'The address was created correctlye',
                data: `${id}` // ID CỦA ĐỊA CHỈ MỚI
            });

        });

    },

}