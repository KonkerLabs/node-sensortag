const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('localdb.json')
const db = low(adapter)

function addCredential(deviceId, username, password) {
    db.get('devices')
        .push({ id: deviceId, username: username, password: password})
        .write()
}

const findCredentialByDeviceId = (deviceId) => {
    return db.get('devices').find({ id: deviceId }).value()
}

const findByApplicationName = (applicationName) => {
    return db.get('applications').find({ app_name: applicationName }).value()
}

const findLocationByToken = (token) => {
    return db.get('locations').find({ token: token }).value()
}

const getParameter = (parameter) => {
    return db.get(parameter).write()
}

// **************** EXPORTS ****************

module.exports = {
    findLocationByToken,
    findByApplicationName,

    findCredentialByDeviceId,
    addCredential,

    getParameter
}