import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';

type ToastType = 'success' | 'info' | 'error';

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const TOAST_DURATION = 3000; // Total duration in milliseconds

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutsRef = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  React.useEffect(() => {
    return () => {
      // Clear any pending toast timeouts on unmount to avoid memory leaks
      timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutsRef.current = [];
    };
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.floor(Date.now() + Math.random() * 1000000); // Integer-based unique ID with large random component
    const newToast: Toast = { id, message, type };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto-dismiss after 3 seconds
    const timeoutId = setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
      // Remove this timeout from the ref once it has fired
      timeoutsRef.current = timeoutsRef.current.filter((t) => t !== timeoutId);
    }, TOAST_DURATION);

    timeoutsRef.current.push(timeoutId);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View style={styles.toastContainer}>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    const fadeInDuration = 300;
    const fadeOutDuration = 300;
    const visibleDuration = TOAST_DURATION - fadeInDuration - fadeOutDuration;
    
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: fadeInDuration,
        useNativeDriver: true,
      }),
      Animated.delay(visibleDuration),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: fadeOutDuration,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim]);

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return '#4CAF50';
      case 'error':
        return '#F44336';
      case 'info':
      default:
        return '#2196F3';
    }
  };

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: getBackgroundColor(),
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.toastText}>{toast.message}</Text>
    </Animated.View>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful degradation: return no-op function to prevent crashes
    console.warn('useToast called outside ToastProvider - toast notifications will not appear');
    return {
      showToast: () => {
        console.warn('Toast notification ignored - ToastProvider not found in component tree');
      },
    };
  }
  return context;
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
    pointerEvents: 'box-none',
  },
  toast: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
