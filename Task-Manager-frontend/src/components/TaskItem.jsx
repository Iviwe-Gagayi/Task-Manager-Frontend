// This component receives the 'task' object as a prop
export default function TaskItem({ task }) {

  // Helper to determine the color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-200 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-200 text-blue-800';
      case 'completed':
        return 'bg-green-200 text-green-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{task.name}</h3>
        <span 
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
        >
          {task.status}
        </span>
      </div>
      <p className="text-gray-600">{task.description}</p>
      
      {/* You can add Edit/Delete buttons here later */}
    </div>
  );
}