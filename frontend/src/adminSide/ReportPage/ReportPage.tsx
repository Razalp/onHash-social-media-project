import { useState, useEffect } from 'react';
import AdminSideBar from '../AdminSideBar/AdminSideBar';
import './ReportPage.css';
import Axios from '@/axious/instance';

const ReportPage = () => {
    const [reports, setReports] = useState([]);

    // Function to handle report deletion
    const handleDelete = async (postId) => {
        try {
            await Axios.delete(`/api/admin/posts/reject-reports/${postId}`);
            // Reload reports after deletion
            fetchReportData();
        } catch (error) {
            console.error('Error deleting reports:', error);
        }
    };

    // Function to handle image deletion
    const handleDeleteImage = async (postId, imageId) => {
        try {
            await Axios.delete(`/api/admin/posts/image/${postId}/${imageId}`);
            // Reload reports after image deletion
            fetchReportData();
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };


    const fetchReportData = async () => {
        try {
            const response = await Axios.get('/api/admin/reports');
            setReports(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching report data:', error);
        }
    };

    useEffect(() => {
        // Fetch report data on component mount
        fetchReportData();
    }, []);

    return (
        <>
            <AdminSideBar />
            <div className='fullbg overflow-x-auto'>
                <div className='flex justify-end'>
                    <input
                        className='p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
                        type='text'
                        placeholder='Search users...'
                    />
                </div>
                <br />
                <table className="w-full table-fixed text-white border-collapse">
                    <thead className="bg-gray-800 text-gray-300">
                        <tr className="table-row">
                            <th className="py-2"></th>
                            <th className="px-4 py-2 text-left">USERNAME</th>
                            <th className="px-4 py-2 text-left">EMAIL</th>
                            <th className="px-4 py-2 text-center">IMAGE</th>
                            <th className="px-4 py-2 text-center">REPORT</th>
                            <th className="px-4 py-2 text-center">REPORTED USERS</th>
                            <th className="px-4 py-2 text-center">ACTION</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-700 divide-y divide-gray-600">
                        {Array.isArray(reports) && reports.length > 0 ? (
                            reports.map((report: any, index) => (
                                <tr key={index} className='table-row bg-gray-800'>
                                    <td className="py-2"></td>
                                    <td className="px-4 py-2">{report?.user?.username}</td>
                                    <td className="px-4 py-2">{report?.user?.email}</td>
                                    <td className="px-4 py-2 text-center">
                                    <h1>{report.rejected ? "the image is rejected" : "some issues"}</h1>
    {report.image && report.image.length > 0 && (
        <div className="image-container">
            
            <img className='w-36 h-30' src={`http://localhost:3000/upload/${report.image[0]}`} alt="" />
        </div>
    )}
</td>
                                    <td className="px-4 py-2 text-center"></td>
                                    <td className='px-4 py-2 text-center'>
                                        {report.reports.map((reportItem: any, index) => (
                                            <div key={index}>{reportItem.reason}</div>
                                        ))}
                                    </td>

                                    <td className="px-4 py-2 space-y-2 text-center">
                                        <button
                                            className='btn-black'
                                            onClick={() => handleDelete(report._id)}
                                        >
                                            DELETE
                                        </button>
                                        <button
                                            className='btn-black'
                                            onClick={() => handleDeleteImage(report._id, report.image[0]._id)}
                                        >
                                            REJECT
                                        </button>
                                    </td>
                                    <td className="px-4 py-2 text-center"></td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-4">No reports found.</td>
                            </tr>
                        )}

                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ReportPage;
