import { useState, useEffect } from "react";

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 7,
    seconds: 57,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        let { hours, minutes, seconds } = prevTime;

        if (seconds > 0) {
          seconds--;
        } else {
          if (minutes > 0) {
            minutes--;
            seconds = 59;
          } else {
            if (hours > 0) {
              hours--;
              minutes = 59;
              seconds = 59;
            } else {
              // Reset to 23:59:59 if it hits zero, or keep it at 0
              // For urgency, let's keep a consistent countdown
              hours = 23;
              minutes = 59;
              seconds = 59;
            }
          }
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => String(num).padStart(2, "0");

  return (
    <div className="flex gap-1.5 items-center">
      <span className="countdown-box">{formatNumber(timeLeft.hours)}</span> :
      <span className="countdown-box">{formatNumber(timeLeft.minutes)}</span> :
      <span className="countdown-box">{formatNumber(timeLeft.seconds)}</span>
    </div>
  );
};

export default CountdownTimer;
