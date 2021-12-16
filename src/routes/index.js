const express = require ('express');
const router = express.Router();

router.get('/', (req,res) => {
    res.render('index');
});

router.get('/aboutUS', (req,res) => {
    res.render('aboutUs');
});


module.exports = router;