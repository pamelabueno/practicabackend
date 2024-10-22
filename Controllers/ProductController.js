const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('../node_modules/uuid');

const productsFilePath = path.join(__dirname, '../data/products.json');

// Leer productos desde el archivo JSON
const getProductsFromFile = () => {
  const data = fs.readFileSync(productsFilePath, 'utf-8');
  return JSON.parse(data);
};

// Guardar productos en el archivo JSON
const saveProductsToFile = (products) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

exports.getAllProducts = (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : null;
  const products = getProductsFromFile();
  res.json(limit ? products.slice(0, limit) : products);
};

exports.getProductById = (req, res) => {
  const { pid } = req.params;
  const products = getProductsFromFile();
  const product = products.find(p => p.id === pid);
  
  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }
  
  res.json(product);
};

exports.addProduct = (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios, excepto thumbnails' });
  }

  const newProduct = {
    id: uuidv4(),
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    thumbnails: thumbnails || []
  };

  const products = getProductsFromFile();
  products.push(newProduct);
  saveProductsToFile(products);
  
  res.status(201).json({ message: 'Producto agregado exitosamente', product: newProduct });
};

exports.updateProduct = (req, res) => {
  const { pid } = req.params;
  const products = getProductsFromFile();
  const productIndex = products.findIndex(p => p.id === pid);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  const updatedProduct = { ...products[productIndex], ...req.body, id: products[productIndex].id };
  products[productIndex] = updatedProduct;
  saveProductsToFile(products);

  res.json({ message: 'Producto actualizado', product: updatedProduct });
};

exports.deleteProduct = (req, res) => {
  const { pid } = req.params;
  const products = getProductsFromFile();
  const filteredProducts = products.filter(p => p.id !== pid);

  if (filteredProducts.length === products.length) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  saveProductsToFile(filteredProducts);
  res.json({ message: 'Producto eliminado' });
};
