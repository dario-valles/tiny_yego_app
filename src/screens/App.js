import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import RNLocation from 'react-native-location';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { connect } from 'react-redux';
import { getScooters, updatedScooters, cleanScooters } from '../redux/actions';
import { getDistance } from 'geolib';

let calculateDistance = false;

const App = props => {
  const initialLoaction = { latitude: 41.4045646, longitude: 2.1641372 };
  const [location, setLocation] = useState(initialLoaction);
  const [centerMap, setCenterMap] = useState(initialLoaction);
  const [selectedScooter, setSelectedScooter] = useState({});
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    //props.cleanScooters();
    const getSc = async () => {
      await props.getScooters();
      getDistanceScooter();
    };
    getSc();
    RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'fine'
      }
    }).then(granted => {
      granted ? _startUpdatingLocation() : console.log(granted);
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

  // useEffect(() => {
  //   calculateDistance = true
  //   setSelectedScooter({});
  //   const getSc = async () => {
  //     await props.cleanScooters();
  //     await props.getScooters();
  //     getDistanceScooter();
  //   };
  //   getSc();
  //   setCenterMap(location);
  // }, [refresh]);

  _startUpdatingLocation = () => {
    locationSubscription = RNLocation.subscribeToLocationUpdates(locations => {
      setLocation(locations[0]);
    });
  };

  // _stopUpdatingLocation = () => {
  //   locationSubscription && locationSubscription();
  //   setLocation(initialLoaction);
  // };

  getMapRegion = (type = centerMap || location) => {
    return {
      latitude: type.latitude,
      longitude: type.longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121
    };
  };

  getDistanceScooter = (scooters = props.scooters) => {
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
      props.updatedScooters(scooters);
    }
  };

  scooterColor = scooter => {
    if (selectedScooter.id === scooter.id) return 'blue';
    return scooter.status === 0
      ? 'orange'
      : scooter.status === 1
      ? 'black'
      : 'red';
  };

  const getValidScooters = () => {
    return props.scooters.filter(
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
      >
        {calculateDistance === true &&
          props.scooters.map((scooter, index) => {
            return (
              <Marker
                key={index}
                coordinate={{ latitude: scooter.lat, longitude: scooter.lng }}
                onPress={() =>
                  scooter.status === 0 && setSelectedScooter(scooter)
                }
              >
                <View
                  style={{
                    backgroundColor: scooterColor(scooter),
                    padding: 10
                  }}
                >
                  <Text>{scooter.battery}</Text>
                </View>
              </Marker>
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
          <Button title='Refresh' />
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
    ...StyleSheet.absoluteFillObject,
    height: '80%'
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
    alignItems: 'center'
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
