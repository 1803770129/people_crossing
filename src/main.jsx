import React from 'react'
import ReactDOM from 'react-dom/client';
import { HashRouter, Route, Switch } from 'react-router-dom'
import routerConfig from './router/index'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Switch>
        {
          routerConfig.routes.map((route) => {
            return (
              <Route key={route.path} {...route} />
            )
          })
        }
      </Switch>
    </HashRouter>
  </React.StrictMode>
)
