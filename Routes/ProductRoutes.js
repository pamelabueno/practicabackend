const express = require('../node_modules/express');
const router = express.Router();
const productController = require('../Controllers/ProductController');


router.get('/', productController.getAllProducts);
router.get('/:pid', productController.getProductById);
router.post('/', productController.addProduct);
router.put('/:pid', productController.updateProduct);
router.delete('/:pid', productController.deleteProduct);

module.exports = router;
