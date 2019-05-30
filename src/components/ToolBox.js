import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';

export const ToolBox = ({
  scooters,
  selectedScooter,
  setRefresh,
  refresh,
  setCenterMap,
  location,
  moveToScooter
}) => {
  getCurrentScooterIndex = () =>
    getValidScooters().findIndex(scooter => scooter.id === selectedScooter.id);

  checkEnablePrevButton = () => getCurrentScooterIndex() === 0;

  checkEnableNextButton = () =>
    getValidScooters().length - 1 <= getCurrentScooterIndex();

  getValidScooters = () => {
    return scooters.filter(
      scooter => scooter.status === 0 && scooter.distance <= 1200
    );
  };

  return (
    <View style={styles.scooterInfo}>
      <View style={styles.buttons}>
        <Button
          title='Prev.'
          onPress={() => moveToScooter(false)}
          disabled={selectedScooter.id !== undefined && checkEnablePrevButton()}
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
          onPress={() => moveToScooter(true)}
          disabled={selectedScooter.id !== undefined && checkEnableNextButton()}
        />
        <Button title='Center' onPress={() => setCenterMap(location)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
