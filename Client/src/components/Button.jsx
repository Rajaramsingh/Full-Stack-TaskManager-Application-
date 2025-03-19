import React from 'react'
import clsx from 'clsx'

 export const Button = ({icon,className, label, type, onClick =()=>{} })=> {
    return (
   <button 
   type={type || "button"}
   label={label}
   className={clsx("px-3 py-2 outline-none ", className) } onClick= {onClick} >
    <span>{label}</span>
    {icon && icon}
   </button>
    )
}