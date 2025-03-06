import React from 'react'
import Card from './Card'
import CreateOrderChild from './CreateOrderChild'
import { useState } from 'react';

function DashboardChild() {
  const [showModal, setShowModal] = useState(false);
  return (

    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        <Card number={2} bgColor="#FF7E46" text="Orders Pending" />
        <Card number={10} bgColor="#65C652" text="Orders Completed" />
      </div>
      <div className='mt-7'>
        <div className='flex justify-between px-3'>
          <div>
            <span className="text-black text-lg sm:text-2xl font-extrabold">Current</span>
            <span className="text-[#F5D6B9] text-lg sm:text-2xl font-extrabold ml-2">Orders</span>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-2xl shadow-md transition duration-300 cursor-pointer">
            Create Order
          </button>
        </div>
        <div className="w-full border-2 border-amber-600 mt-6 rounded-lg flex flex-col md:flex-row relative">
          <div className="w-full md:w-1/2 p-4 flex flex-col gap-8 font-bold text-sm mt-7">
            <span>Customer Name : A</span>
            <span>Dispatcher Name : Dispatcher</span>
            <span>Order Date: {new Date().toLocaleDateString()}</span>
          </div>
          <div className="hidden md:block absolute h-[80%] w-[2px] bg-amber-600 left-1/2 top-[10%]"></div>
          <div className="w-full md:w-1/2 p-4 flex flex-col gap-2 font-bold">
            <h3 className='text-center font-semibold text-2xl text-[#E75018]'>Status</h3>

            <div class="space-y-3 p-4 bg-white shadow-lg rounded-2xl">
              <div class="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                <span class="font-semibold text-gray-700">Glass Manufacturing team</span>
                <span class="text-red-500 font-medium">Pending</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                <span class="font-semibold text-gray-700">Glass Manufacturing team</span>
                <span class="text-red-500 font-medium">Pending</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                <span class="font-semibold text-gray-700">Glass Manufacturing team</span>
                <span class="text-red-500 font-medium">Pending</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                <span class="font-semibold text-gray-700">Glass Manufacturing team</span>
                <span class="text-red-500 font-medium">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && <CreateOrderChild onClose={() => setShowModal(false)} />}
    </div>
  )
}

export default DashboardChild