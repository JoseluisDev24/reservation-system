export default function CalendarLegend({ events, selectedSlot }) {
  const confirmedCount = events.filter(
    (e) => e.resource?.status === "confirmed"
  ).length;

  const pendingCount = events.filter(
    (e) => e.resource?.status === "pending"
  ).length;

  return (
    <div className="mt-4 flex gap-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-green-500 rounded"></div>
        <span>Confirmadas ({confirmedCount})</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-amber-500 rounded"></div>
        <span>Pendientes ({pendingCount})</span>
      </div>

      {selectedSlot && (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded border-2 border-blue-700"></div>
          <span className="font-semibold text-blue-700">Tu selección</span>
        </div>
      )}
    </div>
  );
}
