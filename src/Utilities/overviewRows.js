import React from 'react';
import {
    Badge,
    Bullseye,
    EmptyState,
    Title,
    EmptyStateBody,
    EmptyStateVariant
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { sortable, SortByDirection, cellWidth } from '@patternfly/react-table';
import { EmptyTable } from '@redhat-cloud-services/frontend-components';

const indexToKey = [ 'title', 'appName', 'version' ];

export const columns = [
    { title: 'Application name', transforms: [ sortable ]},
    { title: 'API endpoint', transforms: [ sortable ]},
    { title: 'API version', transforms: [ sortable, cellWidth(10) ]},
    { title: 'Action', transforms: [ cellWidth(10) ]}
];

export const rowMapper = (title, appName, version) => ([
    {
        title,
        value: appName
    },
    `/api/${appName}`,
    { title: <Badge>{ version }</Badge> },
    {
        title: (
            <a
                href={ `${location.origin}/api/${appName}/${version}/openapi.json` }
                target="_blank"
                rel="noopener noreferrer"
            >
                Open Raw <ExternalLinkAltIcon size="sm" />
            </a>
        )
    }
]);

export const emptyTable = [{
    cells: [{
        title: (<EmptyTable>
            <Bullseye>
                <EmptyState variant={ EmptyStateVariant.full }>
                    <Title headingLevel="h5" size="lg">
                        No matching rules found
                    </Title>
                    <EmptyStateBody>
                        This filter criteria matches no rules. <br /> Try changing your filter settings.
                    </EmptyStateBody>
                </EmptyState>
            </Bullseye>
        </EmptyTable>),
        props: {
            colSpan: columns.length
        }
    }]
}];

export function sortRows(curr, next, key, isDesc) {
    if (key !== undefined) {
        if (isDesc) {
            return curr[key] < next[key] ? 1 :
                (next[key] < curr[key]) ? -1 : 0;
        } else {
            return curr[key] > next[key] ? 1 :
                (next[key] > curr[key]) ? -1 : 0;
        }
    }

    return 0;
}

export function buildRows(sortBy, { page, perPage }, rows) {
    if (rows.length > 0) {
        return rows.sort((curr, next) =>
            sortRows(
                curr,
                next,
                indexToKey[sortBy.index],
                sortBy.direction === SortByDirection.desc)
        )
        .slice((page - 1) * perPage, page * perPage)
        .map(({ title, appName, version }) => rowMapper(title, appName, version));
    }

    return emptyTable;
}

export function filterRows(row, filter) {
    return indexToKey.some(key => row[key] &&
        row[key].toLocaleLowerCase().indexOf(filter.toLocaleLowerCase()) !== -1
    );
}
