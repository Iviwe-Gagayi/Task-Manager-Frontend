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

  // ... (imports and getStatusColor function) ...

  return (
    // 1. Make the card a column by default, and a row on 'sm' screens
    <div className="
      w-full max-w-2xl 
      bg-white 
      p-4 rounded-lg shadow-md 
      flex flex-col sm:flex-row sm:items-center 
      transition-all duration-300
      hover:shadow-lg
    ">
      
      {/* 2. Description (always takes up full width on top) */}
      <div className="flex-grow w-full">
        <h3 className={`
          text-lg font-medium
          ${task.status === 'completed' 
            ? 'line-through text-gray-400 ' 
            : 'text-black '}
        `}>
          {task.description}
        </h3>
      </div>
      
      {/* 3. This wrapper holds the controls */}
      <div className="
        flex items-center w-full mt-4 sm:mt-0 sm:w-auto
      ">
        {/* 4. Status Button (grows to fill space on mobile) */}
        <div className="flex-grow sm:flex-grow-0 sm:w-36 text-center">
          <button
            onClick={() => onUpdateStatus(task._id, task.status)}
            disabled={isUpdating} 
            className="w-full sm:w-auto focus:outline-none"
          >
            <span 
              className={`
                inline-block w-full sm:w-auto
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
        
        {/* 5. Delete Button (stays on the far right) */}
        <div className="flex-shrink-0 ml-4">
          <button
            onClick={() => onDelete(task._id)}
            disabled={isDeleting}
            className="
              text-gray-400  p-2 rounded-full
              hover:text-red-500 hover:bg-red-100
              transition-all duration-200
              disabled:text-gray-300
              disabled:cursor-not-allowed
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
    </div>
  );
}