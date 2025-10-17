import * as React from 'react';
import {
  Animated,
  View,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';
import Icon from '../../components/IconComponent/IconComponent';
import CoinListScreen from '../../screens/CoinsListScreen/CoinsListScreen';
import WatchlistScreen from '../../screens/WatchListScreen/WatchlistScreen';

const FirstRoute = () => <CoinListScreen />;
const SecondRoute = () => <WatchlistScreen />;

{
  /* <Icon
  library={'Ionicons'}
  name={'search'}
  size={20}
  style={styles.iconStyle}
/>; */
}

export default class HomeTabView extends React.Component {
  state = {
    index: 0,
    routes: [
      {
        key: 'first',
        title: 'Market',
        iconLibrary: 'FontAwesome6',
        iconName: 'coins',
      },
      {
        key: 'second',
        title: 'Watchlist',
        iconLibrary: 'FontAwesome',
        iconName: 'bullseye',
      },
    ],
  };

  _handleIndexChange = (index: any) => this.setState({index});

  _renderTabBar = (props: any) => {
    const inputRange = props.navigationState.routes.map((_: any, i: any) => i);

    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route: any, i: any) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex: any) =>
              inputIndex === i ? 1 : 0.5,
            ),
          });

          const isCurrentItem = this.state.index === i;
          const currentColor = isCurrentItem ? '#3b82f6' : 'gray';

          return (
            <TouchableOpacity
              key={i}
              style={{
                ...styles.tabItem,
                borderBottomWidth: isCurrentItem ? 2 : 0,
                borderColor: '#3b82f6',
              }}
              onPress={() => this.setState({index: i})}>
              <Icon
                library={route?.iconLibrary}
                name={route?.iconName}
                size={20}
                color={currentColor}
              />
              <Animated.Text style={{opacity, color: currentColor}}>
                {route.title}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  _renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={this._renderScene}
        renderTabBar={this._renderTabBar}
        onIndexChange={this._handleIndexChange}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
});
