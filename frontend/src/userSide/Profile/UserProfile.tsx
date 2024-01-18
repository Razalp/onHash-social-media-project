import SideBar from "../SideBar/SideBar";
import profile from './profile.jpg';
import './UserProfile.css';

const UserProfile = () => {
  return (
    <>
      <SideBar />
      <div className="fullbg">
        <div>
          <div className="p-8 flex justify-center items-center flex-col">
            <img
              className="rounded-full w-44 h-44 object-cover shadow-md"
              src={profile}
              alt="Profile"
            />
            <button className="ml-28 hover:text-yellow-200">🖍 Edit</button>
          </div>
          <div>
            <ul className="flex justify-evenly ">
              <li className="text-2xl hover:text-yellow-200">Post</li>
              <li className="text-2xl hover:text-yellow-200">Followers</li>
              <li className="text-2xl hover:text-yellow-200">Following</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
