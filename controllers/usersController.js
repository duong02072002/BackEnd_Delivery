const User = require('../models/user');
const Rol = require('../models/rol');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const storage = require('../utils/cloud_storage');

module.exports = {

    delete(req, res) {
        const userId = req.params.id;

        User.delete(userId, (err, deletedUserId) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error deleting user',
                    error: err
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: 'User deleted successfully',
                    deletedUserId: deletedUserId
                });
            }
        });
    },

    findDeliveryMen(req, res) {
        User.findDeliveryMen((err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'There was an error when listing the delivery people',
                    error: err
                });
            }


            return res.status(201).json(data);
        });
    },


    login(req, res) {

        const email = req.body.email;
        const password = req.body.password;

        User.findByEmail(email, async (err, myUser) => {

            console.log('Error ', err);
            //console.log('USER ', myUser);

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'There Was An Error With The User Registration',
                    error: err
                });
            }

            if (!myUser) {
                return res.status(401).json({ // KHÁCH HÀNG KHÔNG CÓ QUYỀN ĐỂ THỰC HIỆN YÊU CẦU NÀY (401)
                    success: false,
                    message: 'The Email Was Not Found'
                });
            }

            const isPasswordValid = await bcrypt.compare(password, myUser.password);

            if (isPasswordValid) {
                const token = jwt.sign({ id: myUser.id, email: myUser.email }, keys.secretOrKey, {});

                const data = {
                    id: `${myUser.id}`,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    email: myUser.email,
                    phone: myUser.phone,
                    image: myUser.image,
                    session_token: `JWT ${token}`,
                    roles: JSON.parse(myUser.roles)
                }

                return res.status(201).json({
                    success: true,
                    message: 'The User Was Authenticated',
                    data: data // ID CỦA NGƯỜI DÙNG MỚI ĐĂNG KÝ
                });

            }
            else {
                return res.status(401).json({ // KHÁCH HÀNG KHÔNG CÓ QUYỀN ĐỂ THỰC HIỆN YÊU CẦU NÀY (401)
                    success: false,
                    message: 'The Password Is Incorrect'
                });
            }

        });

    },

    register(req, res) {

        const user = req.body; // LẤY DỮ LIỆU MÀ KHÁCH HÀNG GỬI
        User.create(user, (err, data) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'There Is An Error With The User Registration',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'The Registration Was Completed Successfully',
                data: data // ID CỦA NGƯỜI DÙNG MỚI ĐĂNG KÝ
            });

        });

    },
    async registerWithImage(req, res) {

        const user = JSON.parse(req.body.user); // TÔI LẤY DỮ LIỆU KHÁCH HÀNG GỬI CHO TÔI

        const files = req.files;

        if (files.length > 0) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path);

            if (url != undefined && url != null) {
                user.image = url;
            }
        }

        User.create(user, (err, data) => {


            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'There Was An Error With The User Registration',
                    error: err
                });
            }

            user.id = `${data}`;
            const token = jwt.sign({ id: user.id, email: user.email }, keys.secretOrKey, {});
            user.session_token = `JWT ${token}`;


            Rol.create(user.id, 3, (err, data) => {

                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'There Was An Error With User Role Registration',
                        error: err
                    });
                }

                return res.status(201).json({
                    success: true,
                    message: 'Registration Was Successful',
                    data: user
                });

            });


        });

    },
    async registerDriverWithImage(req, res) {
        const user = JSON.parse(req.body.user); // Lấy dữ liệu mà người dùng gửi

        const files = req.files;

        if (files.length > 0) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path);

            if (url != undefined && url != null) {
                user.image = url;
            }
        }

        User.create(user, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'There Was An Error With The User Registration',
                    error: err
                });
            }

            user.id = `${data}`;
            const token = jwt.sign({ id: user.id, email: user.email }, keys.secretOrKey, {});
            user.session_token = `JWT ${token}`;

            // Tạo vai trò 2 (delivery)
            Rol.create(user.id, 2, async (err, data) => {
                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'There Was An Error With User Role Registration',
                        error: err
                    });
                }

                // Tạo vai trò 3 (client)
                Rol.create(user.id, 3, async (err, data) => {
                    if (err) {
                        return res.status(501).json({
                            success: false,
                            message: 'There Was An Error With User Role Registration',
                            error: err
                        });
                    }

                    return res.status(201).json({
                        success: true,
                        message: 'Registration Was Successful',
                        data: user
                    });
                });
            });
        });
    },
    async updateWithImage(req, res) {

        const user = JSON.parse(req.body.user); // TÔI LẤY DỮ LIỆU KHÁCH HÀNG GỬI CHO TÔI

        const files = req.files;

        if (files.length > 0) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path);

            if (url != undefined && url != null) {
                user.image = url;
            }
        }

        User.update(user, (err, data) => {


            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'There Was An Error With The User Registration',
                    error: err
                });
            }


            User.findById(data, (err, myData) => {
                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'There Was An Error With The User Registration',
                        error: err
                    });
                }

                myData.session_token = user.session_token;
                myData.roles = JSON.parse(myData.roles);

                return res.status(201).json({
                    success: true,
                    message: 'The User Was Updated Successfully',
                    data: myData
                });
            })

        });

    },

    async updateWithoutImage(req, res) {

        const user = req.body; // TÔI LẤY DỮ LIỆU KHÁCH HÀNG GỬI CHO TÔI

        User.updateWithoutImage(user, (err, data) => {


            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'There Was An Error With The User Registration',
                    error: err
                });
            }

            User.findById(data, (err, myData) => {
                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'There Was An Error With The User Registration',
                        error: err
                    });
                }

                myData.session_token = user.session_token;
                myData.roles = JSON.parse(myData.roles);

                return res.status(201).json({
                    success: true,
                    message: 'The User Was Updated Successfully',
                    data: myData
                });
            })


        });

    },
}