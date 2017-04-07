import React from 'react';
import styles from './Header.css';

export default class Header extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
          <div className={styles.header}>
            <h2 className={styles.heading}>Biotracker</h2>
            <h4 className={styles.frame_counter}>
              Frame: {Math.floor(this.props.time * 30)}
            </h4>
          </div>
        );
    }

}
