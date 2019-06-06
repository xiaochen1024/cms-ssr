import { Component } from 'react';
import Texty from 'rc-texty';
import rcTexty from 'rc-texty/assets/index.css';
import raf from 'raf';
import timeLinePng from '../static/img/timeLine.png';

export default class TimeLine extends Component {
  constructor(props) {
    const { circleWidth = 500, ircleHeight = 500, timeLineNodes = [] } = props;
    super(props);
    this.state = {
      selectedNode: timeLineNodes[0],
    };
    this.selectedIndex = 0;
    this.width = circleWidth;
    this.height = ircleHeight;
    this.nodes = timeLineNodes;
  }

  componentDidMount() {
    this.context = this.canvas.getContext('2d');
    this.canvas.addEventListener('mousemove', this.handleClick, false);
    this.draw();
    this.drawBg();
    this.animate();
  }

  componentWillUnmount() {
    if (this.rafId) {
      raf.cancel(this.rafId);
    }
    this.canvas.removeEventListener('mousemove', this.handleClick);
  }

	drawBg = () => {
	  let context = this.anmiCanvas.getContext('2d');
	  const img = new Image();
	  img.src = timeLinePng;
	  img.onload = () => {
	    context = this.bgCanvas.getContext('2d');
	    context.drawImage(img, 150, 200);
	  };
	};

	animate = () => {
	  const minR1 = 190;
	  const minR2 = 130;
	  const maxR = 250;
	  let R1 = minR1;
	  let R2 = minR2;
	  const drawAnimate = () => {
	    const context = this.anmiCanvas.getContext('2d');
	    context.clearRect(0, 0, this.width, this.height);
	    R1 += 1;
	    R2 += 1;
	    if (R1 >= maxR) {
	      R1 = minR2;
	    }
	    if (R2 >= maxR) {
	      R2 = minR2;
	    }
	    const arcX = this.width / 2;
	    const arcY = this.height / 2;

	    context.strokeStyle = 'rgba(28,174,255,0.4)';
	    context.beginPath();
	    context.arc(arcX, arcY, R1, 0, 2 * Math.PI, true);
	    context.stroke();
	    // if (R2 >= minR1) {
	    context.beginPath();
	    context.arc(arcX, arcY, R2, 0, 2 * Math.PI, true);
	    context.stroke();
	    // }

	    if (this.rafId) {
	      raf.cancel(this.rafId);
	    }
	    this.rafId = raf(drawAnimate);
	  };
	  this.rafId = raf(drawAnimate);
	};

	handleClick = (e) => {
	  const p = this.getEventPosition(e);
	  this.draw(p);
	  // console.log('in', who);
	};

	draw = (p) => {
	  const arcX = this.width / 2;
	  const arcY = this.height / 2;
	  const arcR = 250;
	  const arcStart = 0.8;
	  const arcEnd = 1.2;

	  // const colorOffset = 50;
	  // const colorMinR = 100;
	  // const colorMaxR = 500;

	  // console.log('click', p);
	  this.context = this.canvas.getContext('2d');
	  this.context.save();
	  this.context.clearRect(0, 0, this.width, this.height);
	  const who = [];
	  // const gr = this.context.createRadialGradient(
	  //   this.width + colorOffset,
	  //   colorOffset,
	  //   colorMinR,
	  //   this.width - colorOffset,
	  //   this.height - colorOffset,
	  //   colorMaxR,
	  // );
	  // gr.addColorStop(0, 'rgb(255,0,0)');
	  // gr.addColorStop(0.5, 'rgb(0,255,0)');
	  // gr.addColorStop(1, 'rgb(255,0,0)');
	  // this.context.strokeStyle = gr;
	  this.context.strokeStyle = 'rgb(35,40,54)';
	  this.context.beginPath();
	  this.context.arc(arcX, arcY, arcR, arcStart * Math.PI, arcEnd * Math.PI, true);
	  this.context.stroke();
	  this.context.beginPath();
	  // this.context.arc(arcX, arcY, 100, 0, 2 * Math.PI, true);
	  // this.context.fillStyle = 'rgb(241, 245, 247)';
	  // this.context.fill();

	  this.context.translate(arcX, arcY);
	  this.nodes.forEach((v, i) => {
	    const rad =				(((2 - arcEnd + arcStart) * Math.PI) / (this.nodes.length - 1)) * i + arcEnd * Math.PI; //eslint-disable-line
	    const x = Math.cos(rad) * (arcR + 28);
	    const y = Math.sin(rad) * (arcR + 28);
	    const x1 = Math.cos(rad) * arcR;
	    const y1 = Math.sin(rad) * arcR;
	    this.context.font = '16px sans-serif';
	    this.context.textAlign = 'center';
	    this.context.textBaseline = 'middle';

	    this.context.beginPath();
	    this.context.strokeStyle = 'rgba(255, 255, 255, 0)';
	    this.context.arc(x, y, 22, 0, 2 * Math.PI, true);
	    this.context.stroke();

	    if (p && this.context.isPointInPath(p.x, p.y)) {
	      this.selectedIndex = i;
	      this.setState({ selectedNode: v }, () => {
	        this.context = this.canvas.getContext('2d');
	      });
	      who.push(i);
	    }

	    this.context.beginPath();
	    this.context.fillStyle = 'rgb(28,174,255)';
	    this.context.arc(x1, y1, 6, 0, 2 * Math.PI, true);
	    this.context.fill();
	  });

	  const drawText = () => {
	    this.nodes.forEach((v, i) => {
	      const rad =					(((2 - arcEnd + arcStart) * Math.PI) / (this.nodes.length - 1)) * i + arcEnd * Math.PI; //eslint-disable-line
	      const x = Math.cos(rad) * (arcR + 32);
	      const y = Math.sin(rad) * (arcR + 32);
	      if (this.selectedIndex === i) {
	        this.context.fillStyle = 'rgb(28,174,255)';
	      } else {
	        this.context.fillStyle = '#000';
	      }
	      this.context.fillText(v.time, x, y);
	    });
	  };
	  drawText();

	  this.context.translate(-arcX, -arcY);
	  this.context.restore();
	  return who;
	};

