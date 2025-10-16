import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const LoaderComponent = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text style={styles.loadingText}>Loading markets...</Text>
    </View>
  );
};

export default LoaderComponent;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
});
