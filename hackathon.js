'use restrict';

const axios   = require('axios');

require('./data/winstonConfig')

const SensorTag = require('./index');
const localDB = require('./data/localdb');
const platform = require('./data/platform');

require('./webapp');

const DATA_URL = 'https://data.demo.konkerlabs.net'

LOGGER.info('waiting for a SensorTag bluetooth connection...');

SensorTag.discover(function(sensorTag) {

  let credentials = null;

  LOGGER.info('discovered: ' + sensorTag);

  sensorTag.on('disconnect', function() {
    LOGGER.info('disconnected!');
  });

  LOGGER.info('connectAndSetUp');
  sensorTag.connectAndSetUp(connectAndSetUpCallback);

  function connectAndSetUpCallback() {
      LOGGER.info('connected...');
      credentials = localDB.findCredentialByDeviceId(sensorTag.id);
      if (!credentials) {
          LOGGER.warn('device credentials not found')
          platform.createPlatformCredentials(sensorTag.id, connectAndSetUpCallback)
      } else {
          enableSensors();
      }
  };

  function enableSensors() {
      sensorTag.enableIrTemperature(temperatureReady);
      sensorTag.enableLuxometer(luxometerReady);
      sensorTag.enableHumidity(humidityReady);
  }

  function temperatureReady() {

      sensorTag.on('irTemperatureChange', function(objectTemperature, ambientTemperature) {
          LOGGER.info('\tobject temperature = %d °C', objectTemperature.toFixed(1));
          LOGGER.info('\tambient temperature = %d °C', ambientTemperature.toFixed(1))
          axios.post(`${DATA_URL}/pub/${credentials.username}/temperature`,
              {
                  object: parseFloat(objectTemperature.toFixed(1)),
                  ambient: parseFloat(ambientTemperature.toFixed(1))
              },
              {
              auth: {
                  username: credentials.username,
                  password: credentials.password
              }
          });
      });

      LOGGER.info('setIrTemperaturePeriod');
      sensorTag.setIrTemperaturePeriod(15000, function(error) {
          LOGGER.info('notifyIrTemperature');
          sensorTag.notifyIrTemperature();
      });

  }

  function luxometerReady() {

      sensorTag.on('luxometerChange', function(lux) {
          LOGGER.info('\tlux = %d', lux.toFixed(1));
          axios.post(`${DATA_URL}/pub/${credentials.username}/luxometer`,
              {
                  lux: parseFloat(lux.toFixed(1))
              },
              {
                  auth: {
                      username: credentials.username,
                      password: credentials.password
                  }
              });
      });

      LOGGER.info('setLuxometer');
      sensorTag.setLuxometerPeriod(15000, function(error) {
          LOGGER.info('notifyLuxometer');
          sensorTag.notifyLuxometer();
      });

  }

  function humidityReady() {

      sensorTag.on('humidityChange', function(temperature, humidity) {
          LOGGER.info('\ttemperature = %d °C', temperature.toFixed(1));
          LOGGER.info('\thumidity = %d %', humidity.toFixed(1));
          axios.post(`${DATA_URL}/pub/${credentials.username}/humidity`,
              {
                  temperature: parseFloat(temperature.toFixed(1)),
                  humidity: parseFloat(humidity.toFixed(1))
              },
              {
                  auth: {
                      username: credentials.username,
                      password: credentials.password
                  }
              });

      });

      LOGGER.info('setHumidityPeriod');
      sensorTag.setHumidityPeriod(15000, function(error) {
          LOGGER.info('notifyHumidity');
          sensorTag.notifyHumidity();
      });

  }

});
