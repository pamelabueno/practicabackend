const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('../node_modules/uuid');

const cartsFilePath = path.join(__dirname, '../data/carts.json');
const productsFilePath = path.join(__dirname, '../data/products.json');

const getCartsFromFile = () => {
  const data = fs.readFileSync(cartsFilePath, 'utf-8');
  return JSON.parse(data);
};

const saveCartsToFile = (carts) => {
  fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
};

exports.createCart = (req, res) => {
  const newCart = {
    id: uuidv4(),
    products: []
  };

  const carts = getCartsFromFile();
  carts.push(newCart);
  saveCartsToFile(carts);

  res.status(201).json({ message: 'Carrito creado exitosamente', cart: newCart });
};

exports.getCartById = (req, res) => {
  const { cid } = req.params;
  const carts = getCartsFromFile();
  const cart = carts.find(c => c.id === cid);

  if (!cart) {
    return res.status(404).json({ message: 'Carrito no encontrado' });
  }

  res.json(cart);
};

exports.addProductToCart = (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  
  const carts = getCartsFromFile();
  const cart = carts.find(c => c.id === cid);
  
  if (!cart) {
    return res.status(404).json({ message: 'Carrito no encontrado' });
  }

  const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
  const product = products.find(p => p.id === pid);

  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  const productInCart = cart.products.find(p => p.product === pid);
  if (productInCart) {
    productInCart.quantity += quantity || 1;
  } else {
    cart.products.push({ product: pid, quantity: quantity || 1 });
  }

  saveCartsToFile(carts);
  res.json({ message: 'Producto agregado al carrito', cart });
};
