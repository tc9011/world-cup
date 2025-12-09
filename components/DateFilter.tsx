import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useStore } from '../store/useStore';
import clsx from 'clsx';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  startOfWeek, 
  endOfWeek,
  isWithinInterval
} from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface DateFilterProps {
  availableDates: Date[];
}

export const DateFilter: React.FC<DateFilterProps> = ({ availableDates }) => {
  const { dateRange, setDateRange, language } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dateLocale = language === 'zh' ? zhCN : enUS;

  // Calculate min and max dates from available dates
  const { minDate, maxDate } = useMemo(() => {
    if (availableDates.length === 0) return { minDate: new Date(), maxDate: new Date() };
    const sorted = [...availableDates].sort((a, b) => a.getTime() - b.getTime());
    return { minDate: sorted[0], maxDate: sorted[sorted.length - 1] };
  }, [availableDates]);

  // Initialize calendar view to start date or min date
  const [currentMonth, setCurrentMonth] = useState(() => dateRange.start || minDate);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateClick = (date: Date) => {
    const { start, end } = dateRange;
    
    if (!start || (start && end)) {
      setDateRange({ start: date, end: null });
    } else {
      if (date.getTime() < start.getTime()) {
        setDateRange({ start: date, end: null });
      } else {
        setDateRange({ start, end: date });
        setIsOpen(false); // Close after selecting range
      }
    }
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  const formatDateRange = () => {
    if (!dateRange.start) return language === 'zh' ? '选择日期范围' : 'Select Dates';
    
    const formatStr = language === 'zh' ? 'MM月dd日' : 'MMM dd';
    
    const startStr = format(dateRange.start, formatStr, { locale: dateLocale });
    if (!dateRange.end) return startStr;
    const endStr = format(dateRange.end, formatStr, { locale: dateLocale });
    return `${startStr} - ${endStr}`;
  };

  const isDateDisabled = (date: Date) => {
    // Disable if outside World Cup range (minDate to maxDate)
    // We add a small buffer or just use exact match dates? 
    // User said "during World Cup", so let's use the min/max of available matches.
    // We strip time for comparison
    const d = new Date(date.setHours(0,0,0,0));
    const min = new Date(minDate); min.setHours(0,0,0,0);
    const max = new Date(maxDate); max.setHours(0,0,0,0);
    return d < min || d > max;
  };

  return (
    <div className="relative flex items-center gap-2" ref={containerRef}>
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap hidden sm:inline">
        {language === 'zh' ? '按日期筛选' : 'Filter by Date'}
      :</span>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 group",
          dateRange.start
            ? "bg-white dark:bg-gray-800 border-primary/50 text-primary shadow-sm"
            : "bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-gray-800"
        )}
      >
        <CalendarIcon size={18} />
        <span className="text-sm">{formatDateRange()}</span>
        {dateRange.start && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setDateRange({ start: null, end: null });
            }}
            className="ml-2 p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X size={14} />
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 w-[320px] animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <ChevronLeft size={20} />
            </button>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {format(currentMonth, 'MMMM yyyy', { locale: dateLocale })}
            </span>
            <button onClick={nextMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-400">
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, i) => {
              const isDisabled = isDateDisabled(date);
              const isCurrentMonth = isSameMonth(date, currentMonth);
              
              const isStart = dateRange.start && isSameDay(date, dateRange.start);
              const isEnd = dateRange.end && isSameDay(date, dateRange.end);
              const isSelected = isStart || isEnd;
              
              const inRange = dateRange.start && dateRange.end && 
                isWithinInterval(date, { start: dateRange.start, end: dateRange.end });

              return (
                <button
                  key={i}
                  disabled={isDisabled}
                  onClick={() => handleDateClick(date)}
                  className={clsx(
                    "h-9 w-9 rounded-full flex items-center justify-center text-sm transition-all relative",
                    !isCurrentMonth && "invisible",
                    isDisabled && "opacity-20 cursor-not-allowed",
                    isSelected && "bg-primary text-white font-bold shadow-md z-10",
                    inRange && !isSelected && "bg-primary/10 text-primary",
                    !isSelected && !inRange && !isDisabled && "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  )}
                >
                  {format(date, 'd')}
                  {/* Dot for match days */}
                  {availableDates.some(d => isSameDay(d, date)) && !isSelected && !isDisabled && (
                    <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary/50" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
