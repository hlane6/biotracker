import sys
import cv2
from tracker import ProcessFrame
from PyQt5.Qt import QApplication, QWidget, QImage, QPainter, QTimer, QLabel, QPixmap, QVBoxLayout, QPushButton
import PyQt5.Qt as Qt


class QtCapture(QWidget):
    def __init__(self, *args):
        super(QWidget, self).__init__()

        self.fps = 24
        self.cap = cv2.VideoCapture(*args)

        self.video_frame = QLabel()
        lay = QVBoxLayout()
        lay.setContentsMargins(0, 0, 0, 0)
        # lay.setMargin(0)
        lay.addWidget(self.video_frame)
        self.setLayout(lay)

    def setFPS(self, fps):
        self.fps = fps

    def nextFrameSlot(self):
        ret, frame = self.cap.read()
        if ret:
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            img = QImage(frame, frame.shape[1], frame.shape[0], QImage.Format_RGB888)
            pix = QPixmap.fromImage(img)
            self.video_frame.setPixmap(pix)
            self.video_frame.size = Qt.QSize(frame.shape[1], frame.shape[0])

    def start(self):
        self.timer = QTimer()
        self.timer.timeout.connect(self.nextFrameSlot)
        self.timer.start(1000./self.fps)

    def stop(self):
        self.timer.stop()

    def deleteLater(self):
        self.cap.release()
        super(QWidget, self).deleteLater()

class VideoWidget(QWidget):
    def __init__(self, parent=None):
        super(VideoWidget, self).__init__(parent)
        if not file_path:
            print("File path empty!")
            return

        # self.video_frame = 
        QWidget.__init__(self)
        self._capture = cv2.VideoCapture(file_path)
        self._frame = None
        self._image = None

        frame = self.QueryFrame()

        self.setMinimumSize(frame.shape[1], frame.shape[0])
        self.setMaximumSize(self.minimumSize())
        # Paint every 50 ms
        self._timer = QTimer(self)
        self._timer.timeout.connect(self.QueryFrame)
        self._timer.start(50)

    def QueryFrame(self):
        # frame = queue.get()
        ret, frame = self._capture.read()
        if ret:
            self._frame = frame
        cv2im = cv2.cvtColor(self._frame, cv2.COLOR_BGR2RGB)

        self._image = QImage(cv2im.data,
                             cv2im.shape[1], cv2im.shape[0],
                             QImage.Format_RGB888)

        self.update()
        return self._frame

    def PaintEvent(self, event):
        painter = QPainter(self)
        painter.drawImage(QPoint(0, 0), self._image)


class ControlWindow(QWidget):
    def __init__(self):
        QWidget.__init__(self)
        self.capture = None

        self.open_button = QPushButton('Open')
        self.open_button.clicked.connect(self.getPath)
        self.start_button = QPushButton('Start')
        self.start_button.clicked.connect(self.startCapture)
        self.quit_button = QPushButton('End')
        self.quit_button.clicked.connect(self.endCapture)
        self.end_button = QPushButton('Stop')

        vbox = QVBoxLayout(self)
        vbox.addWidget(self.open_button)
        vbox.addWidget(self.start_button)
        vbox.addWidget(self.end_button)
        vbox.addWidget(self.quit_button)

        self.setLayout(vbox)
        self.setWindowTitle('Control Panel')
        self.setGeometry(100,100,200,200)
        self.show()

    def getPath(self):
        global file_path
        file_path = filedialog.askopenfilename()

    def startCapture(self):
        if not self.capture:
            self.capture = QtCapture(file_path)
            self.end_button.clicked.connect(self.capture.stop)
            # self.capture.setFPS(1)
            self.capture.setParent(self)
            # self.capture.setWindowFlags(Qt.Tool)
        self.capture.start()
        self.resize(self.capture.size())
        self.capture.show()

    def endCapture(self):
        self.capture.deleteLater()
        self.capture = None


if __name__ == '__main__':
    import sys
    app = QApplication(sys.argv)
    window = ControlWindow()
    sys.exit(app.exec_())
