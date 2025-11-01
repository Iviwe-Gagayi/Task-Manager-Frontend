import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth(); 
  const navigate = useNavigate();
  const menuRef = useRef(null); 

  const handleLogout = () => {
    navigate('/dashboard'); 
    logout(); 
    
  };

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
  
    <div className="relative " ref={menuRef}> 
      {/* The User Icon Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="text-gray-400 hover:text-cyan-500 cursor-pointer transition-all hover:scale-110 duration-300"
      >
        <FaUserCircle size={32} />
      </button>

      {/* The Dropdown Menu */}
      <div 
        className={`
          absolute top-12 right-0 w-48 z-50
          bg-white rounded-2xl shadow-lg border-2 border-cyan-500
          transition-all duration-300 ease-in-out
          ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
        `}
      >
     
        <div className="p-2">
          <button
            onClick={handleLogout}
            className="
              w-full flex items-center gap-3 px-4 py-2 
              text-sm text-gray-700 rounded-md 
              transition-colors
              hover:bg-cyan-500 hover:text-white
            "
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
