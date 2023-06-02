import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Sidebar from './Sidebar';
import { StepEnum, StepperLength, useStepperContext } from 'src/contexts/StepperContext';
import Step from '@mui/material/Step';
import { StepIconProps } from '@mui/material/StepIcon';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import { styled, alpha, lighten, darken, useTheme } from '@mui/material/styles';
// import Step1 from './Step1';
// import Step2 from './Step2';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { termApis } from 'src/apis/termApis';
import { QueryKey, seasonApis } from 'src/apis';
import { stepConfigs } from './config';
import LoadingButton from '@mui/lab/LoadingButton';
import { useAppCookies } from 'src/hooks';
import { appCookies } from 'src/utils';

function OnboardPage() {
  const { activeStep, dispatchStepper } = useStepperContext();
  const theme = useTheme();
  const [cookies] = useAppCookies();

  const seasonsQuery = useQuery({
    queryKey: [QueryKey.Seasons],
    queryFn: seasonApis.getSeasons,
    onSuccess: (response) => {
      if (response.length > 0 && activeStep === StepEnum.Step1) dispatchStepper({ type: 'next' });
    },
    enabled: activeStep === StepEnum.Step1,
  });

  if (cookies.isWorkspaceActive === 'true' || appCookies.getDecodedAccessToken().wstatus === true) {
    window.location.href = '/';
    return null;
  }
  return (
    <Box>
      <Sidebar />
      <Box
        sx={{
          position: 'relative',
          zIndex: 5,
          flex: 1,
          ml: `500px`,
          minHeight: '100vh',
        }}
      >
        <Paper
          sx={{ pt: '32px', px: 5, display: 'flex', flexFlow: 'column', minHeight: '100vh', pb: 2 }}
        >
          <Box>
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={
                {
                  // '.MuiStepper-root': { justifyContent: 'center' },
                  // '.MuiStepConnector-root': {
                  //   flexBasis: '50px',
                  // },
                }
              }
            >
              {stepConfigs.map((s, index) => (
                <Step key={index}>
                  <StepLabel>{s.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          {/* <Box sx={{ px: 3, mb: 3 }}>
            {stepConfigs.find(({ condition }) => condition(activeStep)).header}
          </Box> */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
            <Box sx={{ width: 600 }}>
              {stepConfigs.find(({ condition }) => condition(activeStep)).component}
            </Box>
          </Box>
          <TermActions />
        </Paper>
      </Box>
    </Box>
  );
}

export default OnboardPage;

function TermActions() {
  const { activeStep, dispatchStepper, status } = useStepperContext();
  const isSubmitStepper = activeStep === StepperLength - 1;
  const queryClient = useQueryClient();

  function handleNextClick(e) {
    dispatchStepper({ type: 'change_status', payload: 'pending' });

    switch (activeStep) {
      case StepEnum.Step1:
        break;

      default:
        break;
    }
    // dispatchStepper({ type: 'next' });
  }
  return (
    <Box
      sx={{
        mt: 'auto',
        // ml: 'auto',
        width: '100%',
        pb: 5,
        // pr: 20,
        display: 'flex',
        justifyContent: 'center',
        gap: '0 10px',
        alignItems: 'center',
      }}
    >
      {![StepEnum.Step1, StepEnum.Step2].includes(activeStep) && (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => dispatchStepper({ type: 'back' })}
        >
          Back
        </Button>
      )}
      <LoadingButton
        type="submit"
        form="onboard"
        variant="contained"
        // loading={status === 'pending'}
        // loadingPosition="start"
        onClick={handleNextClick}
      >
        {activeStep === StepEnum.Step3 ? 'Submit' : 'Next'}
      </LoadingButton>
    </Box>
  );
}
