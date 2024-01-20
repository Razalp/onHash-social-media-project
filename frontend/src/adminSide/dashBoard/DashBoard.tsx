import { useNavigate } from "react-router-dom";
import AdminSideBar from "../AdminSideBar/AdminSideBar";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { faUsers , faUserLock ,faFile, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Dashboard = () => {
    const navigate = useNavigate();

    const { userDetails } = useSelector((state: any) => state.userDetails) ?? {};

    useEffect(() => {
        if (!userDetails) {
 
            console.error("User details not available");
        }
    }, [userDetails]);
    
    

    return (
        <div className="fullbg">
            <div>
            <AdminSideBar />
            </div>
          <div className=" items-center ">
          <ul className="flex justify-evenly ">
    <li className="text-xl flex flex-col items-center hover:text-yellow-200">
      <FontAwesomeIcon icon={faUsers} /> <span>1</span>
    </li>
    <li className="text-xl flex flex-col items-center hover:text-yellow-200">
      <FontAwesomeIcon icon={faLock} /> <span>1</span>
    </li>
    <li className="text-xl flex flex-col items-center hover:text-yellow-200">
      <FontAwesomeIcon icon={faFile} /> <span>1</span>
    </li>
</ul>
          </div>


        </div>
    );
};

export default Dashboard;