import React, { useState } from 'react';
import { Container, Typography, Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
  },
  toggleButton: {
    marginTop: theme.spacing(2),
  },
}));

const AuthPage = ({ setIsAuthenticated, setUser }) => {
  const classes = useStyles();
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSignUp = async (formData) => {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const data = await response.json();
      console.log(data.message);
      toast.success('Sign up successful. Please sign in.', {
        position: "top-right",
        autoClose: 3000,
      });
      setIsSignUp(false);
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleSignIn = async (formData) => {
    try {
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const data = await response.json();
      console.log(data.message);
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsAuthenticated(true);
        setUser(data.user);
        window.location.href = '/';
      } else {
        console.error('Unexpected server response format');
        toast.error('Unexpected server response format.', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <Container maxWidth="sm" className={classes.container}>
      <Typography variant="h4" align="center" gutterBottom>
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </Typography>
      {isSignUp ? (
        <SignUpForm onSignUp={handleSignUp} />
      ) : (
        <SignInForm onSignIn={handleSignIn} />
      )}
      <Grid container justify="center">
        <Button variant="text" className={classes.toggleButton} onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Already have an account? Sign In' : 'Create an account'}
        </Button>
      </Grid>
    </Container>
  );
};

export default AuthPage;