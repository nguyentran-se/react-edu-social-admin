import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { pluralize } from 'src/utils';
interface ListPageHeaderProps {
  entity: string;
  createHref?: string;
  onCreateEntity?: () => void;
}
function ListPageHeader({ entity, createHref, onCreateEntity }: ListPageHeaderProps) {
  const createBtnProps = createHref
    ? {
        LinkComponent: Link,
        href: createHref,
      }
    : {};
  return (
    <Paper sx={{ p: 2, marginBottom: 2 }}>
      <Helmet>
        <title>FUniverse | {entity.toUpperCase()}</title>
      </Helmet>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs={6}>
          <Typography variant="h3" component="h3" gutterBottom sx={{ textTransform: 'capitalize' }}>
            {`${pluralize(entity)}`}
          </Typography>
          {/* <Typography variant="subtitle2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa aut sit ea nam. Iusto
            molestias veritatis tempora provident reiciendis laboriosam beatae, alias, hic odio
            necessitatibus et nobis itaque quos! Voluptate.
          </Typography> */}
        </Grid>
        {onCreateEntity && (
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Button
              {...createBtnProps}
              sx={{ mt: { xs: 2, md: 0 } }}
              variant="contained"
              startIcon={<AddTwoToneIcon fontSize="small" />}
              onClick={onCreateEntity}
            >
              Create {entity}
            </Button>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}

export default ListPageHeader;
