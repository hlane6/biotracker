var videoframe = null;

document.addEventListener('DOMContentLoaded',
    function() {
        videoframe = VideoFrame({
            id: 'v',
            frameRate: FrameRates.web,
            callback: function(response) {
                console.log('callback response: ' + response);
            }
        });

        let canvas = document.getElementById('c');
        let video = document.getElementById('v');

        canvas.style.left = video.style.left;
        canvas.style.top = video.style.top;
        canvas.width = video.width;
        canvas.height = video.height;

        setupCanvas(document.getElementById('c'),
            document.getElementById('c').getContext('2d'));

        setupVideoControls(videoframe.video);

    }, false);

function setupCanvas(canvas, context) {
    /*
    let save = document.getElementById('save');
    save.addEventListener('click', function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    });
    */

    canvas.addEventListener('click', function(event) {
        let textarea = document.getElementById('correction-text');
        let text = '( ' +
            event.offsetX +
            ', ' +
            event.offsetY +
            ', ' +
            videoframe.get() +
            ' )\n';

        textarea.value += text;
        context.fillRect(event.offsetX, event.offsetY, 5, 5);
    });
}

function setupVideoControls(video) {
    let t = document.getElementById('text');
    let playpause = document.getElementById('playpause');
    let rewind = document.getElementById('rewind');
    let fastforward = document.getElementById('fastforward');
    let framejump = document.getElementById('framejump'); 

    playpause.addEventListener('click', function() {
        if (video.paused) { video.play(); }
        else { video.pause(); }
    });

    rewind.addEventListener('click', function() {
        videoframe.seekBackward(1);
        t.innerHTML = videoframe.get();
    });

    fastforward.addEventListener('click', function() {
        videoframe.seekForward(1);
        t.innerHTML = videoframe.get();
    });

    framejump.addEventListener('click', function() {
        let framenumber = document.getElementById('framenumber').value;
        videoframe.seekTo( { 'frame': framenumber } );
        t.innerHTML = framenumber;
    });
}

function draw(v, c, w, h) {
    if (v.paused || v.ended) return false;
    c.clearRect(0, 0, w, h);
    setTimeout(function() { draw(v, c, w, h); }, 20);
}

