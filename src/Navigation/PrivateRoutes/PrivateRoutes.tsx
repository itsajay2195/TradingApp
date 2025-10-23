import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CoinListScreen from '../../screens/CoinsListScreen/CoinsListScreen';
import HomeTabView from './HomeTabView';
import CoinDetailScreen from '../../screens/CoinsDetailsScreen/CoinDetailScreen';

const Stack = createNativeStackNavigator();
const PrivateRoutes = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name={'COINS_LIST_SCREEN'}
        component={HomeTabView}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'COIN_DETAILS_SCREEN'}
        component={CoinDetailScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default PrivateRoutes;

const styles = StyleSheet.create({});
