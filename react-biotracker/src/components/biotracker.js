import React from "react";
import Composer from "../models/composer";
import Corrections from "./corrections";
import Header from "./header";
import VideoCanvas from "./video-canvas";
import Splash from "./splash";

/**
 * TODO: Add starting screen with uploading of videos form
 * TODO: Think about separating components
 *      - Separate  mode controls
 * TODO: Add editing of data - hardest
 *      - exchanging
 */

/**
 * Small demo component
 * Currently moves bounding boxes side to side, allows
 * for playing, pausing of animation, skipping frame,
 * jumpting to frames, scrubbing through the video,
 * and deleting of boxes
 */
export default class Biotracker extends React.Component {

    static modes = {
        EXCHANGE: "exchange",
        DELETE: "delete"
    };

    static FPS = 30.0;

    constructor(props) {
        super(props);

        this.handlePlayPause = this.handlePlayPause.bind(this);
        this.handleSeek = this.handleSeek.bind(this);
        this.handleDraw = this.handleDraw.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleCorrection = this.handleCorrection.bind(this);

        this.__composer = new Composer(process.env.PUBLIC_URL + "/data.csv", this.handleCorrection);

        this.state = {
            current: 0,
            bboxes: [],
            paused: true,
            picks: null,
            mode: Biotracker.modes.DELETE,
            time: 0.0,
            frame: 1,
            corrections: [],
        };
    }

    render() {
        return (
            <div>
                <VideoCanvas
                    paused={ this.state.paused }
                    bboxes={ this.state.bboxes }
                    time={ this.state.time }
                    frame={ this.state.frame }
                    onClick={ this.handleClick }
                    playPauseCallback={ this.handlePlayPause }
                    seekCallback={ this.handleSeek }
                    drawCallback={ this.handleDraw }
                />
                <Corrections
                    corrections={ this.state.corrections }
                />
            </div>
        );
    }

    handlePlayPause(paused) {
        this.setState((prevState, props) => ({
            paused: paused
        }));
    }

    handleSeek(frame) {
        const boxes = this.__composer.get(frame);
        if (boxes) {
            this.setState({
                bboxes: this.__composer.get(frame),
                frame: frame
            });
        }
    }

    handleDraw(frame) {
        const nextBoxes = this.__composer.next();
        if ( nextBoxes == null ) { return; }
        this.setState((prevState, props) => { return {
            bboxes: nextBoxes,
            frame: prevState.frame + 1
        }});
    }

    handleCorrection(corrections) {
        this.setState({
            corrections: corrections,
        });
    }

    switchToDelete() {
        this.setState({ mode: Biotracker.modes.DELETE });
    }

    switchToExchange() {
        this.setState({ mode: Biotracker.modes.EXCHANGE });
    }

    handleClick(event) {
        const { mode } = this.state;
        const { offsetX, offsetY } = event.nativeEvent;

        switch (mode) {
            case Biotracker.modes.EXCHANGE:
                this.handleExchange(offsetX, offsetY);
                break;
            case Biotracker.modes.DELETE:
                this.handleDelete(offsetX, offsetY)
                break;
            default:
                break;
        }
    }

    handleExchange(offsetX, offsetY) {
        for (let i = 0; i < this.state.bboxes.length; i++) {
            const box = this.state.bboxes[i];
            if (box.detectHit(offsetX, offsetY)) {
                const { bboxes, pick } = this.state;

                if (pick == null) {
                    this.setState({ pick: { index: i, box: box }});
                } else {
                    let tmpColor = bboxes[i].color;

                    bboxes[i].color = bboxes[pick.index].color;
                    bboxes[pick.index].color = tmpColor;

                    this.setState({ bboxes: bboxes, pick: null });
                }
            }
        }
    }

    handleDelete(offsetX, offsetY) {
        for (let i = 0; i < this.state.bboxes.length; i++) {
            const box = this.state.bboxes[i];
            if (box.detectHit(offsetX, offsetY)) {
                this.__composer.delete(this.__composer.getCurrentFrame(), box.id);
            }
        }
    }
}
