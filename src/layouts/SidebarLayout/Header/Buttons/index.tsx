import { Box } from '@mui/material';
import HeaderSearch from './Search';
import HeaderNotifications from './Notifications';
import Button from '@mui/material/Button';
function HeaderButtons() {
  return (
    <Box sx={{ mr: 1 }}>
      {/* <HeaderSearch /> */}
      <Box sx={{ mx: 0.5 }} component="span">
        {/* <HeaderNotifications /> */}
        {/* <Button>Start new semester</Button> */}
      </Box>
    </Box>
  );
}

export default HeaderButtons;
