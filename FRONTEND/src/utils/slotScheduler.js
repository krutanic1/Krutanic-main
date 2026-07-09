export const getISTTime = () => {
  // Returns a Date object where local hours/days match IST
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
};

export const getAvailableDates = (count = 2) => {
  const dates = [];
  let istDate = getISTTime();
  
  // Capture "today" in IST to mark it correctly
  const todayYear = istDate.getFullYear();
  const todayMonth = String(istDate.getMonth() + 1).padStart(2, '0');
  const todayDay = String(istDate.getDate()).padStart(2, '0');
  const todayStr = `${todayYear}-${todayMonth}-${todayDay}`;

  while (dates.length < count) {
    // 0 = Sunday. Schedule is Monday to Saturday
    if (istDate.getDay() !== 0) {
      const year = istDate.getFullYear();
      const month = String(istDate.getMonth() + 1).padStart(2, '0');
      const day = String(istDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const displayStr = istDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      dates.push({ dateStr, displayStr, isToday: dateStr === todayStr });
    }
    istDate.setDate(istDate.getDate() + 1);
  }
  return dates;
};

export const getSlotsForDate = (dateStr) => {
  if (!dateStr) return [];
  
  // Timing is 4 PM to 8 PM India Time
  let slots = [
    '16:00', '16:30', '17:00', '17:30', 
    '18:00', '18:30', '19:00', '19:30', '20:00','20:30'
  ];

  const istNow = getISTTime();
  const year = istNow.getFullYear();
  const month = String(istNow.getMonth() + 1).padStart(2, '0');
  const day = String(istNow.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;
  
  // Filter out past slots for today
  if (dateStr === todayStr) {
    const currentHour = istNow.getHours();
    const currentMinute = istNow.getMinutes();
    slots = slots.filter(time => {
      const [h, m] = time.split(':').map(Number);
      return h > currentHour || (h === currentHour && m > currentMinute);
    });
  }
  return slots;
};
