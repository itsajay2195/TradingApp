import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Header = ({isConnected}: any) => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerTitle}>Markets</Text>
        <Text style={styles.headerSubtitle}>Live crypto prices</Text>
      </View>
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusDot,
            {backgroundColor: isConnected ? '#16a34a' : '#dc2626'},
          ]}
        />
        <Text style={styles.statusText}>
          {isConnected ? 'Live' : 'Disconnected'}
        </Text>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ffffff',
    minHeight: 80,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#6b7280',
  },
});
