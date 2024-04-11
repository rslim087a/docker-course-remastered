import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    maxWidth: 600,
    width: '100%',
  },
  header: {
    marginBottom: theme.spacing(4),
    textAlign: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  backButton: {
    marginBottom: theme.spacing(2),
    alignSelf: 'flex-start',
    marginLeft: -theme.spacing(4),
  },
  saveButton: {
    marginTop: theme.spacing(4),
    width: '100%',
  },
}));

const Profile = () => {
  const classes = useStyles();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const data = await response.json();
      console.log(data.message);
      toast.success('Profile updated successfully.', {
        position: "top-right",
        autoClose: 3000,
      });
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile. Please try again.', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (!user) {
    return <Typography variant="body1">Loading...</Typography>;
  }


  return (
    <Container maxWidth="sm" className={classes.container}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        className={classes.backButton}
        onClick={() => window.history.back()}
      >
        Back to Homepage
      </Button>
      <Paper className={classes.paper}>
        <Typography variant="h4" component="h1" className={classes.header}>
          Profile
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                label="First Name"
                fullWidth
                value={user.firstName}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="lastName"
                label="Last Name"
                fullWidth
                value={user.lastName}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="address"
                label="Address"
                fullWidth
                value={user.address}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="postalCode"
                label="Postal Code"
                fullWidth
                value={user.postalCode}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.saveButton}
          >
            Save
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Profile;