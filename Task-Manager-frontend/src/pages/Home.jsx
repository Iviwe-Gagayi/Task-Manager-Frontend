import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; 
import TaskItem from '../components/TaskItem';   
import NewTaskForm from '../components/NewTaskForm'; 
import { FaUserCircle } from 'react-icons/fa'; 

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false); 
  
  // Get token and logout function from context
  const { token, logout } = useAuth(); 

 
  useEffect(() => {
    const fetchTasks = async () => {
      if (!token) return; // Don't fetch if token isn't loaded yet
      try {
        const response = await fetch('https://task-manager-rp21.onrender.com/tasks', { 
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });
        if (!response.ok) throw new Error('Failed to fetch tasks.');
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, [token]);


  const handleTaskCreated = (newTask) => {
    setTasks(currentTasks => [newTask, ...currentTasks]);
  };

 

  // 1. Show loading state
  if (isLoading) {
    return <div className="min-h-screen flex justify-center items-center"><p>Loading...</p></div>;
  }

  // 2. Show error state
  if (error) {
    return <div className="min-h-screen flex justify-center items-center"><p>{error}</p></div>;
  }

  // 3. Show "Task List" layout (if tasks exist)
  if (tasks.length > 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        {/* Header Bar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Your Tasks</h1>
          
        
          <button className="text-gray-500 hover:text-cyan-500">
            <FaUserCircle size={32} />
          </button>
        </div>

        {/* Task List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tasks.map(task => (
            <TaskItem 
              key={task._id} 
              task={task} 
            />
          ))}
        </div>

     
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="
            fixed bottom-10 right-10
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
            z-50
          "
        >
         
          <div className={`transition-transform duration-300 ${isFormOpen ? 'rotate-45' : ''}`}>
            <span className='text-white text-5xl font-bold leading-none relative bottom-1'>
              +
            </span>
          </div>
        </button>

        
        <div 
          className={`
            fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 z-40
            transition-all duration-500 ease-in-out
            ${isFormOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}
          `}
        >
          <NewTaskForm 
            onTaskCreated={handleTaskCreated} 
            onClose={() => setIsFormOpen(false)}
          />
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white p-4">
      
   
      <button className="fixed top-4 right-4 text-gray-400 transition-all hover:text-cyan-500 z-50 hover:scale-110 cursor-pointer duration-300">
        <FaUserCircle size={32} />
      </button>

      
      <div className="text-center flex flex-col items-center justify-center">
        <h2 className="text-5xl font-semibold mb-6">No tasks yet</h2>
        
   
        <button onClick={() => setIsFormOpen(!isFormOpen)} className="flex flex-col items-center group">
        
          <div className="
            w-20 h-20 
            bg-gray-400 
            rounded-full 
            flex justify-center items-center
            cursor-pointer
            group-hover:bg-cyan-500
            group-hover:scale-110
            transition-all
            duration-300
            shadow-md
          ">
        
            <span className={`
              text-white text-6xl font-bold leading-none flex justify-center items-center
              relative bottom-1 
              transition-transform duration-300 
              ${isFormOpen ? 'rotate-45 translate-x-1' : ''}
            `}>
              +
            </span>
          </div>
          <p className="mt-4 text-lg text-gray-700">Create task</p>
        </button>
      </div>

  
      <div 
        className={`
          fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 z-40
          transition-all duration-500 ease-in-out
          ${isFormOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}
        `}
      >
        <NewTaskForm 
          onTaskCreated={handleTaskCreated} 
          onClose={() => setIsFormOpen(false)}
        />
      </div>
    </div>
  );
}

