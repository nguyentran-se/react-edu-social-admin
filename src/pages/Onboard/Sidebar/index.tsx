import { useContext } from 'react';
import { SidebarContext } from 'src/contexts/SidebarContext';

import Check from '@mui/icons-material/Check';
import SettingsIcon from '@mui/icons-material/Settings';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Step from '@mui/material/Step';
import { StepIconProps } from '@mui/material/StepIcon';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import { styled, useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router';
import { StepEnum, useStepperContext } from 'src/contexts/StepperContext';
import Typography from '@mui/material/Typography';
const SidebarWrapper = styled(Box)(
  ({ theme }) => `
        width: 500px;
        min-width: ${theme.sidebar.width};
        color: ${theme.colors.alpha.trueWhite[70]};
        position: relative;
        z-index: 7;
        height: 100%;
        `,
  // padding-bottom: 68px;
);

function Sidebar() {
  const theme = useTheme();
  const { activeStep } = useStepperContext();
  const navigate = useNavigate();
  return (
    <>
      <SidebarWrapper
        sx={{
          display: { lg: 'inline-block' },
          position: 'fixed',
          left: 0,
          top: 0,
          // background: '#fff',
          boxShadow: '0px 2px 6px 0px #747474',
          background: 'url("/static/images/undraw_onboarding.svg")',
          backgroundPosition: 'center',
          backgroundSize: '300px 100vh',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Box sx={{ px: 2 }}>
          <Box mt={5}>
            <Box mx={2} sx={{ width: 52 }}></Box>
          </Box>
          <Typography sx={{ mb: 1 }} variant="h3" color="initial" align="center">
            Welcome to FUniverse
          </Typography>
          {activeStep === StepEnum.Step1 && (
            <Typography variant="body1" color="initial" align="center">
              In the context of universities and academic schedules, a "season" refers to a period
              of time in which classes are held and students attend courses. For example, the
              academic year is typically divided into three semesters - Spring, Summer and Fall -
              with each semester lasting around 16 weeks. Defining season help us to create a
              structured and organized schedule for students and faculty.
            </Typography>
          )}
          {activeStep === StepEnum.Step2 && (
            <Typography variant="body1" color="initial" align="center">
              To successfully utilize the features of this platform, it is important to first
              configure your current term, which will enable you to properly manage your academic
              calendar and schedules. Additionally, it is highly recommended to configure your email
              domain to ensure seamless communication and to avoid any potential issues related to
              email delivery.
            </Typography>
          )}
          {activeStep === StepEnum.Step3 && (
            <Typography variant="body1" color="initial" align="center">
              In the final step of the setup process, we kindly request that you provide the time
              configuration for your workspace. This is an important step in ensuring that all
              features and functionalities are optimized for your needs. This will help to ensure
              that all time-sensitive tasks, such as scheduling, notification delivery, and
              reporting, are executed accurately and efficiently.
            </Typography>
          )}
          {/* <Divider
            sx={{
              mt: '40px',
              mx: theme.spacing(2),
              background: theme.colors.alpha.trueWhite[10],
            }}
          /> */}
          {/* <SidebarMenu /> */}
          {/* <Box sx={{ px: 4, textAlign: 'center' }}>
           
            <Button variant="outlined" color="primary" sx={{ mt: 8 }} onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </Box> */}
        </Box>
      </SidebarWrapper>
    </>
  );
}

export default Sidebar;
