import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import RNLocation from 'react-native-location';
import { connect } from 'react-redux';
import { getScooters, updatedScooters, cleanScooters } from '../redux/actions';
import { getDistanceScooter } from '../utils/utils';
import { ScooterMap } from './scooterMap';
import { ToolBox } from './ToolBox';

const App = ({ cleanScooters, getScooters, scooters, updatedScooters }) => {
  const initialLoaction = { latitude: 41.4045646, longitude: 2.1641372 };
  const [location, setLocation] = useState(initialLoaction);
  const [centerMap, setCenterMap] = useState(initialLoaction);
  const [selectedScooter, setSelectedScooter] = useState({});
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    // cleanScooters();
    const getSc = async () => {
      await getScooters();
      updateDistanceScooters();
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
    return () => _stopUpdatingLocation();
  }, []);

  useEffect(() => {
    setSelectedScooter({});
    const getSc = async () => {
      cleanScooters();
      await getScooters();
      updateDistanceScooters();
    };
    getSc();
    setCenterMap(location);
  }, [refresh]);

  _startUpdatingLocation = () => {
    const locationSubscription = RNLocation.subscribeToLocationUpdates(
      locations => {
        setLocation(locations[0]);
      }
    );
  };

  _stopUpdatingLocation = () => setLocation({});

  function getMapRegion(type = centerMap || location) {
    return {
      latitude: type.latitude,
      longitude: type.longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121
    };
  }

  updateDistanceScooters = () => {
    const updatedDistanceScooters = getDistanceScooter(scooters, location);
    updatedScooters(updatedDistanceScooters);
    setSelectedScooter(
      updatedDistanceScooters.filter(scooter => scooter.status === 0)[0]
    );
  };

  moveToScooter = next => {
    const selected = getValidScooters()[
      getCurrentScooterIndex() + (next ? 1 : -1)
    ];
    setCenterMap({
      latitude: selected.lat,
      longitude: selected.lng
    });
    setSelectedScooter(selected);
  };

  return (
    <View style={styles.container}>
      <ScooterMap
        scooters={scooters}
        selectedScooter={selectedScooter}
        setSelectedScooter={setSelectedScooter}
        getMapRegion={getMapRegion}
      />
      <ToolBox
        scooters={scooters}
        selectedScooter={selectedScooter}
        setRefresh={setRefresh}
        refresh={refresh}
        setCenterMap={setCenterMap}
        location={location}
        moveToScooter={moveToScooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center'
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

const mapStateToProps = state => state.scooters;

const mapDispatchToProps = {
  getScooters,
  updatedScooters,
  cleanScooters
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
