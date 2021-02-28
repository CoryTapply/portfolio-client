import { useStore } from './StoreProvider';

export const useUploadVideo = () => {
  const { state, dispatch } = useStore();
  return {
    state: state.uploadVideo,
    play:             () => dispatch({ type: 'UploadVideoEvent-Play' }),
    pause:            () => dispatch({ type: 'UploadVideoEvent-Pause' }),
    mute:             () => dispatch({ type: 'UploadVideoEvent-Mute' }),
    fullscreen:       () => dispatch({ type: 'UploadVideoEvent-Fullscreen' }),
    setVideoRef: payload => dispatch({ type: 'UploadVideoEvent-Ref', payload }),
    setTrim:     payload => dispatch({ type: 'UploadVideoEvent-Trim', payload }),
    setVolume:   payload => dispatch({ type: 'UploadVideoEvent-Volume', payload }),
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
    mute:             () => dispatch({ type: 'VideoEvent-Mute' }),
    fullscreen:       () => dispatch({ type: 'VideoEvent-Fullscreen' }),
    setCurrentVideo: payload => dispatch({ type: 'VideoEvent-CurrentVideo', payload }),
    setOtherVideos:  payload => dispatch({ type: 'VideoEvent-OtherVideos', payload }),
    setVideoRef:     payload => dispatch({ type: 'VideoEvent-Ref', payload }),
    setVolume:       payload => dispatch({ type: 'VideoEvent-Volume', payload }),
    getVideoPlayerLeftBound: () => state.videoRef.current.getBoundingClientRect().left,
    getVideoPlayerWidth:     () => state.videoRef.current.getBoundingClientRect().width,
  };
};
