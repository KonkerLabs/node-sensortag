const konkerPlatformApi = require('./integration/konkerPlatformApi');
const localDB = require('./localdb/index');

function createPlatformCredentials(tagId, callback) {

    const app = localDB.findByApplicationName('hackathonsaintgobain');
    const devicesPromise = konkerPlatformApi.getDevicesPromise(app)

    devicesPromise
        .then(results => {

            for (let device of results) {
                if (device.id === tagId) {
                    deviceCredentials(app, device, callback);
                    return;
                }
            }

            konkerPlatformApi.getCreateDevicePromise(app, tagId)
                .then(result => {
                    deviceCredentials(app, result.data.result, callback)
                })

        });

}

function deviceCredentials(app, tagDevice, callback) {

    LOGGER.info(`Creating credetials: ${tagDevice.id}`)

    konkerPlatformApi.getCreateDeviceCredentialsPromise(app, tagDevice.guid).then(result => {
        credentials = result.data.result
        localDB.addCredential(tagDevice.id, credentials.username, credentials.password)
        callback()
    })
    .catch(function (err) {
        LOGGER.error(err)
    })

}

// **************** EXPORTS ****************

module.exports = {
    createPlatformCredentials
};