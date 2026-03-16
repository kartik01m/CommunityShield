import {useEffect,useState} from "react"

function Chat(){

const [socket,setSocket] = useState(null)
const [messages,setMessages] = useState([])
const [text,setText] = useState("")

useEffect(()=>{

const ws = new WebSocket("ws://127.0.0.1:8000/chat")

ws.onmessage = (event)=>{

setMessages(prev=>[...prev,event.data])

}

setSocket(ws)

},[])

const send = ()=>{

socket.send(text)
setText("")

}

return(

<div style={{border:"1px solid gray",padding:"10px"}}>

<h3>Emergency Chat</h3>

{messages.map((m,i)=>(

<p key={i}>{m}</p>

))}

<input
value={text}
onChange={(e)=>setText(e.target.value)}
/>

<button onClick={send}>Send</button>

</div>

)

}

export default Chat