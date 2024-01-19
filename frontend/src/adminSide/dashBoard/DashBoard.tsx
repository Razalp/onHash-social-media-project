import { useNavigate } from "react-router-dom";
import AdminSideBar from "../AdminSideBar/AdminSideBar";


const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="fullbg">
            <AdminSideBar />
        </div>
    );
};

export default Dashboard;