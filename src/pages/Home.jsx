import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; 
import TaskItem from '../components/TaskItem';   
import NewTaskForm from '../components/NewTaskForm'; 
import UserMenu from '../components/UserMenu'; 

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false); 
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  
 
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const { token } = useAuth(); 


  useEffect(() => {
    const fetchTasks = async () => {
      if (!token) return; 
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, { 
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

  const handleDeleteTask = async (taskId) => {
    setDeletingTaskId(taskId); 
    try {

      const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete task.');
      setTasks(currentTasks => 
        currentTasks.filter(task => task._id !== taskId)
      );
    } catch (err) {
      console.error("Delete failed:", err.message);
    } finally {
      setDeletingTaskId(null); 
    }
  };

  
  const handleUpdateStatus = async (taskId, currentStatus) => {

    const statusCycle = {
      'pending': 'in-progress',
      'in-progress': 'completed',
      'completed': 'pending'
    };
    const nextStatus = statusCycle[currentStatus];

    setUpdatingTaskId(taskId);

    try {
     
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, {
        method: 'PATCH', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status.');
      }

      const updatedTask = await response.json();


      setTasks(currentTasks => 
        currentTasks.map(task => 
          task._id === updatedTask._id ? updatedTask : task
        )
      );

    } catch (err) {
      console.error("Update failed:", err.message);
    } finally {
      setUpdatingTaskId(null); 
    }
  };


  if (isLoading) {
    return <div className="min-h-screen flex justify-center items-center"><p>Loading...</p></div>;
  }
  if (error) {
    return <div className="min-h-screen flex justify-center items-center"><p>{error}</p></div>;
  }

  
  if (tasks.length > 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">

       {/* Header Bar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-black ">Your Tasks</h1>
        </div>

        <div className="fixed top-4 right-4 flex items-center z-30">
          <UserMenu />
        </div>
        {/* Task List */}
        <div className="flex flex-col items-center gap-4">
          {tasks.map(task => (
            <TaskItem 
              key={task._id} 
              task={task} 
              onDelete={handleDeleteTask}
              onUpdateStatus={handleUpdateStatus} 
              isDeleting={deletingTaskId === task._id}
              isUpdating={updatingTaskId === task._id} 
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
            fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 z-50
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
   
      <div className="fixed top-6 right-8 z-30">
        <UserMenu />
      </div>

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