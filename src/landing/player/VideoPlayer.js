import React, { Fragment, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ControlBar from './ControlBar';
import Button from '../../core/Button';
import Loading from '../../core/Loading';
import { withToast, Toast } from '../../core/Toast';
import './VideoPlayer.scss';

const VideoPlayer = props => {
  const { videoState, play, pause, toggleMute, setVideoRef, fastFoward, rewind, frameForward, frameBack, setTime, setMetadata, setVolume } = props;

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
  }, [videoState.videoId]);

  const { duration, currentTime, bufferedEnd, isPlaying, isLoading, isMuted, volumePercent, isFullscreen, hasError } = videoState;
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
        volumePercent={volumePercent}
        isFullscreen={isFullscreen}
        onFullscreen={props.onFullscreen}
        onUpdateTimeManual={handleUpdateTimeManual}
        onPlay={handlePlay}
        onRewind={handleRewind}
        onFastForward={handleFastForward}
        onMute={handleMute}
        onFrameForward={handleFrameForward}
        onFrameBack={handleFrameBack}
        setVolume={setVolume}
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
  videoState: PropTypes.object,
  play: PropTypes.func,
  pause: PropTypes.func,
  toggleMute: PropTypes.func,
  setVideoRef: PropTypes.func,
  fastFoward: PropTypes.func,
  rewind: PropTypes.func,
  frameForward: PropTypes.func,
  frameBack: PropTypes.func,
  setTime: PropTypes.func,
  setMetadata: PropTypes.func,
  setVolume: PropTypes.func,
};

VideoPlayer.defaultProps = {
  videoId: '',
  onFullscreen: () => console.log('Default PROP! No action taken.'),
  onShowToast: () => console.log('Default PROP! No action taken.'),
  videoState: {},
  play: () => console.log('Default PROP! No action taken.'),
  pause: () => console.log('Default PROP! No action taken.'),
  toggleMute: () => console.log('Default PROP! No action taken.'),
  setVideoRef: () => console.log('Default PROP! No action taken.'),
  fastFoward: () => console.log('Default PROP! No action taken.'),
  rewind: () => console.log('Default PROP! No action taken.'),
  frameForward: () => console.log('Default PROP! No action taken.'),
  frameBack: () => console.log('Default PROP! No action taken.'),
  setTime: () => console.log('Default PROP! No action taken.'),
  setMetadata: () => console.log('Default PROP! No action taken.'),
  setVolume: () => console.log('Default PROP! No action taken.'),
};

export default withToast(VideoPlayer);
