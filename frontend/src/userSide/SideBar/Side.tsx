import React, { useState } from 'react'

const Side = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
      setSidebarOpen(!isSidebarOpen);
    };
  
  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
      <button onClick={toggleSidebar}>Toggle Sidebar</button>
      <ul>
        <li>Home</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
    </div>
  )
}

export default Side
