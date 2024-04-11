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
  Typography,
  Container,
  Box,
  Avatar,
  Button,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
  },
  backButton: {
    marginRight: 'auto',
  },
  title: {
    flexGrow: 1,
    textAlign: 'center',
  },
  tableHeader: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    color: 'inherit',
  },
  productImage: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    marginRight: theme.spacing(2),
  },
  inventoryCell: {
    fontWeight: 'bold',
  },
  lowInventory: {
    color: theme.palette.error.main,
  },
}));

const Inventory = () => {
  const classes = useStyles();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchInventoryAndProducts();
  }, []);

  const fetchInventoryAndProducts = async () => {
    try {
      const response = await fetch('/api/inventory');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const getProductImage = (productName) => {
    return `/images/products/${productName}.webp`;
  };

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Box className={classes.header}>
        <Button component={Link} to="/" className={classes.backButton} variant="outlined">
          &larr; Back to Homepage
        </Button>
        <Typography variant="h4" component="h1" className={classes.title}></Typography>
      </Box>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell className={classes.tableHeaderCell}>Product</TableCell>
              <TableCell className={classes.tableHeaderCell}>Name</TableCell>
              <TableCell className={classes.tableHeaderCell}>Description</TableCell>
              <TableCell className={classes.tableHeaderCell}>Price</TableCell>
              <TableCell className={classes.tableHeaderCell}>Category</TableCell>
              <TableCell className={classes.tableHeaderCell}>Inventory</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Avatar src={getProductImage(product.name)} alt={product.name} className={classes.productImage} />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{`$${product.price.toFixed(2)}`}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell
                  className={`${classes.inventoryCell} ${product.quantity <= 10 ? classes.lowInventory : ''}`}
                >
                  {product.quantity}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Inventory;