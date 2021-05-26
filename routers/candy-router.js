const express = require('express');
const router = express.Router();
const candyCtrl = require('../controllers/candy-ctrl');
const checkAuth = require('../middlewares/checkAuth');
const checkGrant = require('../middlewares/checkGrant');
const upload = require('../middlewares/uploadImage');

router.post('/candies' , checkAuth.allowIfLoggedin , checkGrant.grantAccess('updateOwn' , 'shop') , candyCtrl.updateCandiesCounts);
router.post('/candy' , checkAuth.allowIfLoggedin , checkGrant.grantAccess('updateAny' , 'shop') , upload.single('image') , candyCtrl.addCandy);
router.get('/candies' , candyCtrl.getCandies);
router.delete('/candy/:id', checkAuth.allowIfLoggedin , checkGrant.grantAccess('deleteAny' , 'shop') , candyCtrl.deleteCandy);
router.put('/candy/:id', checkAuth.allowIfLoggedin , checkGrant.grantAccess('updateAny' , 'shop') , candyCtrl.updateCandy);

module.exports = router;