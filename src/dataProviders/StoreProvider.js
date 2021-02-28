import React, { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const StoreContext = createContext();

const initVideoData = ({ videoId, videoRef }) => {
  return {
    currentVideo: {
      videoId,
      videoRef,
      frameRate: 30,
      duration: 0,
      isPlaying: false,
      isMuted: false,
      volumePercent: 100,
      isFullscreen: false,
      currentTime: 0,
      hoverTime: 0,
      bufferedEnd: 0,
      hasError: false,
      isLoading: false,
    },
    uploadVideo: {
      uploadedFiles: [],
      isModalOpen: false,
      videoId: null,
      videoRef: null,
      duration: 0,
      isPlaying: false,
      isMuted: false,
      volumePercent: 100,
      isFullscreen: false,
      currentTime: 0,
      hoverTime: 0,
      videoTrim: {
        trimStartTime: 0,
        trimEndTime: 0,
        selectedWidth: 100,
        leftDistance: 0,
      },
    },
    otherVideos: []
  };
};

const dataReducer = (state, action) => {
  const { current: currentVideoElement } = state?.currentVideo?.videoRef || {};
  const { current: uploadVideoElement } = state?.uploadVideo?.videoRef || {};
  // TODO: Setup some custom events that can happen, Play, Mute Trim, Upload, New Video (Call init func)?
  switch (action.type) {
    // -------- CURRENT VIDEO -------- //
    case 'VideoEvent-Play':
      currentVideoElement.play();
      return { ...state, currentVideo: { ...state.currentVideo, isPlaying: true } };
    case 'VideoEvent-Pause':
      currentVideoElement.pause();
      return { ...state, currentVideo: { ...state.currentVideo, isPlaying: false } };
    case 'VideoEvent-ToggleMute':
      currentVideoElement.muted = action.payload;
      return { ...state, currentVideo: { ...state.currentVideo, isMuted: action.payload } };
    case 'VideoEvent-FastForward':
      currentVideoElement.currentTime += 5;
      return { ...state, currentVideo: { ...state.currentVideo } };
    case 'VideoEvent-Rewind':
      currentVideoElement.currentTime -= 5;
      return { ...state, currentVideo: { ...state.currentVideo } };
    case 'VideoEvent-FrameForward':
      currentVideoElement.currentTime += 1 / state.currentVideo.frameRate;
      currentVideoElement.pause();
      return { ...state, currentVideo: { ...state.currentVideo } };
    case 'VideoEvent-FrameBack':
      currentVideoElement.currentTime -= 1 / state.currentVideo.frameRate;
      currentVideoElement.pause();
      return { ...state, currentVideo: { ...state.currentVideo } };
    case 'VideoEvent-TimeUpdate':
      return { ...state, currentVideo: { ...state.currentVideo, currentTime: action.payload, isLoading: false } };
    case 'VideoEvent-Metadata':
      return { ...state, currentVideo: { ...state.currentVideo, ...action.payload } };
    case 'VideoEvent-CurrentVideo':
      return { ...state, currentVideo: { ...state.currentVideo, videoId: action.payload } };
    case 'VideoEvent-Ref':
      return { ...state, currentVideo: { ...state.currentVideo, videoRef: action.payload } };
    case 'VideoEvent-OtherVideos':
      return { ...state, otherVideos: [...action.payload] };

    // -------- UPLOAD VIDEO -------- //
    case 'UploadVideoEvent-Play':
      return { ...state, uploadVideo: { ...state.uploadVideo, isPlaying: true } };
    case 'UploadVideoEvent-Pause':
      return { ...state, uploadVideo: { ...state.uploadVideo, isPlaying: false } };
    case 'UploadVideoEvent-UploadFiles':
      return { ...state, uploadVideo: { ...state.uploadVideo, uploadedFiles: [ ...state.uploadVideo.uploadedFiles, ...action.payload ] } };
    case 'UploadVideoEvent-Trim':
      if (action.payload.selectedWidth !== undefined && action.payload.selectedWidth < 30) {
        action.payload.selectedWidth = 30;
        return { ...state };
      }
      if (action.payload.leftDistance && action.payload.leftDistance < 0) {
        action.payload.leftDistance = 0;
      }
      if (action.payload.trimStartTime) {
        uploadVideoElement.currentTime = action.payload.trimStartTime;
        uploadVideoElement.currentTime = action.payload.trimStartTime;
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
