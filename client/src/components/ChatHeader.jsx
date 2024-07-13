import React from 'react'

function ChatHeader() {
    return (
        <div className='bg-[#fff5e1] h-24  m-1 flex justify-between align-middle '>
            <div id="profile " className='flex align-middle p-5 font-medium'>
                <div id="img-container" className='h-7 w-7 rounded-xl overflow-hidden m-2'>
                    <img src="" className='w-full'/>
                </div>
                <h3>UserName </h3>
                
            </div>
            {/* <i className='log-out-icon'>←</i> */}
        </div>
    )
}

export default ChatHeader
