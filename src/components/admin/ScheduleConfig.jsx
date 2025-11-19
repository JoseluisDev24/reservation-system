"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Check, X } from "lucide-react";

export default function ScheduleConfig({ schedule, onChange }) {
  const [expandedDays, setExpandedDays] = useState([]);
  const [localSchedule, setLocalSchedule] = useState(
    schedule || {
      openTime: "08:00",
      closeTime: "23:00",
      slotDuration: 60,
      availableDays: [1, 2, 3, 4, 5, 6],
      blockedSlots: [],
    }
  );

  const daysOfWeek = [
    { value: 0, label: "Domingo" },
    { value: 1, label: "Lunes" },
    { value: 2, label: "Martes" },
    { value: 3, label: "Miércoles" },
    { value: 4, label: "Jueves" },
    { value: 5, label: "Viernes" },
    { value: 6, label: "Sábado" },
  ];

  const generateTimeSlots = () => {
    const slots = [];
    const [openHour, openMin] = localSchedule.openTime.split(":").map(Number);
    const [closeHour, closeMin] = localSchedule.closeTime
      .split(":")
      .map(Number);

    let currentHour = openHour;
    let currentMin = openMin;

    while (
      currentHour < closeHour ||
      (currentHour === closeHour && currentMin < closeMin)
    ) {
      const timeStr = `${String(currentHour).padStart(2, "0")}:${String(
        currentMin
      ).padStart(2, "0")}`;
      slots.push(timeStr);

      currentMin += localSchedule.slotDuration;
      if (currentMin >= 60) {
        currentHour += Math.floor(currentMin / 60);
        currentMin = currentMin % 60;
      }
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  const toggleDay = (day) => {
    setExpandedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const isSlotBlocked = (day, time) => {
    return localSchedule.blockedSlots?.some(
      (slot) => slot.day === day && slot.time === time
    );
  };

  const toggleSlot = (day, time) => {
    const isBlocked = isSlotBlocked(day, time);

    const newBlockedSlots = isBlocked
      ? localSchedule.blockedSlots.filter(
          (slot) => !(slot.day === day && slot.time === time)
        )
      : [...(localSchedule.blockedSlots || []), { day, time }];

    const updated = {
      ...localSchedule,
      blockedSlots: newBlockedSlots,
    };

    setLocalSchedule(updated);
    onChange?.(updated);
  };

  const updateTime = (field, value) => {
    const updated = {
      ...localSchedule,
      [field]: value,
    };
    setLocalSchedule(updated);
    onChange?.(updated);
  };

  const toggleAvailableDay = (day) => {
    const newAvailableDays = localSchedule.availableDays.includes(day)
      ? localSchedule.availableDays.filter((d) => d !== day)
      : [...localSchedule.availableDays, day].sort();

    const updated = {
      ...localSchedule,
      availableDays: newAvailableDays,
    };

    setLocalSchedule(updated);
    onChange?.(updated);
  };

  const updateSlotDuration = (duration) => {
    const updated = {
      ...localSchedule,
      slotDuration: Number(duration),
    };
    setLocalSchedule(updated);
    onChange?.(updated);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Configuración de Horarios
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Hora de apertura
            </label>
            <input
              type="time"
              value={localSchedule.openTime}
              onChange={(e) => updateTime("openTime", e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Hora de cierre
            </label>
            <input
              type="time"
              value={localSchedule.closeTime}
              onChange={(e) => updateTime("closeTime", e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duración por turno
            </label>
            <select
              value={localSchedule.slotDuration}
              onChange={(e) => updateSlotDuration(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
            >
              <option value="30">30 minutos</option>
              <option value="60">1 hora</option>
              <option value="90">1.5 horas</option>
              <option value="120">2 horas</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Días disponibles
          </label>
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day) => (
              <button
                key={day.value}
                type="button"
                onClick={() => toggleAvailableDay(day.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  localSchedule.availableDays.includes(day.value)
                    ? "bg-green-500 text-white"
                    : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Bloquear Horarios Específicos
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Selecciona un día para ver y bloquear horarios específicos
        </p>

        <div className="space-y-2">
          {daysOfWeek
            .filter((day) => localSchedule.availableDays.includes(day.value))
            .map((day) => (
              <div
                key={day.value}
                className="border border-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-750 hover:bg-gray-700 transition-colors"
                >
                  <span className="font-medium text-white">{day.label}</span>
                  {expandedDays.includes(day.value) ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                </button>

                {/* Slots del día */}
                {expandedDays.includes(day.value) && (
                  <div className="p-4 space-y-2 bg-gray-800">
                    {timeSlots.map((time) => {
                      const blocked = isSlotBlocked(day.value, time);
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => toggleSlot(day.value, time)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                            blocked
                              ? "bg-red-500/20 border-red-500 text-red-400"
                              : "bg-green-500/20 border-green-500 text-green-400 hover:bg-green-500/30"
                          } border`}
                        >
                          <span className="font-medium">{time}</span>
                          <div className="flex items-center gap-2">
                            {blocked ? (
                              <>
                                <span className="text-sm">Bloqueado</span>
                                <X className="h-5 w-5" />
                              </>
                            ) : (
                              <>
                                <span className="text-sm">Disponible</span>
                                <Check className="h-5 w-5" />
                              </>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
