from biotracker.models.targetManager import TargetManager
from settings import DEFAULT_SETTINGS

import os.path
import argparse

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Use this app to generate tracklets for a video. NOTE: Make sure input video is located within the video folder. Stores the output csv in the data folder.')
    parser.add_argument('video', help='video of targets in the form "videoname.mp4"')
    args = parser.parse_args()
    args.video = DEFAULT_SETTINGS['VID_FOLDER'] + args.video
    if os.path.isfile(args.video):
        fname = os.listdir(DEFAULT_SETTINGS['VID_FOLDER'])[0]
        mgr = TargetManager('{}/{}'.format(DEFAULT_SETTINGS['VID_FOLDER'], fname))
        mgr.identify_targets()
        csv_path = os.path.join(DEFAULT_SETTINGS['DATA_FOLDER'], fname.split('.')[0] + '.csv')
        mgr.write_csv_file(csv_path)
    else:
        print("Can't find video: '" + args.video + "'.")