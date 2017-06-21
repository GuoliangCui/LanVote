/**
 * Created by Administrator on 2017/5/27.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('admin', { title: 'Express' });
});

module.exports = router;