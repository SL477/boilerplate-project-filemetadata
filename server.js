'use strict';

var express = require('express');
var cors = require('cors');

// require and use "multer"...

var app = express();
//multer
var multer = require('multer');
/*app.use(multer({
  dest: 'uploads/'
}));*/
//var upload = multer({ dest: 'uploads/'});

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.get('/hello', function(req, res){
  res.json({greetings: "Hello, API"});
});

//set storage
var storage = multer.diskStorage({
  destination: function (req, filename, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.filename + '-' + Date.now())
  }
});
var upload = multer({ storage: storage });

//Setup the post request
app.post("/api/fileanalyse", upload.single('upfile'), function (req, res) {
  console.log(req.file);
  //res.send(req.file);
  res.json({"name": req.file.originalname, "type": req.file.mimetype, "size": req.file.size});
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});
