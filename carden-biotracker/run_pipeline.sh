
python3 tracker.py $1 out.avi
python3 association.py tracklets assoc
python3 overlay.py $1 assoc.csv overlay_video
