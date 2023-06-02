import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Sidebar from './Sidebar';
import { StepEnum, StepperLength, useStepperContext } from 'src/contexts/StepperContext';
import { styled, alpha, lighten, darken, useTheme } from '@mui/material/styles';
import Step1 from './Step1';
import Step2 from './Step2';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { termApis } from 'src/apis/termApis';
import { QueryKey } from 'src/apis';
import { stepConfigs } from './config';
function TermPreparePage() {
  const { activeStep } = useStepperContext();
  // console.log('🚀 ~ activeStep:', activeStep);
  const theme = useTheme();

  return (
    <Box>
      <Sidebar />
      <Box
        sx={{
          position: 'relative',
          zIndex: 5,
          flex: 1,
          ml: `${theme.sidebar.width}`,
          height: '100vh',
        }}
      >
        <Paper sx={{ pt: '60px', display: 'flex', flexFlow: 'column', minHeight: '100vh' }}>
          <Box sx={{ px: 3, mb: 3 }}>
            {stepConfigs.find(({ condition }) => condition(activeStep)).header}
          </Box>
          <Box sx={{ px: 3, display: 'flex', alignItems: 'center' }}>
            {stepConfigs.find(({ condition }) => condition(activeStep)).component}
            {/* {activeStep === StepEnum.Step1 && <Step1 />}
            {activeStep === StepEnum.Step2 && <Step2 />} */}
          </Box>
          <TermActions />
        </Paper>
      </Box>
    </Box>
  );
}

export default TermPreparePage;

function TermActions() {
  const { activeStep, dispatchStepper } = useStepperContext();
  const isSubmitStepper = activeStep === StepperLength - 1;
  const queryClient = useQueryClient();

  // function handleNextClick() {
  //   console.log('Submit outside awesome')
  //   switch (activeStep) {
  //     case StepEnum.Step1:
  //       // createStartDateMutation.mutate({startDate})
  //       break;

  //     default:
  //       break;
  //   }
  //   if (isSubmitStepper) {
  //     return;
  //   }
  //   dispatchStepper({ type: 'next' });
  // }
  return (
    <Box
      sx={{
        mt: 'auto',
        // ml: 'auto',
        pb: 5,
        pr: 10,
        display: 'flex',
        justifyContent: 'center',
        gap: '0 10px',
        alignItems: 'center',
      }}
    >
      {activeStep !== StepEnum.Step1 && (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => dispatchStepper({ type: 'back' })}
        >
          Back
        </Button>
      )}
      <Button variant="contained" color="primary" type="submit" form="slotsForm">
        Submit
      </Button>
    </Box>
  );
}
