import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import RNLocation from 'react-native-location';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { connect } from 'react-redux';
import { getScooters, updatedScooters, cleanScooters } from '../redux/actions';
import { getDistance } from 'geolib';

const aviableScooterImage = require('../../static/images/markers/iconscooter_avail.png');
const bookedScooterImage = require('../../static/images/markers/iconscooter_booked.png');
const alertScooterImage = require('../../static/images/markers/iconscooter_alert.png');
const selectedScooterImage = require('../../static/images/markers/iconscooter_disabled.png');

let calculateDistance = false;

const App = props => {
  const initialLoaction = { latitude: 41.4045646, longitude: 2.1641372 };
  const [location, setLocation] = useState(initialLoaction);
  const [centerMap, setCenterMap] = useState(initialLoaction);
  const [selectedScooter, setSelectedScooter] = useState({});
  const [refresh, setRefresh] = useState(false);

  const { cleanScooters, getScooters, scooters } = props;

  useEffect(() => {
    if (calculateDistance) {
      calculateDistance = false;
      setSelectedScooter({});
      const getSc = async () => {
        await cleanScooters();
        await getScooters();
        getDistanceScooter();
      };
      getSc();
      setCenterMap(location);
    }
  }, [refresh]);

  useEffect(() => {
    //cleanScooters();
    const getSc = async () => {
      await getScooters();
      getDistanceScooter();
    };
    getSc();
    RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'fine'
      }
    }).then(granted => {
      if (granted) _startUpdatingLocation();
    });
  }, []);

  useEffect(() => {
    if (selectedScooter.id !== undefined) {
      setCenterMap({
        latitude: selectedScooter.lat,
        longitude: selectedScooter.lng
      });
    }
  }, [selectedScooter]);

  _startUpdatingLocation = () => {
    locationSubscription = RNLocation.subscribeToLocationUpdates(locations => {
      setLocation(locations[0]);
    });
  };

  getMapRegion = (type = centerMap || location) => {
    return {
      latitude: type.latitude,
      longitude: type.longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121
    };
  };

  getDistanceScooter = () => {
    if (calculateDistance === false) {
      scooters.forEach(scooter => {
        scooter.distance = getDistance(
          {
            latitude: location.latitude,
            longitude: location.longitude
          },
          { latitude: scooter.lat, longitude: scooter.lng }
        );
      });
      scooters.sort((a, b) => a.distance - b.distance);
      setSelectedScooter(scooters.filter(scooter => scooter.status === 0)[0]);
      calculateDistance = true;
      updatedScooters(scooters);
    }
  };

  scooterColor = scooter => {
    if (selectedScooter.id === scooter.id) return selectedScooterImage;
    return scooter.status === 0
      ? aviableScooterImage
      : scooter.status === 1
      ? bookedScooterImage
      : alertScooterImage;
  };

  const getValidScooters = () => {
    return scooters.filter(
      scooter => scooter.status === 0 && scooter.distance <= 1200
    );
  };

  const getCurrentScooterIndex = () =>
    getValidScooters().findIndex(scooter => scooter.id === selectedScooter.id);

  checkEnablePrevButton = () => getCurrentScooterIndex() === 0;

  checkEnableNextButton = () =>
    getValidScooters().length - 1 <= getCurrentScooterIndex();

  getPrev = () =>
    setSelectedScooter(getValidScooters()[getCurrentScooterIndex() - 1]);

  getNext = () =>
    setSelectedScooter(getValidScooters()[getCurrentScooterIndex() + 1]);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={getMapRegion()}
        loadingEnabled
        showsUserLocation={true}
        onMarkerPress={e => console.log(e.currentTarget)}
        moveOnMarkerPress={false}
      >
        {calculateDistance === true &&
          scooters.map((scooter, index) => {
            return (
              <Marker
                image={scooterColor(scooter)}
                key={index}
                coordinate={{ latitude: scooter.lat, longitude: scooter.lng }}
                onPress={() =>
                  scooter.status === 0 && setSelectedScooter(scooter)
                }
              />
            );
          })}
      </MapView>
      <View style={styles.scooterInfo}>
        <View style={styles.buttons}>
          <Button
            title='Prev.'
            onPress={getPrev}
            disabled={
              selectedScooter.id !== undefined && checkEnablePrevButton()
            }
          />
          <Button title='Refresh' onPress={() => setRefresh(!refresh)} />
        </View>
        <View style={styles.currentScooter}>
          <Text>Name:{selectedScooter.name}</Text>
          <Text>Batery: {selectedScooter.battery}</Text>
          <Text>Distance: {selectedScooter.distance}</Text>
        </View>
        <View style={styles.buttons}>
          <Button
            title='Next'
            onPress={getNext}
            disabled={
              selectedScooter.id !== undefined && checkEnableNextButton()
            }
          />
          <Button title='Center' onPress={() => setCenterMap(location)} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  scooterInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttons: {
    width: '20%'
  },
  currentScooter: {
    width: '60%',
    alignItems: 'center',
    backgroundColor: 'white'
  }
});

const mapStateToProps = (state, props) => {
  return state.scooters;
};

const mapDispatchToProps = {
  getScooters,
  updatedScooters,
  cleanScooters
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
