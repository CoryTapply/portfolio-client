import React, { useEffect, useRef } from 'react';
import VideoPlayer from './player/VideoPlayer';
import VideoThumbnail from './VideoThumbnail';
import Grid from '../core/components/Grid';
import { useVideo } from '../dataProviders/VideoDataAPI';
import { request } from '../core/utils/fetchRequest';
import './LandingPage.scss';

const LandingPage = () => {
  const {
    state,
    play,
    pause,
    toggleMute,
    setVideoRef,
    fastFoward,
    rewind,
    frameForward,
    frameBack,
    setTime,
    setCurrentVideo,
    setOtherVideos,
    setMetadata,
    setVolume,
  } = useVideo();

  const fullscreenContainerRef = useRef();

  const handleClick = (e) => {
    setCurrentVideo(e.currentTarget.getAttribute('name'));
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

  useEffect(() => {
    request('api/v1/getVideos').then((data) => {
      setCurrentVideo(data?.videos[0]?.videoLocation || '');
      setOtherVideos(data.videos || []);
    });
  }, []);

  return (
    <div ref={fullscreenContainerRef} className="LandingPage-Container" tabIndex="-1">
      <VideoPlayer 
        onFullscreen={handleFullscreen}
        srcUrl={state.currentVideo.videoId}
        videoId={state.currentVideo.videoId} 
        videoState={state.currentVideo}
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
      <div className="LandingPage-VideoGrid">
        <Grid>
          {state.otherVideos.map((video) => (
            <VideoThumbnail 
              key={video.thumbnailLocation} 
              videoId={video.videoLocation} 
              location={video.thumbnailLocation} 
              handleClick={handleClick} 
              viewCount={video.viewCount}
              duration={video.duration}
              title={video.title}
            />
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default LandingPage;
