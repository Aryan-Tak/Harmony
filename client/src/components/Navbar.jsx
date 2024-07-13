import React from 'react';

function Navbar({ onChatClick }) {
  return (
    <nav className="flex justify-between items-center p-4 bg-indigo-600 text-white">
      <div className="text-2xl font-bold lg:block hidden">H</div>
      <button className="lg:hidden block text-2xl font-bold" onClick={onChatClick}>
        Chat
      </button>
      <button className="p-2 bg-indigo-800 rounded-full">
        <i className="fa-solid fa-user"></i>
      </button>
    </nav>
  );
}

export default Navbar;
