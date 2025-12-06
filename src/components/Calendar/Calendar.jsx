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
  // Convert date string to Date object for DayPicker
  const selectedDateObj = selectedDate ? new Date(selectedDate) : undefined;

  // Build disabled dates array
  const disabled = [
    ...disabledDates,
    // Disable past dates if minDate not provided
    ...(minDate ? [] : [{ before: new Date() }]),
    // Disable dates before minDate
    ...(minDate ? [{ before: new Date(minDate) }] : []),
    // Disable dates after maxDate
    ...(maxDate ? [{ after: new Date(maxDate) }] : []),
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
        fromDate={minDate ? new Date(minDate) : new Date()}
        toDate={maxDate ? new Date(maxDate) : undefined}
        showOutsideDays={false}
        className="appointment-calendar"
      />
    </div>
  );
}
