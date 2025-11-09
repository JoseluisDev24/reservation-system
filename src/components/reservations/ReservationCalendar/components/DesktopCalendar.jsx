import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { calendarMessages, calendarConfig } from "../utils/calendarHelpers";

const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function DesktopCalendar({
  events,
  currentView,
  onViewChange,
  onSelectSlot,
  onSelectEvent,
  eventStyleGetter,
}) {
  return (
    <div style={{ height: 600 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        culture="es"
        view={currentView}
        onView={onViewChange}
        messages={calendarMessages}
        views={calendarConfig.views}
        step={calendarConfig.step}
        timeslots={calendarConfig.timeslots}
        min={new Date(2025, 0, 1, calendarConfig.minHour, 0, 0)}
        max={new Date(2025, 0, 1, calendarConfig.maxHour, 0, 0)}
        selectable
        onSelectSlot={onSelectSlot}
        onSelectEvent={onSelectEvent}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
}
