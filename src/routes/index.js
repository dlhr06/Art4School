const express = require('express');
const router = express.Router();
const User = require('../models/InicioSesionBD');
const passport = require('passport');
const { isAuthenticated } = require('../helpers/auth');



router.get('/', (req, res) => {
    res.render('index');
});

router.get('/aboutUS', (req, res) => {
    res.render('aboutUs');
});

router.get('/ResetPassword', (req, res) => {
    res.render('user/resetPassword');
});

router.get('/ChangePassword', async (req, res) => {
    const usuario = await User.findById(req.user.id).lean()
    res.render('user/changePassword', {usuario});

});



module.exports = router;