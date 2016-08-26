import React from 'react';
import { render } from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'

import App from './app';
import Event from './event';

window.reactSchedule = (data) => {
    render((
        <Router history={hashHistory}>
            <Route path="/(:day)(/venue/:venue)(/page/:page)(/event/:event/:start)" component={App} data={data} />
            <Route path="*" component={App} data={data} />
        </Router>
    ), document.getElementById('react-timetable'));
};