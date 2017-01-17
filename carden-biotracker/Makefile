#!/bin/bash
run:
	python3 tracker.py ../data/2010_Temnothorax_ASU_Encounters/Encounters_Xvid.avi
	python3 association.py tracklets assoc
	python3 overlay.py ../data/2010_Temnothorax_ASU_Encounters/Encounters_Xvid.avi assoc.csv out

clean:
	rm -f *.pyc
	rm -f tests/*.pyc
	rm -rf __pycache__
	rm -rf tests/__pycache__
	rm -f *.mpg
	rm -f *.png
	rm -f *.csv
	rm -rf htmlcov

test:
	coverage3 run --source=. --omit=./tests/* -m unittest discover -t . tests
	coverage3 report -m
