/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import RNLocation from 'react-native-location';
import MapView, { PROVIDER_GOOGLE, Callout, Marker } from 'react-native-maps';
import { connect } from 'react-redux';
import { getScooters } from '../redux/actions';
import { getDistance } from 'geolib';

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

  componentDidMount() {
    this.props.getScooters();
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

  getDistanceScooter = scooters => {
    scooters.forEach(scooter => {
      scooter.distance = getDistance(
        {
          latitude: this.state.location.latitude,
          longitude: this.state.location.longitude
        },
        { latitude: scooter.lat, longitude: scooter.lng }
      );
    });

    return scooters;
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
          onMarkerPress={e => console.log(e.currentTarget)}
        >
          {this.props.scooters.scooters.length &&
            this.getDistanceScooter(this.props.scooters.scooters)
              .sort((a, b) => a.distance - b.distance)
              .map((scoter, index) => {
                return (
                  <Marker
                    key={index}
                    pinColor={
                      scoter.status === 0
                        ? 'orange'
                        : scoter.status === 1
                        ? '#000000'
                        : 'red'
                    }
                    coordinate={{ latitude: scoter.lat, longitude: scoter.lng }}
                  />
                );
              })}
        </MapView>
        <View style={styles.scooterInfo}>
          <Button title='Left' />
          <Text>Hola</Text>
          <Button title='Center' onPress={() => this.getMapRegion()} />
          <Button title='Right' />
        </View>
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
    ...StyleSheet.absoluteFillObject,
    height: '80%'
  },
  scooterInfo: {
    justifyContent: 'space-between',
    flexDirection: 'row'
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
