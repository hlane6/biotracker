import React from 'react';

export default class Video extends React.Component {

    static defaultProps = {
        src : "",
    };

    static propTypes = {
        src : React.PropTypes.string,
    };

    constructor(props) {
        super(props);

        this.getVideo = this.getVideo.bind(this);
        this.onReady = this.onReady.bind(this);
    }

    componentDidMount() {
        this.refs.video.addEventListener("canplay", this.onReady);
    }

    onReady() {
        this.props.onLoad(this.refs.video.duration);
    }

    render() {
        return (
            <video className="bt-video"
                    src={ this.props.src }
                    type="video/mp4"
                    ref="video">
                    onReady={ this.onReady }
            </video>
        );
    }

    getVideo() {
        return this.refs.video;
    }

}
