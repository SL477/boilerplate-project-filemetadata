'use strict';

import express from 'express';
import cors from 'cors';
import fs from 'fs';

// require and use "multer"...
const app = express();
// multer
import multer, { diskStorage } from 'multer';

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/hello', function (req, res) {
    res.json({ greetings: 'Hello, API' });
});

// set storage
const storage = diskStorage({
    destination: function (req, filename, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.filename + '-' + Date.now());
    },
});
const upload = multer({ storage: storage });

// Remove files after use
app.use(function (req, res, next) {
    const writeJson = res.json;
    const writeJsonBound = writeJson.bind(res);
    res.json = function (body) {
        if (req.file) {
            fs.unlink(req.file.path, function (err) {
                if (err) {
                    console.error(err);
                }
            });
        }
        writeJsonBound(body);
    };
    next();
});

// Setup the post request
app.post('/api/fileanalyse', upload.single('upfile'), function (req, res) {
    console.log(req.file);
    res.json({
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size,
    });
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Node.js listening ...');
});
