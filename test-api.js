const konkerPlatformApi = require('./data/integration/konkerPlatformApi');
const localDB = require('./data/localdb');

var app = localDB.findByApplicationName('hackathonsaintgobain');

var devicesPromisse = konkerPlatformApi.getDevicesPromise(app)

var tagId = 'b0b448c8f501'

devicesPromisse
    .then(results => {

        for (let device of results) {
            if (device.id === tagId) {
                deviceCredentials(device);
                return;
            }
        }

        konkerPlatformApi.getCreateDevicePromise(app, tagId)
            .then(result => {
                deviceCredentials(result.data.result)
            })

    });

function deviceCredentials(tagDevice) {
    LOGGER.info(`Creating credetials: ${tagDevice.id}`)

    konkerPlatformApi.getCreateDeviceCredentialsPromise(app, tagDevice.guid).then(result=>{
        credentials = result.data.result
        localDB.addCredential(tagDevice.id, credentials.username, credentials.password)
        })
        .catch(function (err) {
            LOGGER.error(err)
        })

}