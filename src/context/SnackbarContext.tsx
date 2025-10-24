import {hideSnackbar} from '../store/slices/uiSlice';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  useEffect,
} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

type SnackBarContextType = {
  triggerSnackBar: (message: string) => void;
};

const SnackBarContext = createContext<SnackBarContextType | undefined>(
  undefined,
);

export const SnackBarProvider = ({children}: {children: ReactNode}) => {
  const dispatch = useDispatch();
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [snackBarMessage, setSnackBarMessage] = useState<string | null>(null);
  const {
    showSnackBar: uiSliceSbState,
    snackbarMessage: uiSliceSnackBarMessage,
  } = useSelector((state: any) => state.ui);

  const triggerSnackBar = (message: string) => {
    setSnackBarMessage(message);
    // Clear any existing timer
    if (timer.current) {
      clearTimeout(timer.current);
    }
    // Set a new timer to auto-dismiss the snackbar
    timer.current = setTimeout(() => {
      if (uiSliceSbState && uiSliceSnackBarMessage) {
        dispatch(hideSnackbar());
      }
      setSnackBarMessage(null);
      timer.current = null; // Reset the timer reference
    }, 2000); // Automatically dismiss after 3 seconds
  };

  useEffect(() => {
    //this UE wil handle the scenario whecn the snackbar is triggered using the uislice action
    if (uiSliceSbState && uiSliceSnackBarMessage) {
      triggerSnackBar(uiSliceSnackBarMessage);
    }
  }, [uiSliceSbState]);

  useEffect(() => {
    // Cleanup function to avoid memory leaks
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  return (
    <SnackBarContext.Provider value={{triggerSnackBar}}>
      <View style={{flex: 1}}>
        {children}
        {snackBarMessage && (
          <View
            style={[styles.snackBarContainer, {backgroundColor: '#B0B0B0'}]}>
            <Text style={styles.messageStyle}>{snackBarMessage}</Text>
          </View>
        )}
      </View>
    </SnackBarContext.Provider>
  );
};

export const useSnackBar = (): SnackBarContextType => {
  const context = useContext(SnackBarContext);
  if (!context) {
    throw new Error('useSnackBar must be used within a SnackBarProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  snackBarContainer: {
    position: 'absolute',
    borderRadius: 20,
    zIndex: 100,
    padding: 10,
    bottom: 30,
    left: 20,
    right: 20,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  messageStyle: {color: '#F9F9F9', fontSize: 16, fontWeight: '600'},
});
