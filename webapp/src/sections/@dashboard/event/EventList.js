import PropTypes from 'prop-types';
// @mui
import { Grid } from '@mui/material';

import EventCard from './EventCard';
// ----------------------------------------------------------------------

EventList.propTypes = {
  events: PropTypes.array,
};

export default function EventList({ events, setEditingEvent, id,  ...other }) {

  return (
    <>
    <Grid container spacing={3} {...other} alignItems="stretch">
      {events && events.map((event, index) => (
        <Grid key={`event-${index}`} item xs={12} sm={6} md={3} >
          <EventCard event={event} setEditingEvent={setEditingEvent} />
        </Grid>
      ))}
    </Grid>
    </>
  );
}
