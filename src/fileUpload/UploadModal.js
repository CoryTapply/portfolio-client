import React, { Fragment, useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../core/components/Modal';
import Button from '../core/components/Button';
import { request } from '../core/utils/fetchRequest';
import { useUploadVideo } from '../dataProviders/VideoDataAPI';
import VideoPlayer from '../landing/player/VideoPlayer';
import VideoTrimmer from './VideoTrimmer';
import AudioWaveform from './AudioWaveform';
import './UploadModal.scss';
import TextInput from '../core/components/TextInput';
import ToggleInput from '../core/components/ToggleInput';

const UploadModal = () => {
  const { 
    state,
    closeModal,
    uploadFiles,
    setTrim,
    play,
    pause,
    toggleMute,
    setVideoRef,
    fastFoward,
    rewind,
    frameForward,
    frameBack,
    setTime,
    setVolume,
    setMetadata,
    getVideoPlayerLeftBound,
    getVideoPlayerWidth
  } = useUploadVideo();

  const [name, setName] = useState('');
  const [game, setGame] = useState('Warzone');
  const [tags, setTags] = useState('flick, win, snipe, funny, friend, aim, reaction time');
  const [enableVoiceChat, setEnableVoiceChat] = useState(false);

  const fullscreenContainerRef = useRef();

  const handleFiles = event => {
    const { files } = event.target;
    uploadFiles(files);
  };

  const handleUpload = () => {
    const data = new FormData();

    data.append('file', state.uploadedFiles[0]);
    data.append('start', state.videoTrim.trimStartTime);
    data.append('end', state.videoTrim.trimEndTime);
    data.append('videoName', name);
    data.append('videoGame', game);
    data.append('videoTags', tags);
    data.append('enableVoiceChat', enableVoiceChat);
    
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

  const handleFullscreen = () => {
    const { current: container } = fullscreenContainerRef;
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen();
      }
    }
    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if (container.mozRequestFullScreen) {
      container.mozRequestFullScreen(); // Firefox
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen(); // Chrome and Safari
    }
    setMetadata({ isFullscreen: !document.fullscreenElement });
  };

  const { isModalOpen, uploadedFiles, videoRef } = state;

  return (
    <Modal isOpen={isModalOpen} onCloseModal={closeModal}>
      <div className="UploadContent" ref={fullscreenContainerRef}>
        <input type="file" id="input" multiple onChange={handleFiles} />
        {uploadedFiles[0] && (
          <Fragment>
            <VideoPlayer
              onFullscreen={handleFullscreen}
              videoId="upload"
              srcUrl={URL.createObjectURL(uploadedFiles[0])}
              videoState={state}
              play={play}
              pause={pause}
              toggleMute={toggleMute}
              setVideoRef={setVideoRef}
              fastFoward={fastFoward}
              rewind={rewind}
              frameForward={frameForward}
              frameBack={frameBack}
              setTime={setTime}
              setMetadata={setMetadata}
              setVolume={setVolume}
            />
            {/* // // URL.revokeObjectURL() */}
            {videoRef && (
              <VideoTrimmer 
                state={state} 
                setTrim={setTrim}
                getVideoPlayerLeftBound={getVideoPlayerLeftBound}
                getVideoPlayerWidth={getVideoPlayerWidth}  
              />
            )}
            {videoRef && (
              <AudioWaveform 
                state={state} 
                setTrim={setTrim}
                getVideoPlayerLeftBound={getVideoPlayerLeftBound}
                getVideoPlayerWidth={getVideoPlayerWidth} 
              />
            )}
            <div className="UploadContent-Inputs">
              <TextInput placeholder="Video Name" value={name} setValue={setName} />
              <TextInput placeholder="Game Title" value={game} setValue={setGame} />
              <TextInput placeholder="Tags" value={tags} setValue={setTags} />
              <ToggleInput value={enableVoiceChat} setValue={setEnableVoiceChat} />
            </div>
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
