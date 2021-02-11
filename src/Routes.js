import { Route, Switch } from 'react-router-dom';
import React, { lazy, Suspense, Fragment } from 'react';
const Overview = lazy(() =>
  import(/* webpackChunkName: "Overview" */ './routes/Overview')
);
const Detail = lazy(() =>
  import(/* webpackChunkName: "Detail" */ './routes/Detail')
);

const paths = {
  overview: '/',
  detail: '/:apiName',
  detailVersioned: '/:apiName/:version',
};

export const Routes = () => {
  return (
    <Suspense fallback={<Fragment />}>
      <Switch>
        <Route exact path={paths.overview} component={Overview} />
        <Route exact path={paths.detail} component={Detail} />
        <Route exact path={paths.detailVersioned} component={Detail} />
        <Route component={Overview} />
      </Switch>
    </Suspense>
  );
};
