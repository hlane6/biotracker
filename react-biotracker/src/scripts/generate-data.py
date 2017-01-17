WIDTH = 620
HEIGHT = 380

COLORS = ['red',
        'blue',
        'purple',
        'yellow',
        'orange',
        'green', 
        'coral',
        'cyan',
        'darkred',
        'gold',
        'greenyellow',
#        'hotpink',
#        'lightblue',
#        'lightskyblue',
#        'lightgreen',
#        'darkgreen',
#        'darkblue',
#        'greenyellow',
#        'goldenrod',
#        'dodgerblue',
#        'floralwhite',
#        'indianred',
#        'honeydew',
#        'lightpink',
#        'lightseagreen',
#        'mediumaquamarine',
#        'mediumblue',
#        'lime',
#        'limegreen',
#        'mediumorchid',
        'mediumslateblue'
        ] 

NUM_OF_RECTS = len(COLORS)
STEPS = 680

class BBox:
    def __init__(self, boxId, x, y, dx, dy, color):
        self.id = boxId
        self.x = x
        self.y = y
        self.width = 100
        self.height = HEIGHT / NUM_OF_RECTS
        self.color = color
        self.dx = dx
        self.dy = dy

    def update(self):
        if (self.x > WIDTH) or (self.x < 0):
            self.dx *= -1;

        if (self.y > HEIGHT) or (self.y < 0):
            self.dy *= -1;

        self.x += self.dx
        self.y += self.dy

def main():
    bboxes = []
    for (index, color) in enumerate(COLORS):
        bboxes.append(BBox(index, 0, index * (HEIGHT / NUM_OF_RECTS), index + 1, 0, color))

    with open('../../public/data.csv', 'w') as f:
        f.write('step,id,x,y,width,height,color\n')
        for step in range(STEPS):
            for box in bboxes:
                f.write('{},{},{},{},{},{},{}\n'.format(step,
                    box.id,
                    box.x,
                    box.y,
                    box.width,
                    box.height,
                    box.color))
                box.update()


if __name__ == '__main__':
    main()
