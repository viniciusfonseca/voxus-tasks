import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter, matchPath } from 'react-router-dom';
import Helmet from 'react-helmet';
import url from 'url'

import indexHtml from './indexHtml';
import App from '../src/App';
import configureStore from '../src/utils/configureStore';
import fetchDataForRender from './fetchDataForRender';

const host = "http://localhost:3000"

const renderServerSideApp = (req, res) => {
  const store = configureStore(undefined, { logger: false });

  function render() {
    fetchDataForRender(req, store).then(() => {
      const context = {};
  
      const markup = ReactDOMServer.renderToString(
        <Provider store={store}>
          <StaticRouter location={req.url} context={context}>
            <App />
          </StaticRouter>
        </Provider>
      );
  
      if (context.url) {
        res.redirect(context.url);
      } else {
        const helmet = Helmet.renderStatic();
        const fullMarkup = indexHtml({
          initialState: store.getState(),
          helmet,
          markup
        });
  
        res.status(200).send(fullMarkup);
      }
    });
  }

  function redirectToLogin() {
    res.cookie('jwt', "", { maxAge: 0, httpOnly: true })
    res.redirect('/login')
  }

  const { jwt } = req.cookies
  if (!jwt && !matchPath(url.parse(req.url).pathname, { path: '/login' })) {
    redirectToLogin()
  }
  else if (jwt) {
    fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${req.cookies.jwt}`)
      .then(r => r.json())
      .then(validated => {
        store.dispatch({ type: 'SET_USER_INFO', email: validated.email })
        render()
      })
      .catch(e => {
        redirectToLogin()
      })
  }
  else {
    render()
  }
};

export default renderServerSideApp;
