import React from 'react'
import ChatHeader from './ChatHeader'
import MatchDisplay from './MatchDisplay'
import ChatDisplay from './ChatDisplay'

function ChatComponent() {
    return (
        <div className='bg-[#fff5e1] m-2 shadow-custom-light rounded-sm text-left' id='chat-container z-10'>
            <ChatHeader/>
            <div className='flex m-2 gap-3 text-center text-md'>
                <button className=' bg-white border-b-4 border-[rgb(243,33,33)] m-1 p-2 rounded-md disabled:border-[rgb(187,187,187)]'>Matches</button>
                <button className=' bg-white border-b-4 border-[rgb(243,33,33)]
                m-1 p-2 rounded-md disabled:border-[rgb(187,187,187)]'>Chat</button>
            </div>
            <MatchDisplay/>

            <ChatDisplay/>
        </div>
    )
}

export default ChatComponent
