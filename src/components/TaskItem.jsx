import { FaTrash, FaSpinner } from 'react-icons/fa'; 

export default function TaskItem({ task, onDelete, isDeleting, onUpdateStatus, isUpdating }) {


  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800'; 
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
   
    <div className="
      w-full max-w-4xl 
      bg-white p-4 rounded-lg shadow-md 
      flex items-center 
      transition-all hover:shadow-lg hover:scale-108 duration-300 cursor-pointer
    ">
      
      {/*Task Description  */}
      <div className="flex-grow">
        <h3 className={`
          text-lg font-medium
          ${task.status === 'completed' 
            ? 'line-through text-gray-400' 
            : 'text-gray-800'}
        `}>
          {task.description}
        </h3>
      </div>
      
       {/*Status */}
      <div className="w-50 text-center flex-shrink-0">
        <button
          onClick={() => onUpdateStatus(task._id, task.status)}
          disabled={isUpdating} 
          className="w-full focus:outline-none"
        >
          <span 
            className={`
              px-4 py-1 rounded-full text-m font-semibold 
              ${getStatusColor(task.status)}
              transition-all duration-200 
              ${isUpdating 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:opacity-80 cursor-pointer' 
              }
            `}
          >
        
            {isUpdating ? 'Saving...' : task.status}
          </span>
        </button>
      </div>
      
      {/*Delete Button  */}
      <div className="flex-shrink-0 ml-4 ">
        <button
          onClick={() => onDelete(task._id)}
          className="
            cursor-pointer text-gray-400 p-2 rounded-full
            hover:text-red-500 hover:bg-red-100
            transition-all duration-200
          "
          aria-label="Delete task" 
        >
         {isDeleting ? (
            <FaSpinner className="animate-spin" size={18} />
          ) : (
            <FaTrash size={18} />
          )}
        </button>
      </div>
    </div>
  );
}