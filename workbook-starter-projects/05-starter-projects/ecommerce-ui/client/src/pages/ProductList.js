import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import './ProductList.css';
import { toast } from 'react-toastify';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const formatImageName = (name) => {
    return `/images/products/${name}.webp`;
  };

  return (
    <div className="plist-product-list-container">
      <div className="plist-header-container">
        <Button component={Link} to="/" variant="outlined" style={{ marginRight: 'auto' }}>
          &larr; Back to Homepage
        </Button>
      </div>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <Link to={`/products/${product.id}`} key={product.id} className="product-card">
              <div className="product-image">
                <img src={formatImageName(product.name)} alt={product.name} />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;