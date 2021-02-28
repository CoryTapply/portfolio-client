import React, { Fragment, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ControlBar from './ControlBar';
import Button from '../../core/Button';
import Loading from '../../core/Loading';
import { withToast, Toast } from '../../core/Toast';
import { useVideo } from '../../dataProviders/VideoDataAPI';
import './VideoPlayer.scss';

const VideoPlayer = props => {
  const { state, play, pause, toggleMute, setVideoRef, fastFoward, rewind, frameForward, frameBack, setTime, setMetadata } = useVideo();

  const videoRef = useRef();

  const getCurrentBufferIndex = () => {
    const { current: videoElement } = videoRef;
    for (let i = 0; i < videoElement.buffered.length; i++) {
      if (
        videoElement.buffered.start(i) <= videoElement.currentTime &&
        videoElement.buffered.end(i) >= videoElement.currentTime
      ) {
        return i;
      }
    }
    return 0;
  };

  const handlePlay = () => {
    const { current: videoElement } = videoRef;

    if (videoElement.paused) {
      props.onShowToast('play');
      play();
    } else {
      props.onShowToast('pause');
      pause();
    }
  };

  const handleMute = () => {
    const { current: videoElement } = videoRef;
    toggleMute(!videoElement.muted);
    if (!videoElement.muted) {
      props.onShowToast('muted');
    }
  };

  const handleFastForward = () => {
    fastFoward();
    props.onShowToast('forwardFive');
  };

  const handleRewind = () => {
    rewind();
    props.onShowToast('rewindFive');
  };

  const handleFrameForward = () => {
    frameForward();
  };

  const handleFrameBack = () => {
    frameBack();
  };

  const handleTimeUpdate = () => {
    const { current: videoElement } = videoRef;
    setTime((100 / videoElement.duration) * videoElement.currentTime);
  };

  const handleUpdateTimeManual = (currentTime) => {
    setTime(currentTime);
  };

  const handleLoadMetadata = () => {
    setMetadata({
      currentTime: 0,
      bufferedEnd: 0,
      hasError: false,
    });
  };

  const handleDurationChange = () => {
    const { current: videoElement } = videoRef;
    setMetadata({
      duration: videoElement.duration
    });
  };

  const handleProgress = () => {
    const { current: videoElement } = videoRef;
    if (videoElement.buffered.length > 0) {
      const bufferedEnd = videoElement.buffered.end(getCurrentBufferIndex());
      setMetadata({
        bufferedEnd: (100 / videoElement.duration) * bufferedEnd
      });
    }
  };

  const handleError = () => {
    setMetadata({
      hasError: true,
    });
  };

  const handleLoadAttempt = () => {
    const { current: videoElement } = videoRef;
    if (videoElement) {
      videoElement.load();
    }
  };

  const handleWaiting = () => {
    setMetadata({
      isLoading: true,
    });
  };

  useEffect(() => {
    setVideoRef(videoRef);
  }, []);

  useEffect(() => {
    handleLoadAttempt();
  }, [state.currentVideo.videoId]);

  const { duration, currentTime, bufferedEnd, isPlaying, isLoading, isMuted, isFullscreen, hasError } = state.currentVideo;
  return (
    <Fragment>
      <div className="VideoPlayer-Container">
        {hasError && (
          <div className="VideoPlayer-Error">
            <span className="VideoPlayer-Error-Copy">An error occured while loading video.</span>
            <div>
              <Button onClick={handleLoadAttempt}>Try Again</Button>
            </div>
          </div>
        )}
        {isLoading && <Loading />}
        {props.toastIcon && <Toast key={props.toastKey} center cirlce icon={props.toastIcon} />}
        <video
          className="VideoPlayer-Video"
          autoPlay={false}
          preload="metadata"
          ref={videoRef}
          onTimeUpdate={handleTimeUpdate}
          onDurationChange={handleDurationChange}
          onLoadedMetadata={handleLoadMetadata}
          onWaiting={handleWaiting}
          onError={handleError}
          onProgress={handleProgress}
          onClick={handlePlay}
        >
          <source src={props.srcUrl} type="video/mp4" />
        </video>
      </div>
      <ControlBar
        videoRef={videoRef}
        duration={duration}
        currentTime={currentTime}
        bufferedEnd={bufferedEnd}
        isPlaying={isPlaying}
        isMuted={isMuted}
        isFullscreen={isFullscreen}
        onFullscreen={props.onFullscreen}
        onUpdateTimeManual={handleUpdateTimeManual}
        onPlay={handlePlay}
        onRewind={handleRewind}
        onFastForward={handleFastForward}
        onMute={handleMute}
        onFrameForward={handleFrameForward}
        onFrameBack={handleFrameBack}
      />
    </Fragment>
  );
};

VideoPlayer.propTypes = {
  onFullscreen: PropTypes.func,
  onShowToast: PropTypes.func,
  toastKey: PropTypes.number,
  toastIcon: PropTypes.string,
  srcUrl: PropTypes.string,
  videoId: PropTypes.string,
  setVideoRef: PropTypes.func,
};

VideoPlayer.defaultProps = {
  videoId: '',
  onFullscreen() {},
  onShowToast() {},
  setVideoRef() {},
};

export default withToast(VideoPlayer);
