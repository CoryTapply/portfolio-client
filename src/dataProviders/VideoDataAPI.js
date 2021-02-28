import { useStore } from './StoreProvider';

export const useUploadVideo = () => {
  const { state, dispatch } = useStore();
  return {
    state: state.uploadVideo,
    play:             () => dispatch({ type: 'UploadVideoEvent-Play' }),
    pause:            () => dispatch({ type: 'UploadVideoEvent-Pause' }),
    toggleMute:  payload => dispatch({ type: 'UploadVideoEvent-ToggleMute', payload }),
    fullscreen:       () => dispatch({ type: 'UploadVideoEvent-Fullscreen' }),
    fastFoward:       () => dispatch({ type: 'UploadVideoEvent-FastForward' }),
    rewind:           () => dispatch({ type: 'UploadVideoEvent-Rewind' }),
    frameForward:     () => dispatch({ type: 'UploadVideoEvent-FrameForward' }),
    frameBack:        () => dispatch({ type: 'UploadVideoEvent-FrameBack' }),
    setTime:     payload => dispatch({ type: 'UploadVideoEvent-TimeUpdate', payload }),
    setMetadata: payload => dispatch({ type: 'UploadVideoEvent-Metadata', payload }),
    setVideoRef: payload => dispatch({ type: 'UploadVideoEvent-Ref', payload }),
    setVolume:   payload => dispatch({ type: 'UploadVideoEvent-Volume', payload }),
    setTrim:     payload => dispatch({ type: 'UploadVideoEvent-Trim', payload }),
    uploadFiles: payload => dispatch({ type: 'UploadVideoEvent-UploadFiles', payload }),
    openModal:        () => dispatch({ type: 'UploadVideoEvent-ModalOpen' }),
    closeModal:       () => dispatch({ type: 'UploadVideoEvent-ModalClose' }),
    getVideoPlayerLeftBound: () => state.uploadVideo.videoRef.current.getBoundingClientRect().left,
    getVideoPlayerWidth:     () => state.uploadVideo.videoRef.current.getBoundingClientRect().width,
  };
};

export const useVideo = () => {
  const { state, dispatch } = useStore();
  return {
    state,
    play:             () => dispatch({ type: 'VideoEvent-Play' }),
    pause:            () => dispatch({ type: 'VideoEvent-Pause' }),
    toggleMute:  payload => dispatch({ type: 'VideoEvent-ToggleMute', payload }),
    fullscreen:       () => dispatch({ type: 'VideoEvent-Fullscreen' }),
    fastFoward:       () => dispatch({ type: 'VideoEvent-FastForward' }),
    rewind:           () => dispatch({ type: 'VideoEvent-Rewind' }),
    frameForward:     () => dispatch({ type: 'VideoEvent-FrameForward' }),
    frameBack:        () => dispatch({ type: 'VideoEvent-FrameBack' }),
    setTime:     payload => dispatch({ type: 'VideoEvent-TimeUpdate', payload }),
    setMetadata:     payload => dispatch({ type: 'VideoEvent-Metadata', payload }),
    setCurrentVideo: payload => dispatch({ type: 'VideoEvent-CurrentVideo', payload }),
    setOtherVideos:  payload => dispatch({ type: 'VideoEvent-OtherVideos', payload }),
    setVideoRef:     payload => dispatch({ type: 'VideoEvent-Ref', payload }),
    setVolume:       payload => dispatch({ type: 'VideoEvent-Volume', payload }),
    getVideoPlayerLeftBound: () => state.videoRef.current.getBoundingClientRect().left,
    getVideoPlayerWidth:     () => state.videoRef.current.getBoundingClientRect().width,
  };
};
