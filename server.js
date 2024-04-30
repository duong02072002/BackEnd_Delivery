const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const multer = require('multer');

/*
* IMPORT ROUTES
*/
const usersRoutes = require('./routes/userRoutes');

const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


app.use(cors());

// Thêm để k bị lỗi session
const session = require('express-session');
app.use(session({
    secret: 'your_secret_key_here',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.disable('x-powered-by');

app.set('port', port);

const upload = multer({
    storage: multer.memoryStorage()
});

/*
* CALL OF THE ROUTES
*/
usersRoutes(app, upload);


server.listen(port, '192.168.1.6' || 'localhost', function () {
    console.log('NodeJS Application ' + port + ' Started...')
});


// XỬ LÝ LỖI
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

app.get('/', (req, res) => {
    res.send('Backend root path');
});


module.exports = {
    app: app,
    server: server
}

// 200 - ĐÂY LÀ TRẢ LỜI THÀNH CÔNG
// 404 - NGHĨA LÀ URL KHÔNG TỒN TẠI
// 500 - LỖI MÁY CHỦ NỘI BỘ