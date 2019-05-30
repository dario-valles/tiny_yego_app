import { getDistance } from 'geolib';

const aviableScooterImage = require('../../static/images/markers/iconscooter_avail.png');
const bookedScooterImage = require('../../static/images/markers/iconscooter_booked.png');
const alertScooterImage = require('../../static/images/markers/iconscooter_alert.png');
const selectedScooterImage = require('../../static/images/markers/iconscooter_disabled.png');

export const getDistanceScooter = (scooters, userLocation) => {
  const resultScooters = scooters.map(scooter => {
    return {
      ...scooter,
      distance: getDistance(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude
        },
        { latitude: scooter.lat, longitude: scooter.lng }
      )
    };
  });
  resultScooters.sort((a, b) => a.distance - b.distance);
  return resultScooters;
};

export const scooterColor = (selectedScooter, scooter) => {
  if (selectedScooter.id === scooter.id) return selectedScooterImage;
  return scooter.status === 0
    ? aviableScooterImage
    : scooter.status === 1
    ? bookedScooterImage
    : alertScooterImage;
};
