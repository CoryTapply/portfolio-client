import React from 'react';
import ReactDOM from 'react-dom';
import NavigationBar from './navigation/NavigationBar';
import Footer from './footer/Footer';
import LandingPage from './landing/LandingPage';
import UploadModal from './fileUpload/UploadModal';
import { StoreProvider } from './dataProviders/StoreProvider';
// import { hot } from 'react-hot-loader/root';
import './main.scss';

const App = () => {
  return (
    <StoreProvider>
      <NavigationBar />
      <LandingPage />
      <Footer />
      <UploadModal />
    </StoreProvider>
  );
};

export default App;

ReactDOM.render(<App />, document.getElementById('app'));
