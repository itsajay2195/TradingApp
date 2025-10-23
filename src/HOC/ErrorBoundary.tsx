import React, {Component, ReactNode} from 'react';
import {View, Text, Button} from 'react-native';

interface ErrorBoundaryProps {
  children?: ReactNode; // The children elements wrapped by the ErrorBoundary
  onRetry?: () => void; // Callback function to handle retry logic
}

interface ErrorBoundaryState {
  hasError: boolean; // Tracks whether an error has occurred
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state = {hasError: false};

  static getDerivedStateFromError(error: any) {
    return {hasError: true};
  }

  componentDidCatch(error: any, info: any) {
    console.error(error, info);
  }

  handleRetry = () => {
    this.setState({hasError: false});
    if (this?.props?.onRetry) {
      this?.props?.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <View>
          <Text>Something went wrong</Text>
          <Button title="Retry" onPress={this.handleRetry} />
        </View>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
