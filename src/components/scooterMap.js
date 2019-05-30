import React from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';
import { scooterColor } from '../utils/utils';

export const ScooterMap = ({
  scooters,
  selectedScooter,
  setSelectedScooter,
  getMapRegion
}) => {
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      region={getMapRegion()}
      style={styles.map}
      loadingEnabled
      showsUserLocation={true}
      moveOnMarkerPress={false}
    >
      {scooters.length > 0 &&
        scooters[0].distance !== undefined &&
        scooters.map((scooter, index) => {
          return (
            <Marker
              image={scooterColor(selectedScooter, scooter)}
              key={index}
              coordinate={{ latitude: scooter.lat, longitude: scooter.lng }}
              onPress={() =>
                scooter.status === 0 && setSelectedScooter(scooter)
              }
            />
          );
        })}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject
  }
});
