import React, { useContext, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatContainer from '../components/ChatContainer';
import RightSidebar from '../components/RightSidebar';
import { ChatContext } from '../../context/ChatContext';

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(true);

  // This function will be passed to the ChatContainer to be called by the "i" button
  const toggleRightSidebar = () => {
    setIsRightSidebarVisible(prevState => !prevState);
  };

  // Dynamically determines the grid layout
  const getGridColsClass = () => {
    if (!selectedUser) {
      return 'md:grid-cols-2'; // Layout when no user is selected
    }
    if (isRightSidebarVisible) {
      // Layout when the right sidebar is visible
      return 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]';
    }
    // Layout when the right sidebar is hidden
    return 'md:grid-cols-[1fr_2.5fr]';
  };

  return (
    <div className='border w-full h-screen sm:px-[15%] sm:py-[5%]'>
      <div className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative ${getGridColsClass()}`}>
        <Sidebar />
        <ChatContainer toggleRightSidebar={toggleRightSidebar} />
        {/* The RightSidebar is now only rendered if it's supposed to be visible */}
        {selectedUser && isRightSidebarVisible && <RightSidebar />}
      </div>
    </div>
  );
};

export default HomePage;