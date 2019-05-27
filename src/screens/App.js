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
import { connect } from 'react-redux';
import { getScooters } from '../redux/actions';

let iconApp = require('../../static/images/Icon_app.png');

type Props = {};

class App extends Component<Props> {
  constructor() {
    super();

    // Set initial state, will change on GPS update
    this.state = {
      location: {
        latitude: 41.4045646,
        longitude: 2.1641372
      }
    };
  }

  async componentDidMount() {
    this.props.getScooters();
    console.log('aquiiiiiiiiiiiiiii', this.props);
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
        {this.props && console.log('props', this.props.scooters)}
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

const mapStateToProps = (state, props) => {
  return {
    scooters: state.scooters
  };
};

const mapDispatchToProps = {
  getScooters
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
