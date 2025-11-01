import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; 


export default function NewTaskForm({ onTaskCreated, onClose }) {
  // Form state
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  

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
     
      const response = await fetch('https://task-manager-rp21.onrender.com/tasks', { 
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
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
   
    <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
      {/* Description Field */}
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description (Required)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          rows="3"
        />
      </div>

  
      <div className="mb-4">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

     
      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Creating...' : 'Add Task'}
        </button>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
      </div>
    </form>
  );
}

