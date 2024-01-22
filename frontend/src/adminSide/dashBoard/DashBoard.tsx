import { useNavigate } from "react-router-dom";
import AdminSideBar from "../AdminSideBar/AdminSideBar";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  faUsers,
  faUserLock,
  faFile,
  faLock,
  faUserPlus,
  faThumbsUp,
  faComment,
  faFlag,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Axios from "../../axious/instance";

const Dashboard = () => {
    const navigate = useNavigate();

    const { userDetails } = useSelector((state: any) => state.userDetails) ?? {};

    const [userCounts, setUserCounts] = useState({
        totalUsers: 0,
        upgradeCount: 0,
        adminCount: 0,
        blockedCount: 0,
    });

    useEffect(() => {
        const fetchUserCounts = async () => {
            try {
                const response = await Axios.get('api/user/user-counts');
                setUserCounts(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserCounts();
    }, []);

    return (
        <div className="fullbg">
            <div>
                <AdminSideBar />
            </div>
            <div className="items-center">
                <ul className="flex flex-wrap justify-center space-x-40">
                    <div>
                    <li className="text-3xl flex flex-col items-center hover:text-yellow-200 m-4">
                        <FontAwesomeIcon icon={faUsers} size="lg" />
                        <span className="text-xl mt-2">{userCounts.totalUsers}</span>
                    </li>

                    <li className="text-3xl flex flex-col items-center hover:text-yellow-200 m-4">
                        <FontAwesomeIcon icon={faUserPlus} size="lg" />
                        <span className="text-xl mt-2">{userCounts.upgradeCount}</span>
                    </li>

                    <li className="text-3xl flex flex-col items-center hover:text-yellow-200 m-4">
                        <FontAwesomeIcon icon={faLock} size="lg" />
                        <span className="text-xl mt-2">{userCounts.adminCount}</span>
                    </li>
                    </div>
                    <div>
                    <li className="text-3xl flex flex-col items-center hover:text-yellow-200 m-4">
                        <FontAwesomeIcon icon={faUserLock} size="lg" />
                        <span className="text-xl mt-2">{userCounts.blockedCount}</span>
                    </li>

             

           
                    <li className="text-3xl flex flex-col items-center hover:text-yellow-200 m-4">
                        <FontAwesomeIcon icon={faThumbsUp} size="lg" />
                        <span className="text-xl mt-2">Likes</span>
                    </li>

                    <li className="text-3xl flex flex-col items-center hover:text-yellow-200 m-4">
                        <FontAwesomeIcon icon={faComment} size="lg" />
                        <span className="text-xl mt-2">Comments</span>
                    </li>
                    </div>
                    <div>
                    <li className="text-3xl flex flex-col items-center hover:text-yellow-200 m-4">
                        <FontAwesomeIcon icon={faFlag} size="lg" />
                        <span className="text-xl mt-2">Report</span>
                    </li>
                    </div>
                </ul>
                </div>
               
                </div>
           
            


    );
};

export default Dashboard;
