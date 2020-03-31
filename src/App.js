import React from 'react';
import './App.css';
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import RewardsHome from '../src/components/RewardsHome/rewardsHome';
import { REWARDS_TITLE } from '../src/util/constants';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2 className="align-title">{REWARDS_TITLE}</h2>
        <Switch>
          <Route path='/rewards-summary' component={RewardsHome} />
          <Redirect from="*" to="/rewards-summary" />
        </Switch>
      </header>
    </div>
  );
}

export default App;
