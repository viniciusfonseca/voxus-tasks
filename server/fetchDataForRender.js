import url from 'url';
import { matchPath } from 'react-router-dom';

import { Home } from '../src/pages/Home';
import Login from '../src/pages/Login'

const routesThatFetchData = [
  {
    path: '/',
    component: Home,
    exact: true
  },
  {
    path: '/login',
    component: Login,
    exact: true
  }
];

const fetchDataForRender = (req, store) => {
  const promises = [];

  routesThatFetchData.some(route => {
    const match = matchPath(url.parse(req.url).pathname, route);
    if (match) {
      const promise = (route.component &&
        route.component.fetchData &&
        route.component.fetchData(store, match, req));
      promises.push(promise);
    }
    return match;
  });

  return Promise.all(promises);
}

export default fetchDataForRender;
