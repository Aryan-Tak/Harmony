import React,{useState} from 'react'

function ChatInput() {
    const [textArea , setTextArea] = useState('')
    return (
        <div className='flex justify-between p-2 '>
            <textarea value={textArea} onChange={(e) => setTextArea(e.target.value)} placeholder="Start typing...."/>
            <button className='rounded-lg bg-[#ffe0b2] m-2 p-2'>Send</button>
        </div>
    )
}

export default ChatInput
