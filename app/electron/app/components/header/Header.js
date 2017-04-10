import React from 'react';
import styles from './Header.css';

export default class Header extends React.Component {

  static defaultProps = {
    time: 0,
  };

  static propTypes = {
    time: React.PropTypes.number,
  };

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
