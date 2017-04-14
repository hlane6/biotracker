""" Module containing the script to generate csv data from a given
video file.
"""

import os.path
import argparse

from ..models.target_manager import TargetManager


def tracker():
    parser = argparse.ArgumentParser(description='Use this app to generate tracklets for a video. NOTE: Make sure input video is located within the video folder. Stores the output csv in the data folder.')

    parser.add_argument('video', help='video of targets in the form "videoname.mp4"')
    # parser.add_argument('background', required=False, help='Background image used to perform tracking. Providing this will considerable speed up tracking.')

    args = parser.parse_args()

    if os.path.isfile(args.video):
        manager = TargetManager(args.video)

        manager.identify_targets()
        manager.associate_targets()

        csv_path = args.video.split('.mp4')[0] + '.csv'
        manager.write_csv_file(csv_path)
    else:
        print("Can't find video: '" + args.video + "'.")
