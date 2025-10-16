import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect} from 'react';

const useCoinsSearchHook = ({
  coins,
  setFilteredCoins,
  setSearchText,
}: {
  coins: any[];
  setFilteredCoins: (val: any) => void;
  setSearchText: (val: any) => void;
}) => {
  const onChangeText = useCallback(
    (searchText: string) => {
      const searchLowerCase = searchText?.toLowerCase();
      const filtered = coins?.filter((item: {name: string}) => {
        return item?.name?.toLowerCase()?.includes(searchLowerCase);
      });
      setFilteredCoins(filtered);
      setSearchText(searchText);
    },
    [coins],
  );

  return {onChangeText};
};

export default useCoinsSearchHook;

const styles = StyleSheet.create({});
