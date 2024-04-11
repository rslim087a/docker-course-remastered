import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Box,
  Button,
  Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import {  toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(6),
  },
  header: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
  },
  backButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  description: {
    marginBottom: theme.spacing(4),
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
  },
  table: {
    minWidth: 650,
  },
  tableHeader: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    color: 'inherit',
  },
  shippingFeeCell: {
    fontWeight: 'bold',
    backgroundColor: theme.palette.action.hover,
  },
  productName: {
    fontWeight: 'bold',
  },
  productDescription: {
    color: theme.palette.text.secondary,
  },
}));

const ShippingHandling = () => {
  const classes = useStyles();
  const [shippingInfo, setShippingInfo] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchShippingInfo();
    fetchProducts();
  }, []);

  const fetchShippingInfo = async () => {
    try {
      const response = await fetch('/api/shipping-explanation');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const data = await response.json();
      setShippingInfo(data.explanation);
    } catch (error) {
      console.error('Error fetching shipping info:', error);
      toast.error('Error accessing Shipping API', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/all-shipping-fees');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error accessing Shipping API', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Box className={classes.header}>
        <Button component={Link} to="/" className={classes.backButton} variant="outlined">
          &larr; Back to Homepage
        </Button>
        <Typography variant="h4" component="h1" className={classes.title}>
          Shipping and Handling
        </Typography>
      </Box>
      <Typography variant="body1" className={classes.description}>
        {shippingInfo}
      </Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table className={classes.table} aria-label="shipping fees table">
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell className={classes.tableHeaderCell}>Product ID</TableCell>
              <TableCell className={classes.tableHeaderCell}>Name</TableCell>
              <TableCell className={classes.tableHeaderCell}>Description</TableCell>
              <TableCell className={classes.tableHeaderCell}>Price</TableCell>
              <TableCell className={classes.tableHeaderCell}>Category</TableCell>
              <TableCell className={classes.tableHeaderCell}>Shipping Fee</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.product_id}>
                <TableCell component="th" scope="row">
                  {product.product_id}
                </TableCell>
                <TableCell className={classes.productName}>{product.name || ''}</TableCell>
                <TableCell className={classes.productDescription}>{product.description || ''}</TableCell>
                <TableCell>{product.price !== undefined ? `$${product.price.toFixed(2)}` : '-'}</TableCell>
                <TableCell>{product.category || ''}</TableCell>
                <TableCell className={classes.shippingFeeCell}>${product.shipping_fee.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ShippingHandling;