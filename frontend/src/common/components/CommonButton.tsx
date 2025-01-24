import React from 'react'
import '../../components/common.css'
// import '../styling/common.css'

interface ButtonProps {
  text: string;
  type: 'button' | 'submit';
}

const CommonButton: React.FC<ButtonProps> = ({ text, type }) => {
  return (
    <div>
      <button type={type} className='btn px-5 text-white btn-clr' >{text}</button>
    </div>
  )
}

export default CommonButton