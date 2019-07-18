import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import {
    PageHeader,
    PageHeaderTitle,
    Main,
    SkeletonTable,
    TableToolbar
} from '@redhat-cloud-services/frontend-components';
import { Badge, Pagination } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import {
    Table,
    TableHeader,
    TableBody,
    sortable,
    TableVariant,
    SortByDirection,
    cellWidth
} from '@patternfly/react-table';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { onLoadApis } from '../store/actions';

const indexToKey = [ 'service', 'version' ];

function buildRows(sortBy, { page, perPage }, rows) {
    return rows.sort((curr, next) => {
        if (sortBy.index !== undefined) {
            const key = indexToKey[sortBy.index];
            if (sortBy.direction === SortByDirection.desc) {
                return curr[key] < next[key] ? 1 :
                    (next[key] < curr[key]) ? -1 : 0;
            } else {
                return curr[key] > next[key] ? 1 :
                    (next[key] > curr[key]) ? -1 : 0;
            }
        }

        return 0;
    })
    .slice((page - 1) * perPage, page * perPage)
    .map(({ service, version }) => [
        {
            title: service.replace('/api/', ''),
            value: service
        },
        { title: <Badge>{ version }</Badge> },
        {
            title: (
                <a
                    href={ `${location.origin}${service}/${version}/openapi.json` }
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={ e => {
                        e.preventDefault();
                        window.open(`${location.origin}${service}/${version}/openapi.json`, '_newtab');
                    } }
                >
                    Open Raw <ExternalLinkAltIcon size="sm" />
                </a>
            )
        }
    ]);
}

const columns = [
    { title: 'API endpoint', transforms: [ sortable ]},
    { title: 'API version', transforms: [ sortable, cellWidth(25) ]},
    { title: 'Action', transforms: [ cellWidth(10) ]}
];

const Overview = ({ loadApis, services, history }) => {
    useEffect(() => {
        loadApis();
    }, []);
    const [ sortBy, onSortBy ] = useState({});
    const [ pageSettings, onPaginate ] = useState({
        perPage: 50,
        page: 1
    });
    return (
        <React.Fragment>
            <PageHeader className="pf-m-light">
                <PageHeaderTitle title='Api documentation' />
            </PageHeader>
            <Main className="ins-c-docs__api">
                <React.Fragment>
                    <TableToolbar>
                        {
                            services.loaded ?
                                <Pagination
                                    itemCount={ services.endpoints.length }
                                    perPage={ pageSettings.perPage }
                                    page={ pageSettings.page }
                                    onSetPage={ (_e, page) => onPaginate({
                                        ...pageSettings,
                                        page
                                    }) }
                                    onPerPageSelect={ (_event, perPage) => onPaginate({
                                        ...pageSettings,
                                        perPage
                                    }) }
                                /> :
                                `loading`
                        }
                    </TableToolbar>
                    {
                        services.loaded ?
                            <Table
                                aria-label="Sortable Table"
                                variant={ TableVariant.compact }
                                sortBy={ sortBy }
                                onSort={ (_e, index, direction) => onSortBy({ index, direction }) }
                                cells={ columns }
                                rows={ buildRows(sortBy, pageSettings, services.endpoints) }
                            >
                                <TableHeader />
                                <TableBody onRowClick={ (_event, data) => {
                                    if (!event.target.matches('a') && data && data[0] && data[0].value) {
                                        history.push(`/${data[0].value.replace('/api/', '')}`);
                                    }
                                } }/>
                            </Table> :
                            <SkeletonTable columns={ columns } rowSize={ 28 } />
                    }
                </React.Fragment>
                <TableToolbar isFooter>
                    {
                        services.loaded ?
                            <Pagination
                                variant="bottom"
                                dropDirection="up"
                                itemCount={ services.endpoints.length }
                                perPage={ pageSettings.perPage }
                                page={ pageSettings.page }
                                onSetPage={ (_e, page) => onPaginate({
                                    ...pageSettings,
                                    page
                                }) }
                                onPerPageSelect={ (_event, perPage) => onPaginate({
                                    ...pageSettings,
                                    perPage
                                }) }
                            /> :
                            `loading`
                    }
                </TableToolbar>
            </Main>
        </React.Fragment>
    );
};

Overview.propTypes = {
    loadApis: PropTypes.func,
    services: PropTypes.shape({
        loaded: PropTypes.bool
    }),
    history: PropTypes.shape({
        push: PropTypes.func
    })
};
Overview.defaultProps = {
    loadApis: () => undefined,
    services: {
        loaded: false
    }
};

export default withRouter(connect(({ services }) => ({
    services
}), (dispatch) => ({ loadApis: () => dispatch(onLoadApis()) }))(Overview));
