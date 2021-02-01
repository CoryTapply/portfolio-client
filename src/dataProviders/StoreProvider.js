import React, { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const StoreContext = createContext();

const initVideoData = ({ videoId, videoRef }) => {
  return {
    currentVideo: {
      videoId,
      videoRef,
      isPlaying: false,
      isMuted: false,
      volumePercent: 100,
      isFullscreen: false,
      currentTime: 0,
      hoverTime: 0,
    },
    uploadVideo: {
      isModalOpen: false,
      videoId: null,
      videoRef: null,
      isPlaying: false,
      isMuted: false,
      volumePercent: 100,
      isFullscreen: false,
      currentTime: 0,
      hoverTime: 0,
      videoTrim: {
        trimStartTime: 0,
        trimEndTime: 0,
      },
    },
  };
};

const dataReducer = (state, action) => {
  // TODO: Setup some custom events that can happen, Play, Mute Trim, Upload, New Video (Call init func)?
  switch (action.type) {
    // case 'FETCHING':
    //   return { ...state, status: 'fetching' };
    // case 'FETCHED':
    //   return { ...state, status: 'fetched', data: action.payload };
    // case 'FETCH_ERROR':
    //   return { ...state, status: 'error', error: action.payload };
    case 'UploadVideoEvent-Play':
      return { ...state, uploadVideo: { ...state.uploadVideo, isPlaying: true } };
    case 'UploadVideoEvent-Pause':
      return { ...state, uploadVideo: { ...state.uploadVideo, isPlaying: false } };
    case 'UploadVideoEvent-ModalOpen':
      return { ...state, uploadVideo: { ...state.uploadVideo, isModalOpen: true } };
    case 'UploadVideoEvent-ModalClose':
      return { ...state, uploadVideo: { ...state.uploadVideo, isModalOpen: false } };
    default:
      return { ...state, ...action.payload };
  }
};

export const StoreProvider = ({ children, initArgs }) => {
  const [state, dispatch] = useReducer(dataReducer, initArgs, initVideoData);

  console.log('GLOBAL STATE');
  console.log(state);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

StoreProvider.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  initArgs: PropTypes.shape({
    videoId: PropTypes.number,
    videoRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  }),
};

StoreProvider.defaultProps = {
  initArgs: {}
};

export const useStore = () => useContext(StoreContext);
