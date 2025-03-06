import React, { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';

const CreateOrder = () => {
  const [customerName, setCustomerName] = useState('');
  const [itemDetails, setItemDetails] = useState([{ type: '', quantity: '', weight: '' }]);
  const [capDetails, setCapDetails] = useState([{ capName: '', quantity: '', capType: '' }]);
  const [boxDetails, setBoxDetails] = useState([{ boxName: '', quantity: '', boxFinish: '' }]);
  const [pumpDetails, setPumpDetails] = useState([{ pumpName: '', quantity: '' }]);
  const [decorationDetails, setDecorationDetails] = useState([{ decorationName: '', quantity: '', link: '' }]);

  const duplicateSection = (setter, section, index) => {
    setter(prev => {
      const newSections = [...prev];
      newSections.splice(index + 1, 0, { ...section });
      return newSections;
    });
  };

  const removeSection = (setter, index) => {
    setter(prev => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  const updateSection = (setter, index, field, value) => {
    setter(prev => {
      const newSections = [...prev];
      newSections[index][field] = value;
      return newSections;
    });
  };

  const renderSection = (sections, setter, options) => (
    sections.map((section, index) => (
      <div key={index} className="flex items-center space-x-2 mb-2">
        <div className="grid grid-cols-3 gap-2 flex-grow">
          {options.map(({ name, label, optionValues }) => (
            <select
              key={name}
              value={section[name]}
              onChange={(e) => updateSection(setter, index, name, e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">{label}</option>
              {optionValues.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ))}
        </div>
        <div className="flex space-x-2">
          <button onClick={() => duplicateSection(setter, section, index)} className="text-green-500 hover:text-green-700">
            <PlusCircle size={24} />
          </button>
          <button onClick={() => removeSection(setter, index)} className="text-red-500 hover:text-red-700">
            <Trash2 size={24} />
          </button>
        </div>
      </div>
    ))
  );

  return (
    <div className="mt-4 max-w-2xl mx-auto">
      <div className="mb-4">
        <label className="block mb-2">Customer Name:</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Item Details:</label>
        {renderSection(itemDetails, setItemDetails, [
          { name: 'type', label: 'Type', optionValues: ['Option 1', 'Option 2'] },
          { name: 'quantity', label: 'Quantity', optionValues: ['1', '2', '3'] },
          { name: 'weight', label: 'Weight', optionValues: ['Light', 'Heavy'] }
        ])}
      </div>

      <div className="mb-4">
        <label className="block mb-2">Cap Details:</label>
        {renderSection(capDetails, setCapDetails, [
          { name: 'capName', label: 'Cap Name', optionValues: ['Cap 1', 'Cap 2'] },
          { name: 'quantity', label: 'Quantity', optionValues: ['1', '2'] },
          { name: 'capType', label: 'Cap Type', optionValues: ['Type A', 'Type B'] }
        ])}
      </div>

      <div className="mb-4">
        <label className="block mb-2">Box Details:</label>
        {renderSection(boxDetails, setBoxDetails, [
          { name: 'boxName', label: 'Box Name', optionValues: ['Box 1', 'Box 2'] },
          { name: 'quantity', label: 'Quantity', optionValues: ['1', '2', '3'] },
          { name: 'boxFinish', label: 'Box Finish', optionValues: ['Matte', 'Glossy'] }
        ])}
      </div>

      <div className="mb-4">
        <label className="block mb-2">Pump Details:</label>
        {renderSection(pumpDetails, setPumpDetails, [
          { name: 'pumpName', label: 'Pump Name', optionValues: ['Pump 1', 'Pump 2'] },
          { name: 'quantity', label: 'Quantity', optionValues: ['1', '2', '3'] }
        ])}
      </div>

      <div className="mb-4">
        <label className="block mb-2">Decoration Details:</label>
        {renderSection(decorationDetails, setDecorationDetails, [
          { name: 'decorationName', label: 'Decoration Name', optionValues: ['Ribbon', 'Sticker'] },
          { name: 'quantity', label: 'Quantity', optionValues: ['1', '2', '3'] },
          { name: 'link', label: 'Link', optionValues: ['Link 1', 'Link 2'] }
        ])}
      </div>

      <button className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600 transition">
        Create Order
      </button>
    </div>
  );
};

export default CreateOrder;
