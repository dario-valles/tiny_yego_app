/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import RNLocation from 'react-native-location';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { getScooters } from '../redux/actions';

let iconApp = require('../../static/images/Icon_app.png');

type Props = {};
export default class App extends Component<Props> {
  constructor() {
    super();

    // Set initial state, will change on GPS update
    this.state = {
      location: {
        latitude: 41.4045646,
        longitude: 2.1641372
      }
    };
    this.scooters = getScooters();
  }

  componentDidMount() {
    RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'fine'
      }
    }).then(granted => {
      granted ? this._startUpdatingLocation() : console.log(granted);
    });
  }

  _startUpdatingLocation = () => {
    this.locationSubscription = RNLocation.subscribeToLocationUpdates(
      locations => {
        this.setState({ location: locations[0] });
        console.log(locations);
      }
    );
  };

  _stopUpdatingLocation = () => {
    this.locationSubscription && this.locationSubscription();
    this.setState({ location: null });
  };

  getMapRegion = () => {
    console.log(this.state.location.latitude);
    return {
      latitude: this.state.location.latitude,
      longitude: this.state.location.longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121
    };
  };

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={this.getMapRegion()}
          loadingEnabled
          onRegionChange={this.getMapRegion}
        />
        {this.scooters && console.log(this.scooters)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});
