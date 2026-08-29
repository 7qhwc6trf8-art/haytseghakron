export function lightHaptic() {
  try { navigator.vibrate?.(8); } catch { /* unsupported */ }
}
