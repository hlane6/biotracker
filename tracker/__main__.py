from . import scripts
import argparse
import os.path

if __name__ == '__main__':

    parser = argparse.ArgumentParser()
    parser.add_argument('-a', '--app', help='Name of app to run. Either "tracker" or "genvid".')
    parser.add_argument('-v', '--video', help='Video of targets in the form "/path/to/file/videoname.mp4".')
    parser.add_argument('-b', '--background', help='Background image used to perform tracking. Providing this will considerable speed up tracking. In the form "/path/to/file/background.jpg".')
    parser.add_argument('-t', '--tracks', help='Tracks of targets to draw bounding boxes in the form "/path/to/file/filename.csv".')
    parser.add_argument('-f', '--filename', help='Desired name of the output video with bounding boxes. In the form "videoname".')
    args = parser.parse_args()

    if (args.app == 'tracker'):
        if (args.background is not None):
            if os.path.isfile(args.video) and os.path.isfile(args.background):
                scripts.tracker(args.video, args.background)
            else:
                if not os.path.isfile(args.video):
                    print("Can't find video: '" + args.video + "'.")
                if not os.path.isfile(args.background):
                    print("Can't find background image: '" + args.background + "'.")
        else:
            if os.path.isfile(args.video):
                scripts.tracker(args.video)
            else:
                if not os.path.isfile(args.video):
                    print("Can't find video: '" + args.video + "'.")

    elif (args.app == 'genvid'):
        if os.path.isfile(args.video) and os.path.isfile(args.tracks):
            scripts.genvid(args.video, args.tracks, args.filename)
        else:
            if not os.path.isfile(args.video):
                print("Can't find video: '" + args.video + "'.")
            if not os.path.isfile(args.tracks):
                print("Can't find tracks: '" + args.tracks + "'.")

    else:
        print('No application called: ' + args.app + '. Please run either "tracker" or "genvid".')
