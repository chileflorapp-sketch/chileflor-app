import { useState, useEffect } from 'react';

interface CalendarConstraints {
  minDate: Date;
  isTodayLocked: boolean;
  isExclusiveNightServiceAvailable: boolean;
}

export function useCalendarConstraints(cartItems: any[]) {
  const [constraints, setConstraints] = useState<CalendarConstraints>({
    minDate: new Date(),
    isTodayLocked: false,
    isExclusiveNightServiceAvailable: false,
  });

  useEffect(() => {
    const updateConstraints = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      let todayLocked = false;
      let exclusiveNight = false;
      let minDate = new Date();

      // Rule 1: Lock today at 20:01
      if (currentHour > 20 || (currentHour === 20 && currentMinute >= 1)) {
        todayLocked = true;
        exclusiveNight = true; // Night service logic
        // Push minDate to tomorrow
        minDate.setDate(minDate.getDate() + 1);
      }

      // Rule 2: Breakfast restriction (before 18:00 previous day)
      const hasBreakfast = cartItems.some(item => item.type === 'breakfast');
      if (hasBreakfast && currentHour >= 18) {
        todayLocked = true;
        // If ordering at 18:00+ today, cannot deliver tomorrow morning either
        minDate.setDate(minDate.getDate() + 2);
      }

      setConstraints({
        minDate,
        isTodayLocked: todayLocked,
        isExclusiveNightServiceAvailable: exclusiveNight
      });
    };

    updateConstraints();
    const interval = setInterval(updateConstraints, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [cartItems]);

  return constraints;
}
