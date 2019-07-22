import { versionMapper, DEFAULT_PREFIX } from './constants';
import instance from '@redhat-cloud-services/frontend-components-utilities/files/interceptors';
import { safeLoad } from 'js-yaml';

export const apiList = () => {
    return instance.get(`/${DEFAULT_PREFIX}`);
};

export const activeApi = () => instance.get('https://raw.githubusercontent.com/'
    + 'RedHatInsights/cloud-services-config/master/main.yml')
.then(data => safeLoad(data))
.then(data => ({
    services: Object.keys(data)
    .filter(oneAppKey => data[oneAppKey].api)
    .map(oneAppKey => ({
        appName: oneAppKey,
        ...data[oneAppKey]
    }))
}));

export const oneApi = ({ name, version = 'v1' }) => {
    const url = `/${DEFAULT_PREFIX}/${name}/${versionMapper[name] || version}/openapi.json`;
    return instance.get(url).then(data => ({
        ...data,
        latest: url
    }));
};
