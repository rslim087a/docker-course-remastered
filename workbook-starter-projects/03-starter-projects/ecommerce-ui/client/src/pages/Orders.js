import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  header: {
    marginBottom: theme.spacing(4),
    textAlign: 'center',
  },
  cartItems: {
    marginBottom: theme.spacing(4),
  },
  cartItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  itemName: {
    fontWeight: 'bold',
  },
  itemPrice: {
    color: theme.palette.text.secondary,
  },
  summary: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: theme.spacing(4),
  },
  summaryItem: {
    marginBottom: theme.spacing(1),
  },
  totalLabel: {
    fontWeight: 'bold',
  },
  placeOrderButton: {
    marginTop: theme.spacing(4),
  },
  backButton: {
    marginBottom: theme.spacing(2),
    alignSelf: 'flex-start',
  },
}));

const Orders = () => {
  const classes = useStyles();
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingTotal, setShippingTotal] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`/api/orders/${user.id}/cart`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const data = await response.json();
      setCartItems(data);
      calculateTotals();
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast.error('Error accessing API', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const calculateTotals = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      
      const subtotalResponse = await fetch(`/api/orders/${user.id}/cart/subtotal`);
      if (!subtotalResponse.ok) {
        const errorData = await subtotalResponse.json();
        throw new Error(errorData.error);
      }

      const subtotal = await subtotalResponse.json();
      setSubtotal(subtotal);
  
      const shippingResponse = await fetch(`/api/orders/${user.id}/cart/shipping`);
      const shippingTotal = await shippingResponse.json();
      setShippingTotal(shippingTotal);
      
    } catch (error) {
      console.error('Error calculating totals:', error);
      toast.error('Error accessing API', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
    
  const placeOrder = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`/api/orders/${user.id}/purchase`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      setOrderPlaced(true);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Error accessing API', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (orderPlaced) {
    return (
      <Container maxWidth="sm" className={classes.container}>
        <Paper className={classes.paper}>
          <Typography variant="h4" className={classes.header}>
            Order Placed Successfully!
          </Typography>
          <Typography variant="body1" align="center">
            Thank you for your purchase.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/"
            className={classes.placeOrderButton}
          >
            Back to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className={classes.container}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        className={classes.backButton}
        component={Link}
        to="/"
      >
        Back to Home
      </Button>
      <Paper className={classes.paper}>
        <Typography variant="h4" className={classes.header}>
          My Cart
        </Typography>
        {cartItems.length === 0 ? (
          <Typography variant="body1" align="center">
            Your cart is empty.
          </Typography>
        ) : (
          <>
            <div className={classes.cartItems}>
              {cartItems.map((item) => (
                <div key={item.id} className={classes.cartItem}>
                  <Typography variant="body1" className={classes.itemName}>
                    {item.name}
                  </Typography>
                  <Typography variant="body1" className={classes.itemPrice}>
                    ${item.price.toFixed(2)}
                  </Typography>
                </div>
              ))}
            </div>
            <div className={classes.summary}>
              <Typography variant="body1" className={classes.summaryItem}>
                Subtotal: ${subtotal.toFixed(2)}
              </Typography>
              <Typography variant="body1" className={classes.summaryItem}>
                Shipping: ${shippingTotal.toFixed(2)}
              </Typography>
              <Typography variant="h6" className={classes.summaryItem}>
                <span className={classes.totalLabel}>Total:</span> ${(subtotal + shippingTotal).toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={placeOrder}
                className={classes.placeOrderButton}
              >
                Place Order
              </Button>
            </div>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Orders;