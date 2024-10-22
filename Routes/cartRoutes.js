const express = require('../node_modules/express');
const router = express.Router();
const cartController = require('../Controllers/CartController');

router.post('/', cartController.createCart);
router.get('/:cid', cartController.getCartById);
router.post('/:cid/product/:pid', cartController.addProductToCart);

module.exports = router;
