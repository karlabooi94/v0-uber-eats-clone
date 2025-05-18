"use client"
import { cn } from "@/lib/utils"

interface TimeSlotSelectorProps {
  selectedTime: string
  onTimeSelect: (time: string) => void
  className?: string
}

export function TimeSlotSelector({ selectedTime, onTimeSelect, className }: TimeSlotSelectorProps) {
  // Generate time slots from 5:00 PM to 9:00 PM in 30-minute intervals
  const generateTimeSlots = () => {
    const slots = []
    const startHour = 17 // 5 PM
    const endHour = 21 // 9 PM

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hourFormatted = hour % 12 === 0 ? 12 : hour % 12
        const amPm = hour >= 12 ? "PM" : "AM"
        const minuteFormatted = minute === 0 ? "00" : minute
        const timeString = `${hourFormatted}:${minuteFormatted} ${amPm}`
        slots.push(timeString)
      }
    }

    // Add the last slot at 9:00 PM
    slots.push("9:00 PM")

    return slots
  }

  const timeSlots = generateTimeSlots()

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2 text-sm font-medium">Select a Time</div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {timeSlots.map((time) => (
          <button
            key={time}
            type="button"
            className={cn(
              "rounded-md border p-2 text-center text-sm transition-colors",
              selectedTime === time
                ? "border-black bg-black text-white"
                : "border-gray-200 bg-white hover:border-gray-300",
            )}
            onClick={() => onTimeSelect(time)}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  )
}
