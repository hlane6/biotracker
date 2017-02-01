import React from 'react';
import VideoCanvas from './VideoCanvas'

export default class Tracker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            paused: true,
            frame: 0,
        }
        this.handlePlayPause = this.handlePlayPause.bind(this);
        this.handleSeek = this.handleSeek.bind(this);
        this.handleDraw = this.handleDraw.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        return (
            <div>
                <VideoCanvas
                        paused={ this.state.paused }
                        frame={ this.state.frame }
                        src={ '/video' }
                        playPauseCallback={ this.handlePlayPause }
                        seekCallback={ this.handleSeek }
                        drawCallback={ this.handleDraw }
                        onClick={ this.handleClick }
                />
            </div>
        )
    }

    handlePlayPause(paused) {
        this.setState({ paused: paused });
    }

    handleSeek(frame) {
        this.setState({ frame: frame });
    }

    handleDraw() {
        this.setState((prevState, props) => { return {
            frame: prevState.frame + 1
        }});
    }

    handleClick(event) {
        console.log(event);
    }

}
