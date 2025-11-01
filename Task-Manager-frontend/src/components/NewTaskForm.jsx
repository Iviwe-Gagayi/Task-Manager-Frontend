import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // <-- Adjust path if needed

// We receive the two functions as props from the Home component
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
    
    // 1. Check that description is filled (as you planned)
    if (!description) {
      setError('Description is required.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    // 2. Fill in the details for the POST request
    const newTask = {
      title: 'Default Task Title', // As you requested
      description: description,
      status: status,
      // The 'user' will be added by your backend from the token
    };

    try {
      const response = await fetch('https://task-manager-rp21.onrender.com/tasks', { // <-- !! Replace with your API URL
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

      // 3. Show "task created" message
      setSuccessMessage('Task created!');
      
      // 4. Pass the new task back up to the Home component
      onTaskCreated(createdTask);

      // 5. Clear the form fields
      setDescription('');
      setStatus('pending');

      // 6. Slide the menu back up after 2 seconds
      setTimeout(() => {
        onClose(); // This calls setIsFormOpen(false) in the Home component
        setSuccessMessage(''); // Clear the message for next time
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-b-lg">
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

      {/* Status Field */}
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

      {/* Submit Button & Messages */}
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
