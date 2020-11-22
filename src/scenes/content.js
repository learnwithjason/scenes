/** @jsx h */
import { h, Fragment } from 'preact';
import { Switch, Route } from 'react-router-dom';
import { Interview } from './interview.js';
import { Monologue } from './monologue.js';
import { PairProgramming } from './pair-programming.js';
import { Solo } from './solo.js';

export function Content() {
  return (
    <Fragment>
      <Switch>
        <Route path="/interview">
          <Interview />
        </Route>
        <Route path="/monologue">
          <Monologue />
        </Route>
        <Route path="/pair-programming">
          <PairProgramming />
        </Route>
        <Route path="/solo">
          <Solo />
        </Route>
      </Switch>
    </Fragment>
  );
}
