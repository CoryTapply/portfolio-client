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
  };
};

export const useCounter = () => {
  const { state, dispatch } = useStore();
  return {
    count: state.count,
    message: state.message,
    increment: () => dispatch({ type: 'increment', message:'Incremented' }),
    decrement: () => dispatch({ type: 'decrement', message: 'Decremented' }),
    reset: () => dispatch({ type: 'reset', message: 'Reset' })
  };
};
