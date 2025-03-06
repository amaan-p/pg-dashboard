import React from 'react'

function Card({ number, bgColor, text }) {
  return (
    <div
    className="rounded-2xl p-6 text-white shadow-md transition-transform duration-300 hover:scale-105 w-full max-w-xs mx-auto cursor-pointer"
    style={{ backgroundColor: bgColor }}
  >
    <div className="text-center">
      <h2 className=" md:text-3xl text-2xl font-bold">{number}</h2>
      <p className="mt-2  md:text-base text-sm">{text}</p>
    </div>
  </div>
  )
}

export default Card