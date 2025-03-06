import React, { useState } from 'react';
import ViewOrderDetailsChild from '../components/ViewOrderDetailsChild';
import EditOrderDetailsChild from '../components/EditOrderDetailsChild';

const Teams = () => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <div className="border-2 border-orange-500 p-4 flex flex-col w-full max-w-screen">
      <div className="flex flex-col md:flex-row divide-y-2 md:divide-y-0 md:divide-x-2 divide-orange-500 mb-4">
        <div className="flex flex-col flex-1 space-y-2 pb-4 md:pb-0 md:pr-4">
          <p className="text-base">First Paragraph</p>
          <p className="text-base">Second Paragraph</p>
        </div>
        <div className="flex flex-col flex-1 space-y-2 pt-4 md:pt-0 md:pl-4 h-48 overflow-y-auto">
          <p className="text-base">Third Paragraph</p>
          <p className="text-base">Fourth Paragraph</p>
          <p className="text-base">Fifth Paragraph</p>
          <p className="text-base">Sixth Paragraph</p>
          <p className="text-base">Seventh Paragraph</p>
          <p className="text-base">Eighth Paragraph</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between sm:space-x-4 space-y-2 sm:space-y-0 pt-2">
        <button onClick={() => setShowViewModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full sm:w-auto">
          View Details
        </button>
        <button onClick={() => setShowEditModal(true)} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded w-full sm:w-auto">
          Edit Details
        </button>
        <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded w-full sm:w-auto">
          Complete Order
        </button>
      </div>

      {showViewModal && <ViewOrderDetailsChild onClose={() => setShowViewModal(false)} />}
      {showEditModal && <EditOrderDetailsChild onClose={() => setShowEditModal(false)} />}
    </div>
  );
};

export default Teams;
