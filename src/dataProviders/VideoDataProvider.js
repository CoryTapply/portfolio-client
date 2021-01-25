import { useReducer } from 'react';

const initVideoData = ({ videoId, videoRef }) => {
  return {
    videoId,
    videoRef,
    isPlaying: false,
    isMuted: false,
    volumePercent: 100,
    isFullscreen: false,
    currentTime: 0,
    hoverTime: 0,
    trimming: {
      trimStartTime: 0,
      trimEndTime: 0,
    }
  };
};

const videoDataReducer = (state, action) => {
  switch (action.type) {
    // case 'FETCHING':
    //   return { ...state, status: 'fetching' };
    // case 'FETCHED':
    //   return { ...state, status: 'fetched', data: action.payload };
    // case 'FETCH_ERROR':
    //   return { ...state, status: 'error', error: action.payload };
    // TODO: Setup some custom events that can happen, Play, Mute Trim, Upload, New Video (Call init func)?
    default:
      return { ...state, ...action.payload };
  }
};

const useVideoData = initArgs => {
  const [data, dispatch] = useReducer(videoDataReducer, initArgs, initVideoData);

  return { data, dispatch };
};

export default useVideoData;
