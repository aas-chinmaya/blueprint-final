// src/utils/errorDebugger.js
export function errorDebugger(error, label = 'API Error') {
  console.group(`[${label}]`);
  console.error('Message:', error?.message);
  console.error('Response:', error?.response?.data || 'No response data');
  console.error('Status:', error?.response?.status || 'No status');
  console.error('Stack:', error?.stack);
  console.groupEnd();
}
