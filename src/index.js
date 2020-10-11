import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import NavigationBar from "./navigation/NavigationBar";
import Footer from "./footer/Footer";
import LandingPage from "./landing/LandingPage";
import UploadModal from "./fileUpload/UploadModal";
import Modal from "./core/Modal";
import style from "./main.scss";
import Button from "./core/Button";

class App extends React.Component {
  state = {
    isUploadModalOpen: false,
  };

  handleOpenUploadModal = e => {
    this.setState({ isUploadModalOpen: true });
  };

  handleCloseUploadModal = e => {
    this.setState({ isUploadModalOpen: false });
  };


  render() {
    console.log('State:', this.state)
    return (
      <Fragment>
        <NavigationBar onOpenUploadModal={this.handleOpenUploadModal}/>
        <LandingPage />
        <Footer />
        <UploadModal isUploadModalOpen={this.state.isUploadModalOpen} onCloseUploadModal={this.handleCloseUploadModal} />
      </Fragment>
    );
  }
}

export default App;

ReactDOM.render(<App />, document.getElementById("app"));
