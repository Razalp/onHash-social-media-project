import React, { useEffect, useState } from 'react';
import Axios from '@/axious/instance';
import SideBar from '../SideBar/SideBar';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { jwtDecode } from 'jwt-decode';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate()


  const token: any = localStorage.getItem('accessToken');

  if (!token) {
    return
  }
  const decodedToken: any = jwtDecode(token);
  const currentUserId = decodedToken.userId;


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
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/search')
     
    }else{
      navigate('/log-in');
    }
  }, []);

  return (
    <div className="bg-black text-white h-screen">
      <SideBar />
      <div className="flex flex-col items-center p-8 bg-custom-color rounded-lg shadow-md">
        <div className="w-3/6">
          <input
            type="text"
            className="w-60 h-10 px-4 rounded-full border-2 border-gray-300 focus:outline-none focus:border-blue-500 transition duration-300 text-black"
            placeholder="Enter username"
            value={searchQuery}
            onChange={handleInputChange}
          />
          <button
            className="text-gray-600 hover:text-blue-500 focus:outline-none relative right-9 top-1"
            onClick={handleSearch}
          >
            <FontAwesomeIcon icon={faSearch} className="w-6 h-6" />
          </button>
        </div>

        {/* Display live search results */}
        {searchResults.length > 0 && (
          <div className="mt-4 relative w-3/6">
            <ul className="justify-start w-full">
              {searchResults.map((user: any) => (
                <li key={user._id} className="flex items-center space-x-4 mb-4">
                  <Link
                    to={`/SerachUserProfile/${user._id}`}
                    className=""
                  >
                    <img
                      src={`${import.meta.env.VITE_UPLOAD_URL}${user?.profilePicture}`}
                      alt={`${user.username}'s profile`}
                      className="w-10 h-10 rounded-full"
                      onError={(e: any) => {
                        e.target.onerror = null;
                        e.target.src = '';
                      }}
                    />
                  </Link>

                  <div>
                    <Link to={`/SerachUserProfile/${user._id}`} className="">
                      <p className="font-semibold w-4/6">{user.username}</p>
                    </Link>
                  </div>

                  <div className="flex-grow"></div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>

    // {searchResults.length > 0 && (
    //   <div className="mt-4 relative w-3/6">
    //     <ul className="justify-start w-full">
    //       {searchResults.map((user: any) => (
    //         <li key={user._id} className="flex items-center space-x-4 mb-4">
    //           {currentUserId === user._id ? (
    //             <Link to="/profile" className="">

    //             </Link>
    //           ) : (

    //             <>
    //               <Link to={`/SerachUserProfile/${user._id}`} className="">
    //                 <img
    //                   src={`${import.meta.env.VITE_UPLOAD_URL}${user?.profilePicture}`}
    //                   alt={`${user.username}'s profile`}
    //                   className="w-10 h-10 rounded-full"
    //                   onError={(e: any) => {
    //                     e.target.onerror = null;
    //                     e.target.src = '';
    //                   }}
    //                 />
    //               </Link>

    //               <div>
    //                 <Link to={`/SerachUserProfile/${user._id}`} className="">
    //                   <p className="font-semibold w-4/6">{user.username}</p>
    //                 </Link>
    //               </div>

    //               <div className="flex-grow"></div>
    //             </>
    //           )}
    //         </li>
    //       ))}
    //     </ul>
    //   </div>
    // )}
    // </div>
    // </div>




  );
};

export default Search;
