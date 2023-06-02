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
import { useStepperContext } from 'src/contexts/StepperContext';
const SidebarWrapper = styled(Box)(
  ({ theme }) => `
        width: ${theme.sidebar.width};
        min-width: ${theme.sidebar.width};
        color: ${theme.colors.alpha.trueWhite[70]};
        position: relative;
        z-index: 7;
        height: 100%;
        `,
  // padding-bottom: 68px;
);
const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState?.active && {
    backgroundImage:
      'linear-gradient(to right bottom, #5569ff, #8181f3, #9f99e7, #b7b2da, #cccccc);',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState?.completed && {
    backgroundImage:
      'linear-gradient(to right bottom, #5569ff, #8181f3, #9f99e7, #b7b2da, #cccccc);',
  }),
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <SettingsIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}
function Sidebar() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const closeSidebar = () => toggleSidebar();
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
          background: '#fff',
          boxShadow: '0px 2px 6px 0px #747474',
        }}
      >
        <Box>
          <Box mt={3}>
            <Box mx={2} sx={{ width: 52 }}></Box>
          </Box>
          <Divider
            sx={{
              mt: '40px',
              mx: theme.spacing(2),
              background: theme.colors.alpha.trueWhite[10],
            }}
          />
          {/* <SidebarMenu /> */}
          <Box sx={{ px: 4, textAlign: 'center' }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              <Step>
                <StepLabel StepIconComponent={ColorlibStepIcon} sx={{ fontWeight: 600 }}>
                  Group Configurations
                </StepLabel>
              </Step>
              {/* <Step>
                <StepLabel>Teacher Assign</StepLabel>
              </Step>
              <Step>
                <StepLabel>Slots</StepLabel>
              </Step> */}
            </Stepper>
            <Button variant="outlined" color="primary" sx={{ mt: 8 }} onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </Box>
        </Box>
      </SidebarWrapper>
    </>
  );
}

export default Sidebar;
