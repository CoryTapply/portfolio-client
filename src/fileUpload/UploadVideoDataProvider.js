import React from 'react';
import { useUploadVideo } from '../dataProviders/VideoDataAPI';
import UploadModal from './UploadModal';

const UploadVideoDataProvider = () => {
  const { state, closeModal } = useUploadVideo();

  console.log('Upload Video Global State: ', state);

  return (
    <UploadModal
      isUploadModalOpen={state.isModalOpen}
      onCloseUploadModal={closeModal}
    />
  );
};

UploadVideoDataProvider.propTypes = {};

UploadVideoDataProvider.defaultProps = {};

export default UploadVideoDataProvider;