	getEventPosition = (ev) => {
	  let x;
	  let y;
	  if (ev.layerX || ev.layerX === 0) {
	    x = ev.layerX;
	    y = ev.layerY;
	  } else if (ev.offsetX || ev.offsetX === 0) {
	    // Opera
	    x = ev.offsetX;
	    y = ev.offsetY;
	  }
	  return { x, y };
	};

	render() {
	  const { selectedNode } = this.state;
	  const [year = '', month = ''] = selectedNode.time ? selectedNode.time.split('.') : [];

	  return (
  <div className="timeLine">
    <div className="timeLineMsg">
      <div style={{ fontSize: 40, width: 124, marginBottom: 50 }}>大事记</div>
      <div style={{ fontSize: 72, width: 160 }}>{year}</div>
      <div style={{ fontSize: 40, width: 40 }}>-</div>
      <div style={{ fontSize: 72, width: 135 }}>
        {month}
月
      </div>
      {/* <p style={{ fontSize: 18, color: '#232836' }}> */}
      <Texty
        style={{ fontSize: 18, color: '#232836' }}
        type="right"
        mode="sync"
        interval={10}
        leave={() => ({
						  y: -200,
						  opacity: 0,
						  duration: 0,
        })}
      >
        {selectedNode.msg}
      </Texty>
      {/* </p> */}
    </div>
    <div style={{ position: 'relative' }}>
      <canvas
        id="canvas"
        ref={(ins) => {
						  this.canvas = ins;
        }}
        width={this.width}
        height={this.height}
        className="timeLineCanvas"
      />
      <canvas
        id="anmi"
        ref={(ins) => {
						  this.anmiCanvas = ins;
        }}
        width={this.width}
        height={this.height}
        style={{
						  position: 'absolute',
						  zIndex: -2,
						  left: 0,
        }}
      />
      <canvas
        id="bgCanvas"
        ref={(ins) => {
						  this.bgCanvas = ins;
        }}
        width={this.width}
        height={this.height}
        style={{
						  position: 'absolute',
						  zIndex: -2,
						  left: 0,
        }}
      />
    </div>

    <style jsx>
      {`
						.timeLine {
							display: flex;
							width: 70%;
							margin: 0 auto;
							justify-content: space-between;
						}
						.timeLine .timeLineMsg {
							padding-top: 150px;
						}
						.timeLine .timeLineMsg div {
							background-image: -webkit-linear-gradient(right, rgb(28, 174, 255), rgb(21, 94, 212));
							-webkit-background-clip: text;
							-webkit-text-fill-color: transparent;
						}
						.timeLine .timeLineCanvas {
						}
					`}
    </style>
    <style dangerouslySetInnerHTML={{ __html: rcTexty }} />
  </div>
	  );
	}
}
