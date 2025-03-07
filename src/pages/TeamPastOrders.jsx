import React from 'react'
import OrderCard from '../components/OrderCard';
import OrderCardUser from '../components/OrderCardUser';

const TeamPastorders = () => {
  const orders = [
    {
      customerName: "John Doe",
      dispatcherName: "Alice Smith",
      orderCreatedDate: "2025-03-05",
    },
    {
      customerName: "Jane Doe",
      dispatcherName: "Bob Johnson",
      orderCreatedDate: "2025-03-04",
    },
    {
      customerName: "Michael Brown",
      dispatcherName: "Charlie Davis",
      orderCreatedDate: "2025-03-03",
    },
    {
      customerName: "Emily White",
      dispatcherName: "David Wilson",
      orderCreatedDate: "2025-03-02",
    },
    {
      customerName: "Chris Green",
      dispatcherName: "Eva Thomas",
      orderCreatedDate: "2025-03-01",
    },
  ];

  return (
    <div>
      {orders.map((order, index) => (
        <OrderCardUser key={index} order={order}  />
      ))
      }
    </div>
  )
}

export default TeamPastorders