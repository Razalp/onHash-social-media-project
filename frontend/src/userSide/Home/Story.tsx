// Home.js

import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Story = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/log-in');
    }
  }, [navigate]);

  return (
    <div className="max-w-xl  mx-auto p-8">
     

      <ul className="flex space-x-6">
        <li className="flex flex-col items-center space-y-1 ">
          <div className="relative bg-gradient-to-tr from-yellow-400 to-purple-600 p-1 rounded-full">
            <Link to="#" className="block bg-white p-1 rounded-full transform transition hover:-rotate-6">
              <img className="w-24 h-24 rounded-full" src="https://placekitten.com/200/200" alt="cute kitty" />
            </Link>
            <button className="absolute bg-blue-500 text-white text-2xl font-medium w-8 h-8 rounded-full bottom-0 right-1 border-4 border-white flex justify-center items-center font-mono hover:bg-blue-700 focus:outline-none">
              <div className="transform -translate-y-px">+</div>
            </button>
          </div>

          <Link to="#">kitty_one</Link>
        </li>

        {/* Repeat similar corrections for other list items */}
      </ul>
    </div>
  );
}

export default Story;
