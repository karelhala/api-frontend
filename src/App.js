import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';
import { Routes } from './Routes';
import './App.scss';

const App = () => {
  useEffect(() => {
    insights.chrome.init();
    insights.chrome.identifyApp('api-docs');
  }, []);

  return (
    <React.Fragment>
      <NotificationsPortal />
      <Routes />
    </React.Fragment>
  );
};

App.propTypes = {
  history: PropTypes.object,
};

export default App;
