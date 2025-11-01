import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; 
import TaskItem from '../components/TaskItem';
import NewTaskForm from '../components/NewTaskForm'; 
import { FaCircleUser } from "react-icons/fa6";


export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Get the token from your AuthContext
  const { token } = useAuth();

  // This useEffect runs only once when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {

    if (!token) return; //prevents race condition
    console.log('Sending token: ', token);

      try {
        const response = await fetch('https://task-manager-rp21.onrender.com/tasks', { 
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tasks. Are you logged in?');
        }

        const data = await response.json();
        setTasks(data); // Set the tasks in state

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false); // Stop loading, whether it failed or succeeded
      }
    };

    fetchTasks();
  }, [token]); // Re-run if the token ever changes

  // 3. This function is passed down to the form
  const handleTaskCreated = (newTask) => {
    // This adds the new task to the top of the list without a page reload!
    setTasks(currentTasks => [newTask, ...currentTasks]);
  };


  // 1. Loading State
  if (isLoading) {
    return <div className="min-h-screen flex justify-center items-center"><p>Loading tasks...</p></div>;
  }

  // 2. Error State
  if (error) {
    return <div className="min-h-screen flex justify-center items-center"><p>{error}</p></div>;
  }

  // 3. Main Content (Success State)
  return (
    <div className="min-h-screen bg-gray-100 p-8">


      {/* Conditional Rendering */}
      {tasks.length === 0 ? (
        // 3a. No Tasks State
        <div className="min-h-screen  flex flex-col justify-center items-center">
       <button>
       <FaCircleUser className='w-10 h-10 absolute right-0 top-0 m-3 text-cyan-500 hover:scale-110 transition-all duration-300 hover:text-cyan-600 cursor-pointer'/>
       </button>
        <h1 className="text-4xl font-semibold mb-10">No tasks yet</h1>
       <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="
            w-16 h-16 
            bg-cyan-500 
            rounded-full 
            flex justify-center items-center
            text-white
            cursor-pointer
            hover:bg-cyan-600
            hover:scale-110
            transition-all
            duration-300
            shadow-lg
          "
        >
          {/* This will smoothly rotate the plus icon */}
          <div className={`transition-transform duration-300 ${isFormOpen ? 'rotate-45' : ''}`}>
            <FaPlus size={24} />
          </div>
        </button>
        <p1 className="mt-5 text-lg"> Create task</p1>
         </div>

      ) : (
        // 3b. Tasks List
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
            />
          ))}
        </div>
      )}
    </div>
  );
}