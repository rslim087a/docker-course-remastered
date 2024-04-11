import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link } from 'react-router-dom';
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
  submitButton: {
    marginTop: theme.spacing(4),
    width: '100%',
  },
}));

const Contact = () => {
  const classes = useStyles();
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [introMessage, setIntroMessage] = useState('');

  useEffect(() => {
    const fetchIntroMessage = async () => {
      try {
        const response = await fetch('/api/contact-message');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }  
        const data = await response.json();
        setIntroMessage(data.message);
      } catch (error) {
        console.error('Error fetching intro message:', error);
        toast.error('Unable to access Contact API', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    fetchIntroMessage();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/contact-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const data = await response.json();
      if (data.status === 'success') {
        setSubmitted(true);
      } else {
        console.error('Submission failed:', data.message);
      }
    } catch (error) {
      toast.error('Error submitting contact form', {
        position: "top-right",
        autoClose: 3000,
      });
      console.error('Error submitting contact form:', error);
    }
  };

  if (submitted) {
    return (
      <Container maxWidth="sm" className={classes.container}>
        <Paper className={classes.paper}>
          <Typography variant="h4" component="h1" className={classes.header}>
            Thank you for contacting us!
          </Typography>
          <Typography variant="body1" align="center">
            Your message has been successfully submitted. Our support team will get back to you as soon as possible.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            className={classes.submitButton}
            component={Link}
            to="/"
          >
            Back to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" className={classes.container}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        className={classes.backButton}
        component={Link}
        to="/"
      >
        Back
      </Button>
      <Paper className={classes.paper}>
        <Typography variant="h4" component="h1" className={classes.header}>
          Contact Us
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          {introMessage}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="subject"
                label="Subject"
                fullWidth
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="body"
                label="Message"
                fullWidth
                multiline
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                variant="outlined"
              />
            </Grid>
            </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submitButton}
          >
            Submit
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Contact;
