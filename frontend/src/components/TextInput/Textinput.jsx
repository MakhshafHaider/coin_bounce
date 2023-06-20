import React from 'react'
import styles from './Textinput.module.css';

export default function Textinput(props) {
  return (
    <div className={styles.textInputWrapper}>
        <input  {...props}/>
        {props.error && <p className={styles.errorMessage}>{props.errormessage}</p>}
    </div>
  )
}
