from setuptools import setup

# Note from Austin:
# Please do not add opencv-python. 
# Please install it through pip manually.
# If its added here and I do pip install -e . then it screw up my environment on ubuntu 16.04
# Thanks :)
setup(
        name='biotracker',
        packages=['biotracker'],
        include_package_data=True,
        install_requires=[
            'flask'
            'scipy',
            'numpy'
        ],
)
