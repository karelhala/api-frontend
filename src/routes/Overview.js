import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
    PageHeader,
    PageHeaderTitle,
    Main,
    SkeletonTable,
    TableToolbar
} from '@redhat-cloud-services/frontend-components';
import { Pagination, Level, LevelItem } from '@patternfly/react-core';
import { Table, TableHeader, TableBody, TableVariant } from '@patternfly/react-table';
import { connect } from 'react-redux';
import { onLoadApis } from '../store/actions';
import { SimpleTableFilter } from '@redhat-cloud-services/frontend-components';
import { filterRows, buildRows, columns } from '../Utilities/overviewRows';

const Overview = ({ loadApis, services, history }) => {
    useEffect(() => {
        loadApis();
    }, []);
    const [ sortBy, onSortBy ] = useState({});
    const [ pageSettings, onPaginate ] = useState({
        perPage: 50,
        page: 1
    });
    const [ filter, onChangeFilter ] = useState('');
    const filtered = filter && services.endpoints.filter(row => filterRows(row, filter));
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
                                <Level className="ins-c-docs__api-overview-toolbar">
                                    <LevelItem>
                                        <SimpleTableFilter
                                            onFilterChange={ (value) => {
                                                onPaginate({
                                                    ...pageSettings,
                                                    page: 1
                                                });
                                                onChangeFilter(value);
                                            } }
                                            buttonTitle={ null }
                                        />
                                    </LevelItem>
                                    <LevelItem>
                                        <Pagination
                                            itemCount={ (filtered || services.endpoints).length }
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
                                        />
                                    </LevelItem>
                                </Level> :
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
                                rows={ buildRows(sortBy, pageSettings, filtered || services.endpoints) }
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
                                itemCount={ (filtered || services.endpoints).length }
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
