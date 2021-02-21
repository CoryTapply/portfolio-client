import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { hosts } from '../core/utils/fetchRequest';
import './AudioWaveform.scss';

let count = 0;

const AudioWaveform = ({ state: { videoRef, videoTrim: { trimStartTime, trimEndTime } }, setTrim }) => {
  // const [count, setCount] = useState(0);
  const [selectedWidth, setSelectedWidth] = useState(100);
  const [isScrubbingLeft, setIsScrubbingLeft] = useState(false);
  const [isScrubbingRight, setIsScrubbingRight] = useState(false);
  const [analyzer, setAnalyzer] = useState(null);
  
  const waveCanvasRef = useRef();

  let data;
  let context;

  const draw = (dataToDraw) => {
    const data2 = [...dataToDraw];
    context.clearRect(0, 0, waveCanvasRef.current.width, waveCanvasRef.current.height);
    const space = waveCanvasRef.current.width / data2.length;
    data2.forEach((value,i) => {
      console.log(value)
      context.lineWidth = 26;
      context.strokeStyle = 'orange';
      context.beginPath();
      context.moveTo(space*i, waveCanvasRef.current.height); //x,y
      context.lineTo(space*i, waveCanvasRef.current.height-value); //x,y
      context.stroke();
    });
  };

  const loopingFunction = () => {
    analyzer.getByteFrequencyData(data);
    console.log(data)
    draw(data);
    // requestAnimationFrame(loopingFunction);
  };

  if (waveCanvasRef.current) {

    context = waveCanvasRef.current.getContext('2d');
    if (videoRef.current) {
      if (count === 0) {
        console.log(count)
        count = 1;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        const analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaElementSource(videoRef.current);
        // const source = audioCtx.createMediaElementSource(videoRef.current);
        analyser.fftSize = 2048;
        source.connect(analyser);
        // analyser.connect(source);
        analyser.connect(audioCtx.destination);
        setAnalyzer(analyser);
      }
      if (analyzer) {
        data = new Uint8Array(analyzer.frequencyBinCount);
        requestAnimationFrame(loopingFunction);

      }
    }
  }

  return (
    <div
      className="AudioWaveform-Container"
      role="slider"
      // onMouseMove={handleScrubMove}
    >
      <canvas className="AudioWaveform-Canvas" ref={waveCanvasRef} />
    </div>
  );
};

AudioWaveform.propTypes = {
  state: PropTypes.shape({
    videoRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
    videoTrim: PropTypes.shape({ trimStartTime: PropTypes.number, trimEndTime: PropTypes.number }).isRequired,
  }).isRequired,
  setTrim: PropTypes.func.isRequired,
};

AudioWaveform.defaultProps = {
};

export default AudioWaveform;
