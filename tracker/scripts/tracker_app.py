""" Module containing the script to generate csv data from a given
video file.
"""

from ..models.target_manager import TargetManager

def tracker(video: str, background: str=None):
    """ Generates a csv file from a given video path using a TargetManager. Takes
    in an optional background image which will speed up data generation quite
    a bit
    """
    manager = TargetManager(video, background)
    manager.identify_targets()
    manager.associate_targets()
    csv_path = video.split('.mp4')[0] + '.csv'
    manager.write_csv_file(csv_path)
