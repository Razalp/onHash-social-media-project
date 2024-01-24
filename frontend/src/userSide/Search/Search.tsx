import React, { useState } from 'react';
import Axios from '@/axious/instance';
import SideBar from '../SideBar/SideBar';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
const Search = () => {
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

  const handleInputChange = (e:any) => {
    const inputValue = e.target.value;
    setSearchQuery(inputValue);
    if (inputValue) {
      handleSearch();
    } else {
      setSearchResults([]); 
    }
  };

  return (
    <div className="bg-black text-white h-screen">
      <SideBar />
      <div className="flex flex-col items-center p-8 bg-custom-color rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-white uppercase">Search User</h1>
        <div className="relative">
          <input
            type="text"
            className="w-56 h-10 px-4 rounded-full border-2 border-gray-300 focus:outline-none focus:border-blue-500 transition duration-300 text-black" 
            placeholder="Enter username"
            value={searchQuery}
            onChange={handleInputChange}
          />
          <button
            className="absolute right-2 top-2 text-gray-600 hover:text-blue-500 focus:outline-none"
            onClick={handleSearch}
          >
            <FontAwesomeIcon icon={faSearch} className="w-6 h-6" />
          </button>
        </div>

        {/* Display live search results */}
        {searchResults.length > 0 && (
  <div className="mt-4 ">
    <h2 className="text-lg font-semibold mb-2">Search Results:</h2>
    <ul className='justify-start w-full'>
    {searchResults.map((user: any) => (
  <li key={user._id} className="flex items-center space-x-4 mb-4">
    <div className="flex-shrink-0">
      <img
        src={`http://localhost:3000/upload/${user.profilePicture}`}
        alt={`${user.username}'s profile`}
        className="w-16 h-16 rounded-full"
        onError={(e: any) => {
          e.target.onerror = null;
          e.target.style.display = 'none';
        }}
      />

      {!user.profilePicture && (
        <div className="w-16 h-16 rounded-full  bg-gray-300 text-black text-white">
          {user.username.charAt(0).toUpperCase()}
        </div>
      )}
    </div>

    <div>
      <p className="font-semibold">{user.username}</p>
    </div>

    <div className="flex-grow"></div>

   {/* <Button className="w-20 h-10">Go to User</Button> */}
  </li>
      ))}
    </ul>
  </div>
)}

      </div>
    </div>
  );
};

export default Search;
