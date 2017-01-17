import cv2
import numpy as np

cap = cv2.VideoCapture('Encounters_Xvid.mp4')

total_difference = 0

for num in range(500):
    img = cv2.imread('./canvas-frames/frame{0:03d}.jpg'.format(num))
    ret, frame = cap.read()
    n1, d1, _ = img.shape
    n2, d2, _ = frame.shape
    debug_frame = np.zeros((n1 + n2, d1, 3))
    debug_frame[:n1, :, :] = img
    debug_frame[n1:, :, :] = frame
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    diff_img = np.abs(img-frame)
    diff_img[diff_img < 5] = 0
    
    if ret:
        total_difference += np.sum(diff_img)
        cv2.imwrite('test{}.jpg'.format(num), debug_frame)
    else:
        cv2.imshow("test", img)

print(total_difference)

cv2.destroyAllWindows()
cap.release()
