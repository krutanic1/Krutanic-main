/**
 * Warmup Scheduler Utility
 * Handles the logic for distributing email jobs across 24 hours.
 */

const getDomain = (email) => email.split('@')[1];

const getRandomJitter = (baseMs) => {
  const percentChange = (Math.random() * 0.4) - 0.2; // -20% to +20%
  return baseMs + (baseMs * percentChange);
};

const pickTarget = (sender, accounts) => {
  const senderDomain = getDomain(sender.user);
  const potentialTargets = accounts.filter(acc => 
    acc._id.toString() !== sender._id.toString() && 
    getDomain(acc.user) !== senderDomain
  );

  if (potentialTargets.length === 0) return null;
  return potentialTargets[Math.floor(Math.random() * potentialTargets.length)];
};

const PHASES = [
  { name: 'Phase 1 (0-6h)', durationHours: 6, weight: 0.1, replyWeight: 0.7 },
  { name: 'Phase 2 (6-12h)', durationHours: 6, weight: 0.2, replyWeight: 0.3 },
  { name: 'Phase 3 (12-18h)', durationHours: 6, weight: 0.4, replyWeight: 0.1 },
  { name: 'Phase 4 (18-24h)', durationHours: 6, weight: 0.3, replyWeight: 0.4 },
];

/**
 * Generate jobs for a 24-hour window
 * @param {Array} accounts List of warmup-enabled accounts
 */
const generate24hJobs = (accounts) => {
  const allJobs = [];
  const now = new Date();

  accounts.forEach(sender => {
    const dailyLimit = sender.warmup.dailyLimit || 50;
    let elapsedMs = 0;

    PHASES.forEach((phase, phaseIdx) => {
      const phaseEmailCount = Math.floor(dailyLimit * phase.weight);
      const phaseDurationMs = phase.durationHours * 60 * 60 * 1000;
      const intervalMs = phaseDurationMs / phaseEmailCount;

      for (let i = 0; i < phaseEmailCount; i++) {
        const target = pickTarget(sender, accounts);
        if (!target) continue;

        // Calculate schedule time with jitter
        const jitteredInterval = getRandomJitter(intervalMs);
        const scheduledAt = new Date(now.getTime() + elapsedMs + (i * intervalMs) + (jitteredInterval - intervalMs));

        // Ensure we don't schedule in the past or beyond 24h too much
        if (scheduledAt < now) continue;

        allJobs.push({
          accountId: sender._id,
          targetId: target._id,
          scheduledAt,
          type: Math.random() < phase.replyWeight ? 'reply' : 'send',
          status: 'pending'
        });
      }
      elapsedMs += phaseDurationMs;
    });
  });

  return allJobs;
};

module.exports = { generate24hJobs };
