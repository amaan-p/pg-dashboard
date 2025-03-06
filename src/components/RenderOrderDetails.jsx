import React from 'react'

const RenderOrderDetails = () => {

  const capDetails = [
    {
      id: "CAP001",
      name: "Pressure Valve Cap",
      material: "Stainless Steel",
      size: "2 inch",
      threadType: "NPT"
    },
    {
      id: "CAP002",
      name: "Hydraulic Reservoir Cap",
      material: "Aluminum",
      size: "3 inch",
      threadType: "BSP"
    },
    {
      id: "CAP003",
      name: "Radiator Cap",
      material: "Brass",
      size: "1.5 inch",
      threadType: "Metric"
    }
  ]

  return (
    <div className="mt-4 grid grid-cols-3 gap-7">
      {
        capDetails.map((cap) => (
          <>
            <div key={cap.id + '-name'} className="bg-orange-500 text-white p-2 rounded-lg text-center">
              {cap.name}
            </div>
            <div key={cap.id + '-material'} className="bg-orange-500 text-white p-2 rounded-lg text-center">
              {cap.material}
            </div>
            <div key={cap.id + '-size'} className="bg-orange-500 text-white p-2 rounded-lg text-center">
              {cap.size}
            </div>
          </>
        ))
      }
    </div>

  )
}

export default RenderOrderDetails