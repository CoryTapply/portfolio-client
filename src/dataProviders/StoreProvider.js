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
      uploadedFiles: [],
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
  const { current: videoElement } = state?.uploadVideo?.videoRef || {};
  // TODO: Setup some custom events that can happen, Play, Mute Trim, Upload, New Video (Call init func)?
  switch (action.type) {
    case 'UploadVideoEvent-Play':
      return { ...state, uploadVideo: { ...state.uploadVideo, isPlaying: true } };
    case 'UploadVideoEvent-Pause':
      return { ...state, uploadVideo: { ...state.uploadVideo, isPlaying: false } };
    case 'UploadVideoEvent-UploadFiles':
      return { ...state, uploadVideo: { ...state.uploadVideo, uploadedFiles: [ ...state.uploadVideo.uploadedFiles, ...action.payload ] } };
    case 'UploadVideoEvent-Trim':
      if (action.payload.trimStartTime) {
        videoElement.currentTime = action.payload.trimStartTime;
      }
      return { ...state, uploadVideo: { ...state.uploadVideo, videoTrim: { ...state.uploadVideo.videoTrim, ...action.payload } } };
    case 'UploadVideoEvent-Ref':
      return { ...state, uploadVideo: { ...state.uploadVideo, videoRef: action.payload } };
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

  console.log('GLOBAL STATE FROM PROVIDER', state);

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
