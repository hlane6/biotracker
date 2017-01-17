from fileIO import *
import os
from io import StringIO

import unittest

class TrackerManager_Test(unittest.TestCase):

    # Function created to serve a barebones manager object.
    def init_mgr(self):
        expected_filename = 'test_tracker'
        mgr = TrackerManager(expected_filename)
        return mgr

    def test_init(self):
        mgr = self.init_mgr()
        expected_filename = 'test_tracker'
        self.assertEqual(mgr.csvFileName, expected_filename + '.csv')

    def test_AddTarget(self):
        mgr = self.init_mgr()
        mgr.add_target(1, 1, 1, 1, 45.0, 'ant', 1)

        expected = [Detection(1, 1, 1, 1, 45.0, 'ant', 1)]
        self.assertEqual(mgr.detections, expected)


    # TODO(carden, sam, hans): finish this test.
    def test_WriteFile(self):
        mgr = self.init_mgr()
        mgr.add_target(1, 1, 1, 1, 45.0, 'ant', 1)
        mgr.add_target(1, 2, 5, 6, 90.0, 'ant', 2)
        expected = mgr.detections
        mgr.write_file()
        mgr.load_data('test_tracker.csv')
        self.assertEqual(mgr.detections, expected)

    def test_LoadData(self):
        mgr = self.init_mgr()
        test_filename = os.path.join(os.path.dirname(__file__), 'test.csv')
        mgr.load_data(test_filename)

        expected_det1 = Detection(1, 1, 3, 4, 45.0, 'ant', 1)
        expected_det2 = Detection(1, 2, 5, 6, 90.0, 'ant', 2)
        expected_detections = [expected_det1, expected_det2]
        self.assertEqual(mgr.detections, expected_detections)

    def test_ShowOutput(self):
        mgr = self.init_mgr()
        out = StringIO()
        mgr.show_output(out = out)
        output = out.getvalue().strip()
        self.assertEqual(output, "No data found")

        out = StringIO()
        mgr.add_target(1, 1, 1, 1, 45.0, 'ant', 1)
        mgr.show_output(out = out)
        output = out.getvalue().strip()
        self.assertEqual(output, str(mgr.detections))

    #def test_ShowJsonOutput(self):
    #    pass

    def test_ShowFrameOutput(self):
        mgr = self.init_mgr()
        out = StringIO()
        mgr.show_frame_output(1, out = out)
        output = out.getvalue().strip()
        self.assertEqual(output, "Frame number not found")

        out = StringIO()
        expected_det1 = Detection(1, 1, 3, 4, 45.0, 'ant', 1)
        expected_det2 = Detection(2, 1, 5, 6, 90.0, 'ant', 2)
        mgr.add_target(1,1,3,4,45.0,'ant',1)
        mgr.add_target(2,1,5,6,90.0,'ant',1)
        mgr.show_frame_output(1, out = out)
        output = out.getvalue().strip()
        self.assertEqual(output, str(expected_det1))
