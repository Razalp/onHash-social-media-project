import React from 'react';

interface EditModalProps {
  user: any;
  handleedit: () => void;
  userpostlength: number;
  followers: any;
  following: any;
  openModal: () => void;
  opens: () => void;
  getInitials: (username: string) => string;
}

const EditModal : React.FC<EditModalProps> = ({user,handleedit ,userpostlength ,followers, following ,openModal ,opens ,getInitials   }) => {
  const profilePictureUrl = user.profilePicture
  ? `${import.meta.env.VITE_UPLOAD_URL}${user.profilePicture}`
  : `https://ui-avatars.com/api/?name=${getInitials(user.username)}&background=random&size=200`;
  return (
    <div className="max-w-2xl mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-16 bg-gray-900 shadow-xl rounded-lg text-gray-900 w-full h-full ">
      <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-blue-50 rounded-full overflow-hidden">
        <img
        onClick={handleedit}
          className="object-cover object-center h-auto w-auto"
          src={profilePictureUrl}
          alt="Woman looking front"
        />
        
      </div>
      <div className="text-center mt-2">
        <h2 className="font-semibold text-white">{user.username}</h2>
        <p className="text-white">{user.bio}</p>
      </div>
    
      <ul className="py-4 mt-2 text-white flex items-center justify-around ">
        <li className="flex flex-col items-center justify-around" onClick={openModal}>
          <h1 className='text-sm'>followers</h1>
          <div>{followers}</div>
        </li>
        <li className="flex flex-col items-center justify-between" onClick={opens}>
         <h1 className='text-sm'>following</h1>
          <div>{following}</div>
        </li>
        <li className="flex flex-col items-center justify-around">
        <h1 className='text-sm'>post</h1>
          <div>{userpostlength}</div>
        </li>
      </ul>
      {/* <div className="p-4 border-t mt-2 flex space-x-4">
  <button className="w-1/2 block mx-auto rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2">
    Follow           
  </button>
  <button  className="w-1/2 block mx-auto rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2">
    Message
  </button>
</div> */}

    </div>
  );
};

export default EditModal;
``
