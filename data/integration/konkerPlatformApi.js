'use restrict';

require('../winstonConfig')

const axios   = require('axios');
const config  = require('../config.json');

const plataformTokenMap = new Map();

// **************** INIT ****************

const getToken = (application) => {
    return plataformTokenMap.get(application.id);
}

const requestToken = (application) => {

    // check in cache first
    if (application === null) {
        return Promise.reject('null application');
    } else if (plataformTokenMap.get(application.id)) {
        return Promise.resolve(plataformTokenMap.get(application.id));
    } else {
        LOGGER.debug(`[${application.app_name}] Getting access token`);

        let authHost  = `${config.konkerAPI.host}/v1/oauth/token`;
        let authUrl   = `?grant_type=client_credentials&client_id=${application.client_id}&client_secret=${application.client_secret}`;

        return axios
            .get(authHost + authUrl)
            .then(res => {
                try {
                    let token = res.data.access_token;
                    plataformTokenMap.set(application.id, token);
                    return token;
                } catch(e) {
                    throw e;
                }
            });
    }

}

// **************** SUPPORT FUNCTIONS ****************

const getGetPromise = (path, application) => {

    LOGGER.debug(`[${application.app_name}] GET ${path}`);

    return requestToken(application)
        .then(() => {
            return axios.get(`${config.konkerAPI.host}/v1/${application.app_name}${path}`,
            {
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken(application)}`
                }
            })
            .then(
                res =>  res.data.result
            );
        });

}

const getPutPromise = (path, body, application) => {

    LOGGER.debug(`[${application.app_name}] PUT ${path}`);

    return requestToken(application)
        .then(() => {
            return axios.put(`${config.konkerAPI.host}/v1/${application.app_name}${path}`,
            body,
            {
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken(application)}`
                }
            });
        });

}

const getPostPromise = (path, body, application) => {

    LOGGER.debug(`[${application.app_name}] POST ${path}`);

    return requestToken(application)
        .then(() => {
            return axios.post(`${config.konkerAPI.host}/v1/${application.app_name}${path}`,
                body,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getToken(application)}`
                    }
                });
        });

}

const getDeletePromise = (path, application) => {

    LOGGER.debug(`[${application.app_name}] DELETE ${path}`);

    return requestToken(application)
        .then(() => {
            return axios.delete(`${config.konkerAPI.host}/v1/${application.app_name}${path}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken(application)}`
                }
            });
        });

}

// **************** DEVICES ****************

const getDevicesPromise = (application) => {
    return getGetPromise('/devices/', application);
}

const getDeviceCredentialsPromise = (application, deviceGuid) => {
    return getGetPromise(`/deviceCredentials/${deviceGuid}`, application);
}

const getCreateDevicePromise = (application, deviceName) => {
    let path = '/devices';
    let body = {
        'id': deviceName,
        'name': deviceName,
        'active': true
    }
    return getPostPromise(path, body, application);
}

const getCreateDeviceCredentialsPromise = (application, deviceGuid) => {
    let path = `/deviceCredentials/${deviceGuid}`;
    let body = {}
    return getPostPromise(path, null, application);
}

// **************** LOCATIONS ****************

const getLocationsPromise = (application) => {
    return getGetPromise('/locations/', application);
}

const getLocationsByIdPromise = (roomId, application) => {
    return getGetPromise(`/locations/${roomId}`, application);
}

const getDevicesByLocationPromise = (roomId, application) => {
    return getGetPromise(`/locations/${roomId}/devices`, application);
}

// **************** EVENTS ****************

const getLastEventsPromise = (query, application) => {
    return getGetPromise(`/incomingEvents?${query}`, application);
}

// **************** EXPORTS ****************

module.exports = {
    getDevicesPromise,
    getDeviceCredentialsPromise,
    getCreateDevicePromise,
    getCreateDeviceCredentialsPromise,

    getLocationsPromise,
    getLocationsByIdPromise,
    getDevicesByLocationPromise,

    getLastEventsPromise
};