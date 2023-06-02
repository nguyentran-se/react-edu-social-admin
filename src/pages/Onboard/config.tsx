import { StepEnum } from 'src/contexts/StepperContext';
// import Step1 from './Step1';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import OnboardStep1 from './Step1';
import OnboardStep2 from './Step2';
import OnboardStep3 from './Step3';
// import Step2 from './Step2';

export const stepConfigs = [
  {
    label: 'Season',
    condition: (activeStep: StepEnum) => activeStep === StepEnum.Step1,
    component: <OnboardStep1 />,
    // header: <StepHeader heading={'Group Configurations'} />,
  },
  {
    label: 'Term',
    condition: (activeStep: StepEnum) => activeStep === StepEnum.Step2,
    component: <OnboardStep2 />,
    // header: <StepHeader heading={'Step 2'} />,
  },
  {
    label: 'Time Configuration',
    condition: (activeStep: StepEnum) => activeStep === StepEnum.Step3,
    component: <OnboardStep3 />,
    // header: <StepHeader heading={'Step 3'} />,
  },
];

function StepHeader({ heading, description }: { heading: string; description?: string }) {
  return (
    <Box>
      <Typography variant="h3" color="initial">
        {heading}
      </Typography>
      <Typography variant="body2" color="initial">
        {description}
      </Typography>
    </Box>
  );
}
