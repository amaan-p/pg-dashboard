import React from 'react'

const OrderCardUser = ({ order }) => {
  return (
    <div className="flex justify-between items-center border-2 border-[#FCE0D4] p-4 mb-4 rounded-lg">
      <div>
        <p >Customer: {order.customerName}</p>
        <p>Dispatcher: {order.dispatcherName}</p>
        <p>Order Date: {order.orderCreatedDate}</p>
      </div>
      <button
        className="bg-[#F05C1C] cursor-pointer text-white py-2 px-4 rounded hover:bg-orange-600">
        View Details
      </button>
    </div>
  )
}

export default OrderCardUser