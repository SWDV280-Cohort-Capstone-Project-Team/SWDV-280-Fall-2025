import React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import "./Calendar.css";

export default function Calendar({ 
  selectedDate, 
  onDateSelect, 
  minDate, 
  maxDate,
  disabledDates = []
}) {
  // Helper function to parse date string in local time (avoid timezone issues)
  const parseLocalDate = (dateString) => {
    if (!dateString) return undefined;
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Convert date string to Date object for DayPicker (using local time)
  const selectedDateObj = selectedDate ? parseLocalDate(selectedDate) : undefined;

  // Build disabled dates array
  const disabled = [
    ...disabledDates,
    // Disable past dates if minDate not provided
    ...(minDate ? [] : [{ before: new Date() }]),
    // Disable dates before minDate (parse in local time)
    ...(minDate ? [{ before: parseLocalDate(minDate) }] : []),
    // Disable dates after maxDate (parse in local time)
    ...(maxDate ? [{ after: parseLocalDate(maxDate) }] : []),
  ];

  const handleDateSelect = (date) => {
    if (date && onDateSelect) {
      // Format as YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      onDateSelect(dateString);
    }
  };

  return (
    <div className="calendar-wrapper">
      <DayPicker
        mode="single"
        selected={selectedDateObj}
        onSelect={handleDateSelect}
        disabled={disabled}
        fromDate={minDate ? parseLocalDate(minDate) : new Date()}
        toDate={maxDate ? parseLocalDate(maxDate) : undefined}
        showOutsideDays={false}
        className="appointment-calendar"
      />
    </div>
  );
}
