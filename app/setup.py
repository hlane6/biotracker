from setuptools import setup

setup(
        name='biotracker',
        packages=['biotracker'],
        include_package_data=True,
        install_requires=[
            'flask',
            'numpy',
            'scipy',
        ],
)
