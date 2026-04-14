/**
 * errors.js — Centralized, user-friendly error message mapping
 */

export const ERR = {
  // Capture
  PERMISSION_DENIED:   'Permission denied. Please allow access and try again.',
  DEVICE_NOT_FOUND:    'No device found. Check your camera/microphone connections.',
  DEVICE_IN_USE:       'Device is in use by another application.',
  DEVICE_DISCONNECT:   'Device disconnected. Please reconnect and resume.',
  OVERCONSTRAINED:     'Selected device does not support the requested settings. Try a lower resolution or frame rate.',

  // Recording
  RECORDER_NOT_INIT:   'Recorder not initialised. Start screen capture first.',
  RECORDER_CRASH:      'Recorder crashed unexpectedly. The session has been saved.',
  CHUNK_WRITE_FAIL:    'Failed to write recording chunk to disk. Check available disk space.',
  IPC_UNAVAILABLE:     'Electron bridge unavailable. Running in browser fallback mode.',

  // Export
  FFMPEG_FAIL:         'Export failed. FFmpeg encountered an error — check console for details.',
  DISK_FULL:           'Not enough disk space to save the recording.',
  NO_SCREEN_STREAM:    'No screen stream available. Start recording first.',
};

/**
 * Classify a browser/Web API error into a friendly message.
 */
export function classifyError(err) {
  if (!err) return 'An unknown error occurred.';
  switch (err.name) {
    case 'NotAllowedError':       return ERR.PERMISSION_DENIED;
    case 'NotFoundError':         return ERR.DEVICE_NOT_FOUND;
    case 'NotReadableError':      return ERR.DEVICE_IN_USE;
    case 'OverconstrainedError':  return ERR.OVERCONSTRAINED;
    case 'AbortError':            return 'Operation cancelled by the user.';
    case 'SecurityError':         return 'Security policy blocked capture.';
    default:                      return err.message || 'An unexpected error occurred.';
  }
}
