var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Temporary' });
})
router.post('/test',function(req,res){
  res.status(200).send("Test OK!\nData:\n"+JSON.stringify(req.body));
});

module.exports = router;
