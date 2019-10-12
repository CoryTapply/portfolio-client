import React, {Fragment} from "react";
import ReactDOM from "react-dom";
import NavigationBar from "./navigation/NavigationBar";
import Footer from "./footer/Footer";
import LandingPage from "./landing/LandingPage";
import style from "./main.scss";

const App = () => {
  return (
    <Fragment>
      <NavigationBar />
      <LandingPage />
      <Footer />
    </Fragment>
  );
};

export default App;

ReactDOM.render(<App />, document.getElementById("app"));
