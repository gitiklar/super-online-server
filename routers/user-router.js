const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user-ctrl');

router.post('/user' , userCtrl.signUp);
router.post('/login' , userCtrl.login);
router.get('/user/:id' , userCtrl.getUser);

module.exports = router;