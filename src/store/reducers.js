import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import * as ACTIONS from './actionTypes';
import { versionMapper } from '../api/constants';

const defaultState = { loaded: false };
const disabledApis = [ '/api/webhooks', '/api/aiops-insights-clustering' ];

function dataLoaded(state, { payload }) {
    return {
        ...state,
        endpoints: payload && payload
        .services
        .filter(service => !disabledApis.includes(service))
        .map(service => ({
            service,
            version: versionMapper[`${service.replace('/api/', '')}`] || 'v1'
        })),
        loaded: true
    };
}

function detailLoaded(state, { payload: { latest, ...payload }}) {
    return {
        ...state,
        spec: payload,
        latest,
        loaded: true
    };
}

export const services = applyReducerHash({
    [`${ACTIONS.LOAD_ALL}_FULFILLED`]: dataLoaded,
    [`${ACTIONS.LOAD_ALL}_PENDING`]: () => ({ loaded: false })
}, defaultState);

export const detail = applyReducerHash({
    [`${ACTIONS.LOAD_ONE_API}_FULFILLED`]: detailLoaded,
    [`${ACTIONS.LOAD_ONE_API}_PENDING`]: () => ({ loaded: false })
}, defaultState);
