import './App.css';
import Main from './components/Main';
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import { BrowserRouter} from "react-router-dom";
import promise from "redux-promise";
import './index.css';
import 'antd/dist/antd.css'

import RootReducer from "./reducers";

//middleware settings
// To resolve promise to store we use apply
const composePlugin = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const createStoreWithMiddleware = applyMiddleware(promise)(createStore);
const store = createStore(RootReducer, composePlugin(applyMiddleware(promise)));
//createStoreWithMiddleware(RootReducer)

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <div>
      <Main/>
      </div>
    </BrowserRouter>
  </Provider>,
  document.querySelector(".container")
);

