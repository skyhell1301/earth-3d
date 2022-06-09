import React, {Suspense} from 'react'
import ReactDOM from 'react-dom/client'
import './assets/css/index.css'
import './assets/css/colors.css'
import App from './components/App'
import {Provider} from 'react-redux'
import store from './store/store'
import LoadingView from './components/View/LoadingView';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Suspense fallback={<LoadingView/>}>
      <Provider store={store}>
        <App/>
      </Provider>
    </Suspense>
  </React.StrictMode>
)
