import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Button, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {  toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(6),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  paper: {
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[3],
    maxWidth: 800,
    width: '100%',
  },
  image: {
    width: '100%',
    maxHeight: 400,
    objectFit: 'cover',
    borderRadius: theme.spacing(1),
  },
  info: {
    marginTop: theme.spacing(4),
  },
  name: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
  },
  description: {
    marginBottom: theme.spacing(2),
  },
  price: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
  },
  category: {
    marginBottom: theme.spacing(2),
  },
  quantity: {
    marginBottom: theme.spacing(4),
  },
  button: {
    marginTop: theme.spacing(2),
  },
  backButton: {
    marginBottom: theme.spacing(2),
    alignSelf: 'flex-start',
  },
}));

const ProductDetail = () => {
  const classes = useStyles();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(null);

  useEffect(() => {
    fetchProduct();
    fetchInventory();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Error accessing API', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await fetch(`/api/inventory/${id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const data = await response.json();
      setQuantity(data.quantity);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setQuantity(0);
      toast.error('Error accessing Inventory API', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const addToCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`/api/orders/${user.id}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const data = await response.text();
      if (data === 'Product already exists in the cart') {
        toast.info(data, {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        toast.success(data, {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error('Error adding product to the cart.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };  
  if (!product) {
    return <Typography variant="body1">Loading...</Typography>;
  }

  return (
    <Container maxWidth="md" className={classes.container}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        className={classes.backButton}
        component={Link}
        to="/products"
      >
        Back to Products
      </Button>
      <Paper className={classes.paper}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <img
              src={`/images/products/${product.name}.webp`}
              alt={product.name}
              className={classes.image}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <div className={classes.info}>
              <Typography variant="h4" className={classes.name}>
                {product.name}
              </Typography>
              <Typography variant="body1" className={classes.description}>
                {product.description}
              </Typography>
              <Typography variant="h6" className={classes.price}>
                Price: ${product.price.toFixed(2)}
              </Typography>
              <Typography variant="body1" className={classes.category}>
                Category: {product.category}
              </Typography>
              <Typography variant="body1" className={classes.quantity}>
                {quantity !== null ? (
                  `In Stock: ${quantity}`
                ) : (
                  'Loading stock quantity...'
                )}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={addToCart}
              >
                Add to Cart
              </Button>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProductDetail;