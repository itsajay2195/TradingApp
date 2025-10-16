import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import Icon from '../IconComponent/IconComponent'; // You can change the library/icon

const SearchBar = ({value, onChangeText, placeholder = 'Search...'}: any) => {
  return (
    <View style={styles.container}>
      <Icon
        library={'Ionicons'}
        name={'search'}
        size={20}
        style={styles.iconStyle}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 12,
    // Elevated look
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    gap: 8,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  iconStyle: {
    color: '#007AFF',
    // marginBottom: 8,
  },
});
