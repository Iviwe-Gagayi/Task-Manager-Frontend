import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // <-- Adjust path if needed

// An array to define our status options. This makes the buttons cleaner.
const statusOptions = [
  { id: 'pending', label: 'Pending', colors: 'bg-red-100 text-red-800 ring-red-300' },
  { id: 'in-progress', label: 'In Progress', colors: 'bg-yellow-100 text-yellow-800 ring-yellow-300' },
  { id: 'completed', label: 'Completed', colors: 'bg-green-100 text-green-800 ring-green-300' },
];

export default function NewTaskForm({ onTaskCreated, onClose }) {
  // Form state
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  
  // Logic state
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description) {
      setError('Description is required.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    const newTask = {
      title: 'Default Task Title', 
      description: description,
      status: status,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error('Failed to create task.');
      }

      const createdTask = await response.json();
      setSuccessMessage('Task created!');
      
      onTaskCreated(createdTask);

      setDescription('');
      setStatus('pending');

      setTimeout(() => {
        onClose(); 
        setSuccessMessage('');
      }, 1000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 1. Using a softer shadow instead of the heavy border
    <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
      
      {/* 2. Using a placeholder instead of a label */}
      <div className="mb-4">
        <label htmlFor="description" className="sr-only">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="
            w-full p-3 border border-gray-300 rounded-md
            transition-colors duration-200
            focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500
          "
          rows="3"
          placeholder="Enter task description..."
        />
      </div>

      {/* 3. Replaced <select> with a cleaner button group */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <div className="flex items-center gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setStatus(option.id)}
              className={`
                px-3 py-1 rounded-full text-sm font-medium transition-all
                ${status === option.id
                  ? `${option.colors} ring-2` // Active style
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200' // Inactive style
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Full-width button and centered messages */}
      <div className="flex flex-col items-center">
        <button
          type="submit"
          disabled={isLoading}
          className="
            w-full px-4 py-2.5 bg-cyan-500 text-white font-semibold rounded-md 
            transition-colors hover:bg-cyan-600 disabled:bg-gray-400 cursor-pointer
          "
        >
          {isLoading ? 'Creating...' : 'Add Task'}
        </button>
        
        {/* Messages are now centered below the button */}
        <div className="mt-3 text-center h-4"> {/* h-4 prevents layout jump */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
        </div>
      </div>
    </form>
  );
}