// Haptic feedback utility for mobile devices
export const triggerHapticFeedback = (type = 'light') => {
  // Check if device supports haptic feedback
  if (navigator.vibrate) {
    switch (type) {
      case 'light':
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate(25);
        break;
      case 'heavy':
        navigator.vibrate(50);
        break;
      case 'success':
        navigator.vibrate([10, 30, 10]);
        break;
      case 'error':
        navigator.vibrate([50, 100, 50]);
        break;
      default:
        navigator.vibrate(10);
    }
  }
  
  // For iOS devices with haptic feedback support
  if (window.DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === 'function') {
    // iOS haptic feedback would need additional implementation
    // This is a simplified version
    try {
      // Would use iOS-specific haptic APIs here
      console.log(`Haptic feedback: ${type}`);
    } catch (error) {
      console.log('Haptic feedback not available');
    }
  }
};

// Enhanced button click handler with haptic feedback
export const handleHapticClick = (callback, hapticType = 'light') => {
  return (event) => {
    triggerHapticFeedback(hapticType);
    if (callback) {
      callback(event);
    }
  };
};

// Check if device is mobile
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Check if haptic feedback is supported
export const isHapticSupported = () => {
  return navigator.vibrate || (window.DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === 'function');
};