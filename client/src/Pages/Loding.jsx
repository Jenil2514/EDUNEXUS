import React from 'react';
import Loader from '../Images/ad.gif';
import '../CSS/Loading.css';


function Loding() {
  return (
    <div className='loading-container'>
  <img src={Loader} alt="" className='loading-background'/>
  <div className="loader"></div>
    </div>
  )
}

export default Loding;