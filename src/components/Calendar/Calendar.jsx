import React, { useState, useEffect } from "react";
import "./Calendar.css";

export default function Calendar({ selectedDate, onDateSelect, availableDates = [], minDate, maxDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Sync calendar with selected date
  useEffect(() => {
    if (selectedDate) {
      const date = new Date(selectedDate);
      setCurrentMonth(date.getMonth());
      setCurrentYear(date.getFullYear());
    }
  }, [selectedDate]);

  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
  }

  function formatDateString(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  function isDateAvailable(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if date is in the past
    if (date < today) return false;
    
    // Check min/max date constraints
    if (minDate && date < new Date(minDate)) return false;
    if (maxDate && date > new Date(maxDate)) return false;
    
    // Check if it's in available dates array (if provided)
    if (availableDates.length > 0) {
      return availableDates.includes(dateString);
    }
    
    // Default: exclude Sundays
    if (date.getDay() === 0) return false;
    
    return true;
  }

  function handleDateClick(dateString) {
    if (isDateAvailable(dateString) && onDateSelect) {
      onDateSelect(dateString);
    }
  }

  function navigateMonth(direction) {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  }

  function renderCalendarDays() {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];
    const today = new Date();
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDateString(currentYear, currentMonth, day);
      const isAvailable = isDateAvailable(dateString);
      const isSelected = selectedDate === dateString;
      const isToday = currentYear === today.getFullYear() && 
                      currentMonth === today.getMonth() && 
                      day === today.getDate();
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${isAvailable ? 'available' : 'unavailable'} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => handleDateClick(dateString)}
        >
          {day}
        </div>
      );
    }
    
    return days;
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button 
          type="button"
          className="calendar-nav-btn" 
          onClick={() => navigateMonth('prev')}
          aria-label="Previous month"
        >
          ‹
        </button>
        <h3 className="calendar-month-year">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button 
          type="button"
          className="calendar-nav-btn" 
          onClick={() => navigateMonth('next')}
          aria-label="Next month"
        >
          ›
        </button>
      </div>
      <div className="calendar-weekdays">
        {dayNames.map(day => (
          <div key={day} className="calendar-weekday">{day}</div>
        ))}
      </div>
      <div className="calendar-days">
        {renderCalendarDays()}
      </div>
      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-box available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-box unavailable"></div>
          <span>Unavailable</span>
        </div>
        <div className="legend-item">
          <div className="legend-box selected"></div>
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
}

