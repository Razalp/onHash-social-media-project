import { useState, useEffect } from 'react';
import AdminSideBar from '../AdminSideBar/AdminSideBar';
import './ReportPage.css';
import Axios from '@/axious/instance';

const ReportPage = () => {
    const [reports, setReports] = useState([]);

    const handleDelete = async (postId:string) => {
        try {
            await Axios.delete(`/api/admin/postDelete/${postId}`);
  
            fetchReportData();
        } catch (error) {
            console.error('Error deleting reports:', error);
        }
    };


    // const handleDeleteImage = async (postId:string, imageId:string) => {
    //     try {
    //         await Axios.delete(`/api/admin/posts/image/${postId}/${imageId}`);

    //         fetchReportData();
    //     } catch (error) {
    //         console.error('Error deleting image:', error);
    //     }
    // };


    const fetchReportData = async () => {
        try {
            const response = await Axios.get('/api/admin/report');
            setReports(response.data);
            console.log(response.data)

        } catch (error) {
            console.error('Error fetching report data:', error);
        }
    };

    useEffect(() => {
        // Fetch report data on component mount
        fetchReportData();
    }, []);

    return (
        <div className='bg-black' >
            <AdminSideBar />
            <div className='bg-black ' style={{height:"100vh"}} >
               
                <br />
                <table className="w-full table-fixed text-white border-collapse">
                    <thead className="bg-gray-800 text-gray-300 text-sm">
                        <tr className="table-row">
                            <th className="py-2"></th>
                            <th className="px-4 py-2 text-left">USERNAME</th>
                            <th className="px-4 py-2 text-left">EMAIL</th>
                            <th className="px-4 py-2 text-center">IMAGE</th>
                            <th className="px-4 py-2 text-center">REPORT</th>
                            <th className="px-4 py-2 text-center">ACTION</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-700 divide-y divide-gray-600">
                        {Array.isArray(reports) && reports.length > 0 ? (
                            reports.map((report:any, index) => (
                                <tr key={index} className='table-row bg-gray-800'>
                                    <td className="py-2"></td>
                                    <td className="px-4 py-2 text-sm">{report?.user?.username}</td>
                                    <td className="px-4 py-2 text-sm">{report?.user?.email}</td>
                                    <td className="px-4 py-2 text-center">
                                        {report.image && report.image.length > 0 && (
                                            <div className="image-container">
                                                <img className="w-20 h-20 object-cover rounded-full"  src={`${import.meta.env.VITE_UPLOAD_URL}${report.image[0]}`} alt="" />
                                            </div>
                                        )}
                                    </td>
                                    <td className='px-4 py-2 text-center text-sm'>
                                        {report.reports.map((reportItem:any, index:any) => (
                                            <div key={index}>{reportItem.reason}</div>
                                        ))}
                                    </td>
                                    <td className="px-4 py-2 space-y-2 text-center">
                                        <button
                                            className='btn-black text-sm'
                                            onClick={() => handleDelete(report._id)}
                                        >
                                            DELETE
                                        </button>
                                    </td>
                                    <td className="px-4 py-2 text-center"></td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                          <td colSpan={8} className="text-center py-4 text-sm">No reports found.</td>

                            </tr>
                        )}

                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportPage;
