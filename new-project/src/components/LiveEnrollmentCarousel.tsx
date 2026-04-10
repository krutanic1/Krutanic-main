import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';

interface EnrollmentNotification {
  studentName: string;
  studentEmail?: string;
  courseName: string;
  amount: number;
}

const fallbackNotifications: EnrollmentNotification[] = [
  {
    studentName: 'Aarav S.',
    studentEmail: 'aarav.s***@gmail.com',
    courseName: 'Full Stack Web Development',
    amount: 5000,
  },
  {
    studentName: 'Nisha K.',
    studentEmail: 'nisha.k***@gmail.com',
    courseName: 'Data Analytics for Decision Making',
    amount: 5000,
  },
  {
    studentName: 'Rohan M.',
    studentEmail: 'rohan.m***@gmail.com',
    courseName: 'Digital Marketing and Growth Strategy',
    amount: 5000,
  },
];

function maskName(name: string) {
  if (!name) return 'Student';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return `${parts[0].slice(0, 1)}***`;
  return `${parts[0]} ${parts[parts.length - 1].slice(0, 1)}.`;
}

function getMaskedEmail(name: string, email?: string) {
  const safeEmail = typeof email === 'string' ? email.trim() : '';

  if (safeEmail.includes('@')) {
    const [localPart, domainPart] = safeEmail.split('@');
    const cleanedLocal = localPart.replace(/[^a-zA-Z0-9._-]/g, '').toLowerCase();
    const visibleLocal = cleanedLocal.slice(0, 7);
    return `${visibleLocal || 'student'}***@${domainPart.toLowerCase()}`;
  }

  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .join('.');

  return `${base || 'student'}***@gmail.com`;
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
            studentEmail:
              item?.studentEmail || item?.email
                ? String(item.studentEmail || item.email)
                : undefined,
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
    <div className="fixed bottom-5 right-5 z-[90] w-[calc(100vw-2.5rem)] max-w-[19rem] pointer-events-none">
      <AnimatePresence mode="wait">
        {showPopup && (
          <motion.div
            key={`${current.studentName}-${current.courseName}-${current.amount}-${activeIndex}`}
            initial={{ opacity: 0, x: 80, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24, mass: 0.9 }}
            className="relative overflow-hidden rounded-[1.7rem] border border-[#d2d6d3] bg-[#ecefed] shadow-[0_16px_38px_rgba(23,52,46,0.2)]"
          >
            <div
              className="absolute inset-x-0 top-0 h-3 bg-[#0b6f5b]"
              aria-hidden="true"
            />
            <div className="relative flex items-center gap-3 px-5 py-4 min-h-[115px]">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#d0d6d2] bg-[#dde2df]">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-6 w-6 text-[#0b6f5b]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 7L10 17l-5-5" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="truncate text-[1.02rem] font-semibold uppercase tracking-[0.07em] text-[#113d34] [font-family:Georgia,serif]">
                  {maskName(current.studentName)}
                </p>
                <p className="mt-0.5 truncate text-[0.89rem] uppercase tracking-[0.03em] text-[#2f3f3a]/90">
                  {getMaskedEmail(current.studentName, current.studentEmail)}
                </p>
                <p className="mt-1 text-[0.98rem] uppercase italic tracking-[0.02em] text-[#1d2d28] [font-family:Georgia,serif]">
                  Just Enrolled!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
