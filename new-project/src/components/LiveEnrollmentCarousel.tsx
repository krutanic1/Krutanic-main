import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';

interface EnrollmentNotification {
  studentName: string;
  courseName: string;
  amount: number;
}

const fallbackNotifications: EnrollmentNotification[] = [
  { studentName: 'Aarav S.', courseName: 'Full Stack Web Development', amount: 5000 },
  { studentName: 'Nisha K.', courseName: 'Data Analytics for Decision Making', amount: 5000 },
  { studentName: 'Rohan M.', courseName: 'Digital Marketing and Growth Strategy', amount: 5000 },
];

function maskName(name: string) {
  if (!name) return 'Student';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return `${parts[0].slice(0, 1)}***`;
  return `${parts[0]} ${parts[parts.length - 1].slice(0, 1)}.`;
}

function shuffleNotifications(items: EnrollmentNotification[]) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

export default function LiveEnrollmentCarousel() {
  const [notifications, setNotifications] = useState<EnrollmentNotification[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(true);

  const current = useMemo(() => {
    if (notifications.length === 0) return null;
    return notifications[activeIndex % notifications.length];
  }, [notifications, activeIndex]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('/microcourses/live-enrollments');
        const items = Array.isArray(res.data) ? res.data : [];

        const normalized = items
          .filter((item: any) => item?.studentName && item?.courseName)
          .map((item: any) => ({
            studentName: String(item.studentName),
            courseName: String(item.courseName),
            amount: Number(item.amount) || 5000,
          }));

        const randomized = shuffleNotifications(normalized.length > 0 ? normalized : fallbackNotifications);
        setNotifications(randomized);
        setActiveIndex(Math.floor(Math.random() * Math.max(randomized.length, 1)));
      } catch (err) {
        console.error('Failed to fetch live enrollments', err);
        const randomizedFallback = shuffleNotifications(fallbackNotifications);
        setNotifications(randomizedFallback);
        setActiveIndex(Math.floor(Math.random() * Math.max(randomizedFallback.length, 1)));
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    if (notifications.length <= 1) return;

    let hideTimeoutId: ReturnType<typeof setTimeout> | undefined;
    let showNextTimeoutId: ReturnType<typeof setTimeout> | undefined;

    const runCycle = () => {
      setShowPopup(true);

      // Keep popup visible for 3 seconds.
      hideTimeoutId = setTimeout(() => {
        setShowPopup(false);

        // Show next popup after 1 minute.
        showNextTimeoutId = setTimeout(() => {
          setActiveIndex((prev) => (prev + 1) % notifications.length);
          runCycle();
        }, 60000);
      }, 3000);
    };

    runCycle();

    return () => {
      if (hideTimeoutId) clearTimeout(hideTimeoutId);
      if (showNextTimeoutId) clearTimeout(showNextTimeoutId);
    };
  }, [notifications]);

  if (!current) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[90] w-[calc(100vw-2.5rem)] max-w-xs pointer-events-none">
      <AnimatePresence mode="wait">
        {showPopup && (
          <motion.div
            key={`${current.studentName}-${current.courseName}-${current.amount}-${activeIndex}`}
            initial={{ opacity: 0, x: 80, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24, mass: 0.9 }}
            className="bg-white/95 backdrop-blur border border-metallic-green/20 rounded-2xl editorial-shadow overflow-hidden shadow-[0_18px_40px_rgba(0,77,64,0.14)] min-h-[150px]"
          >
            <div className="h-1 bg-gradient-to-r from-metallic-green via-metallic-green-light to-metallic-accent"></div>
            <div className="px-4 py-5 flex flex-col justify-between min-h-[150px]">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-metallic-green shadow-[0_0_0_6px_rgba(0,77,64,0.08)]"></span>
                <p className="text-[11px] tracking-[0.16em] uppercase font-bold text-metallic-green">Recent Enrollment</p>
              </div>
              <p className="text-sm md:text-[0.92rem] text-on-surface-variant leading-relaxed mb-3">
                <span className="font-semibold text-on-surface">{maskName(current.studentName)}</span>
                {' '}joined{' '}
                <span className="font-semibold text-metallic-green">{current.courseName}</span>
              </p>
              <p className="text-sm md:text-[0.92rem] text-on-surface-variant">
                Amount: <span className="font-semibold text-metallic-green">₹{current.amount}</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
