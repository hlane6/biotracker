import React from 'react';

/**
* Foundation component to handle rendering a Video
* Video should not actually be rendered, but will be
* used by the Canvas to draw its content
*/
export default class Video extends React.Component {

    static defaultProps = {
        src: '',
        onReady: function() {},
    };

    static propTypes = {
        src: React.PropTypes.string,
        onReady: React.PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.onReady = this.onReady.bind(this);
    }

    componentDidMount() {
        this.video.addEventListener('canplay', this.onReady);
    }

    /**
    * We dont know the duration of the video until it loads,
    * so we send the duration back up to its parents by passing
    * it through the provided callback
    */
    onReady() {
        this.props.onReady(this.video.duration);
    }

    render() {
        return (
            <video className='video'
                    src={ this.props.src }
                    type='video/mp4'
                    ref={(video) => { this.video = video; }}
            >
                    onReady={ this.onReady }
            </video>
        );
    }

}
