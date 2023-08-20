import React, { useState, useEffect } from 'react';
import { Box, Button, Container, TextField, Stepper, Step, StepLabel, Typography, Alert } from '@mui/material';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import CustomModal from '../CustomModal';

const QS = [
  'What is your name?',
  'Where are you from?',
  'What is your favorite color?',
  'What is your hobby?',
  'What is your hobby What is your hobby What is your hobby What is your hobby What is your hobby What is your hobby What is your hobby What is your hobby What is your hobby?'
];

const ChatInterview = ({ questions = QS, handleBackStep }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [open, setOpen] = useState(false);
  const [beginModalOpen, setBeginModalOpen] = useState(true);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [timer, setTimer] = useState(0);

  const formik = useFormik({
    initialValues: {
      answers: Array(questions.length).fill('')
    },
    onSubmit: (values) => {
      // Convert form data to an array of objects
      const answersArray = values.answers.map((answer, index) => ({
        question: questions[index],
        answer
      }));
      console.log(answersArray);
    }
  });

  useEffect(() => {
    if (interviewStarted) {
      const id = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
      setIntervalId(id); // Store the interval ID in state
      return () => {
        clearInterval(id); // Clear the interval when the component unmounts or interviewStarted changes
      };
    }
  }, [interviewStarted]);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (formik.values.answers[activeStep] !== '') {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    clearInterval(intervalId);
    formik.handleSubmit();
    handleNext();
    handleClose();
  };

  const handleBeginInterview = () => {
    setBeginModalOpen(false);
    setInterviewStarted(true);
  };
  return (
    <Container>
      <CustomModal
        open={beginModalOpen}
        handleClose={handleBackStep}
        message="Begin Interview?"
        subtitle=""
        disableBackdropClick
        onConfirm={handleBeginInterview}
      />
      <CustomModal
        open={open}
        handleClose={handleClose}
        message="Are you sure you want to submit your answers?"
        subtitle="(No corrections/alterations to the answers can be made after this)"
        onConfirm={handleConfirm}
      />
      <Stepper sx={{ display: 'flex', flexWrap: 'wrap' }} activeStep={activeStep}>
        {questions.map((question, index) => (
          <Step sx={{ display: 'flex', flexWrap: 'wrap' }} key={index}>
            <StepLabel>
              <span style={{ fontSize: '19px', fontWeight: 'bold' }}>{`${questions.length > 5 ? 'Q' : 'Question'} ${index + 1}`}</span>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === questions.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
          <Alert sx={{ mt: 3 }} variant="filled" severity="success">
            <Typography variant="h5">Thank you for answering all questions!</Typography>
            <Typography variant="caption" sx={{ mt: 2 }}>
              Total Interview Time: {formatTime(timer)} {/* Calculate total elapsed time */}
            </Typography>
          </Alert>
        </Box>
      ) : (
        <Box>
          <Box sx={{ display: 'flex', maxWidth: '100%', flexWrap: 'wrap' }}>
            <Typography
              sx={{
                my: 2,
                ml: 1,
                backgroundColor: '#5e35b1',
                color: '#fff',
                p: 1.7,
                borderRadius: '15px',
                fontSize: '22px',
                fontWeight: 500,
                lineHeight: 1.5,
                boxShadow: '5'
              }}
              variant="body3"
            >
              Q {activeStep + 1} : {questions[activeStep]}
            </Typography>
          </Box>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              label="Answer"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={formik.values.answers[activeStep]}
              onChange={formik.handleChange}
              error={formik.touched.answers && formik.errors.answers && formik.touched.answers[activeStep]}
              helperText={
                formik.touched.answers && formik.errors.answers && formik.touched.answers[activeStep] && formik.errors.answers[activeStep]
              }
              sx={{ marginY: 2 }}
              name={`answers[${activeStep}]`}
              disabled={!interviewStarted}
            />
            <Box>
              <Button disabled={activeStep === 0} onClick={handleBack} sx={{ marginRight: 2 }}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={activeStep === questions.length - 1 ? handleOpen : handleNext}
                disabled={formik.values.answers[activeStep] === '' || !interviewStarted}
              >
                {activeStep === questions.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </form>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Interview Started: {formatTime(timer)} {/* Update this line */}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

ChatInterview.propTypes = {
  questions: PropTypes.array,
  handleBackStep: PropTypes.func
};

export default ChatInterview;