import { useEffect, useState } from "react";

import Axios from "../../axious/instance";
import AdminSideBar from "../AdminSideBar/AdminSideBar";
import Chart from "./dashboardComponet/Chart"; 
import { BarChart } from "lucide-react";



const Dashboard = () => {

    const [userCounts, setUserCounts] = useState({
        totalUsers: 0,
        upgradeCount: 0,
        adminCount: 0,
        blockedCount: 0,
    });
    const [userActivities, setUserActivities] = useState({
        userCount: 0,
        postCount: 0,
        commentCount: 0,
        followCount: 0,
      });

    useEffect(() => {
        const fetchUserCounts = async () => {
            try {
                const response = await Axios.get('/api/user/user-counts');
                setUserCounts(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserCounts();
    }, []);
    
    useEffect(() => {
        const fetchUserActivities = async () => {
          try {
            const response = await Axios.get("/api/user/userActivties"); 
            setUserActivities(response.data);
      
          } catch (error) {
            console.error(error);
          }
        };
    
        fetchUserActivities();
      }, []);

    return (
        <div className="bg-black">
            <div>
                <AdminSideBar />
            </div>
           
                <ul className="flex flex-wrap ml-20">
                    <div>
                        <Chart data={userCounts}   /> 
                    </div>
                    <div>
                    <Chart data={userActivities}   /> 
                    </div>
                    <div>
                        <BarChart></BarChart>
                    </div>
                    
                 
                </ul>
            </div>
      
    );
};

export default Dashboard;
