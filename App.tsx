import React from 'react';
import RootNavigation from './src/navigation/RootNavigation';
import {SnackBarProvider} from './src/context/SnackbarContext';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
const App = () => {
  return (
    <Provider store={store}>
      <SnackBarProvider>
        <RootNavigation />
      </SnackBarProvider>
    </Provider>
  );
};

export default App;
