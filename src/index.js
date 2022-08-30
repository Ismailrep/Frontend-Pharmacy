import React, { Suspense, lazy } from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import ReactDOM from "react-dom/client";
import "./assets/scss/dashlite.scss";
import "./assets/scss/style-email.scss";
import { BrowserRouter as Router, Route } from "react-router-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import rootReducer from "./redux/reducers";

const Error404Modern = lazy(() => import("./pages/error/404-modern"));

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <React.Fragment>
      <Suspense fallback={<div />}>
        <Router basename={`/`}>
          <Route render={({ location }) => (location.state && location.state.is404 ? <Error404Modern /> : <App />)} />
        </Router>
      </Suspense>
    </React.Fragment>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
