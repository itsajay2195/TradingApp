import React from 'react';
import {StyleSheet} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'; // ✅ FIXED
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface IconProps {
  name: any; // Icon name
  size?: number; // Icon size
  color?: string; // Icon color
  onPress?: any;
  library?:
    | 'Entypo'
    | 'FontAwesome'
    | 'AntDesign'
    | 'MaterialIcons'
    | 'MaterialCommunityIcons'
    | 'FontAwesome6'
    | 'Ionicons'; // Icon library
  style?: object; // Custom styles
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 16,
  color = 'black',
  library = 'Entypo',
  style,
  onPress,
}) => {
  // Choose the correct library
  const IconComponent = (() => {
    switch (library) {
      case 'FontAwesome':
        return FontAwesome;
      case 'AntDesign':
        return AntDesign;
      case 'MaterialIcons':
        return MaterialIcons;
      case 'Ionicons':
        return Ionicons;
      case 'FontAwesome6':
        return FontAwesome6;
      case 'MaterialCommunityIcons':
        return MaterialCommunityIcons;
      default:
        return Entypo;
    }
  })();

  // Render the selected icon
  return (
    <IconComponent
      name={name}
      onPress={onPress}
      size={size}
      color={color}
      style={style}
    />
  );
};

const styles = StyleSheet.create({
  defaultStyle: {
    margin: 4,
  },
});

export default Icon;
