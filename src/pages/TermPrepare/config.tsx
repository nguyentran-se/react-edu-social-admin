import { StepEnum } from 'src/contexts/StepperContext';
import Step1 from './Step1';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Step2 from './Step2';

export const stepConfigs = [
  {
    condition: (activeStep: StepEnum) => activeStep === StepEnum.Step1,
    component: <Step1 />,
    header: <StepHeader heading={'Group Configurations'} />,
  },
  // {
  //   condition: (activeStep: StepEnum) => activeStep === StepEnum.Step2,
  //   component: <Step2 />,
  //   header: <StepHeader heading={'Teacher Assigning'} />,
  // },
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
