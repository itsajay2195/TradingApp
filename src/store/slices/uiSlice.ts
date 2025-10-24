import {createSlice} from '@reduxjs/toolkit';

interface UIState {
  isLoading: boolean;
  alertMessage: string | null;
  showSnackBar: boolean;
  snackbarMessage: string | null;
  showSplashscreen: boolean;
}

const initialState: UIState = {
  isLoading: false,
  alertMessage: null,
  showSnackBar: false,
  snackbarMessage: null,
  showSplashscreen: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showLoader: state => {
      state.isLoading = true;
    },
    hideLoader: state => {
      state.isLoading = false;
    },
    showAlert: (state, action) => {
      state.alertMessage = action.payload;
    },
    hideAlert: state => {
      state.alertMessage = null;
    },
    resetLoader: state => {
      state.isLoading = false;
    },
    showSnackbar: (state, action) => {
      state.showSnackBar = true;
      state.snackbarMessage = action.payload;
    },
    hideSnackbar: state => {
      state.showSnackBar = false;
      state.snackbarMessage = null;
    },
    showSplashscreen: state => {
      state.showSplashscreen = true;
    },
    hideSplashscreen: state => {
      state.showSplashscreen = false;
    },
  },
});

export const {
  showLoader,
  hideLoader,
  showAlert,
  hideAlert,
  resetLoader,
  showSnackbar,
  hideSnackbar,
  showSplashscreen,
  hideSplashscreen,
} = uiSlice.actions;

export default uiSlice.reducer;
