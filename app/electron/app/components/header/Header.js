import React from 'react';
import styles from './Header.css';

export default class Header extends React.Component {

    render() {
        return (
          <div className={styles.header}>
            <h2 className={styles.heading}>Corrector</h2>
            <h4 className={styles.frame_counter}>
              Frame: {Math.floor(this.props.time * 30)}
            </h4>
          </div>
        );
    }

}
