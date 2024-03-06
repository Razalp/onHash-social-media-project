import React from 'react';


interface User {
    _id: string;
    username: string;
    profilePicture: string;
}

interface Props {
    searchQuery: string;
    handleInputChange:any;
    handleSearch: () => void;
    searchResults: User[];
    handleUserClick: (user: User) => void;
}

const SearchComponent : React.FC<Props> = ({ searchQuery, handleInputChange, handleSearch, searchResults, handleUserClick }) => {
    return (
        <div className="px-6 py-4 bg-gray-200">
            <div>
                <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-300 rounded-lg outline-none"
                    placeholder="Search or start new chat"
                    value={searchQuery}
                    onChange={handleInputChange}
                />
                <button
                    className="text-gray-600 hover:text-blue-500 focus:outline-none relative right-9 top-1"
                    onClick={handleSearch}
                ></button>
            </div>

            <div>
                {searchResults.length > 0 && (
                    <div className="mt-4 relative w-3/6">
                        <ul className="justify-start w-full">
                            {searchResults.map((user:User) => (
                                <li key={user._id} className="flex items-center space-x-4 mb-4" onClick={() => handleUserClick(user)}>
                                    <img
                                        src={`${import.meta.env.VITE_UPLOAD_URL}${user?.profilePicture}`}
                                        alt={`${user.username}'s profile`}
                                        className="w-10 h-10 rounded-full object-cover"
                                        onError={(e:any) => {
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
    );
};

export default SearchComponent;
