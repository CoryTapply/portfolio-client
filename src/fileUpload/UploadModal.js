import React, { Fragment, useCallback } from 'react';
import PropTypes from 'prop-types';
import Modal from '../core/Modal';
import Button from '../core/Button';
import { request } from '../core/utils/fetchRequest';
import { useUploadVideo } from '../dataProviders/VideoDataAPI';
import VideoPlayer from '../landing/player/VideoPlayer';
import VideoTrimmer from './VideoTrimmer';
import AudioWaveform from './AudioWaveform';
import './UploadModal.scss';

const UploadModal = () => {
  const { state, closeModal, uploadFiles, setVideoRef, setTrim } = useUploadVideo();

  const handleFiles = event => {
    const { files } = event.target;
    uploadFiles(files);
  };

  const handleUpload = () => {
    const data = new FormData();
    data.append('file', state.uploadedFiles[0]);
    data.append('start', '00:02:30');
    data.append('end', '00:03:00');

    request('api/v1/uploadVideo', {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        console.log('response: ', response);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const { isModalOpen, uploadedFiles, videoRef } = state;

  console.log('RE-RENDERING MODAL');

  return (
    <Modal isOpen={isModalOpen} onCloseModal={closeModal}>
      <div className="UploadContent">
        <input type="file" id="input" multiple onChange={handleFiles} />
        {uploadedFiles[0] && (
          <Fragment>
            <VideoPlayer videoId="upload" srcUrl={URL.createObjectURL(uploadedFiles[0])} setVideoRef={setVideoRef} />
            {/* // // URL.revokeObjectURL() */}
            {videoRef && <VideoTrimmer state={state} setTrim={setTrim} />}
            {videoRef && <AudioWaveform state={state} setTrim={setTrim} />}
          </Fragment>
        )}
        <Button onClick={handleUpload}>Upload</Button>
      </div>
    </Modal>
  );
};

UploadModal.propTypes = {};

UploadModal.defaultProps = {};

export default UploadModal;
