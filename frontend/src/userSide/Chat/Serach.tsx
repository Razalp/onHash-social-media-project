import Axios from '@/axious/instance';
import React, { useState } from 'react'

const Serach = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    

    const handleSearch = async () => {
        try {
          const response = await Axios.get(`/api/user/searchUser?query=${searchQuery}`);
          setSearchResults(response.data);
          console.log(searchResults)
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      };

      const handleInputChange = (e: any) => {
        const inputValue = e.target.value;
        setSearchQuery(inputValue);
        if (inputValue) {
          handleSearch();
        } else {
          setSearchResults([]);
        }
      };
    
  return (
    <div className="px-6 py-4 bg-gray-200">
    <div>
    <input type="text" className="w-full px-3 py-2 bg-gray-300 rounded-lg outline-none" placeholder="Search or start new chat" 
     value={searchQuery}
     onChange={handleInputChange}/>

<button
    className="text-gray-600 hover:text-blue-500 focus:outline-none relative right-9 top-1"
    onClick={handleSearch}
  >

  </button>
     </div>
     <div>
     {searchResults.length > 0 && (
  <div className="mt-4 relative w-3/6">
    <ul className="justify-start w-full">
      {searchResults.map((user: any) => (
        <li key={user._id} className="flex items-center space-x-4 mb-4">
         
            <img
              src={`http://localhost:3000/upload/${user?.profilePicture}`}
              alt={`${user.username}'s profile`}
              className="w-10 h-10 rounded-full"
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src = '';
              }}
            />
            <h1>{user.username}</h1>
          <div className="flex-grow"></div>
        </li>
      ))}
    </ul>
  </div>
)}
     </div>
  </div>
  
  )
}

export default Serach
