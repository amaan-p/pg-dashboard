const StatusCard = ({ title, status }) => {
  const statusColor = status === 'Pending' ? 'text-red-500' : 'text-green-500';

  return (
    <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
      <span className="font-semibold text-gray-700">{title}</span>
      <span className={`${statusColor} font-medium`}>{status}</span>
    </div>
  );
};

export default StatusCard