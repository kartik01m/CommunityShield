import {useState} from "react"
import {useNavigate} from "react-router-dom"
import "../App.css"

function Login(){

const [role,setRole]=useState("")
const navigate=useNavigate()

const login=()=>{

if(role==="citizen"){
navigate("/dashboard")
}

if(role==="rescuer"){
navigate("/rescuer")
}

}

return(

<div>

<div className="header">
🌍 CommunityShield Disaster Response System
</div>

<div className="login-container">

<div className="card login-card">

<div className="title">
CommunityShield
</div>

<div className="subtitle">
AI Powered Disaster Management Platform
</div>

<select
value={role}
onChange={(e)=>setRole(e.target.value)}
>

<option value="">Select Role</option>
<option value="citizen">Citizen Reporter</option>
<option value="rescuer">Rescue Team</option>

</select>

<button onClick={login}>
Enter System
</button>

</div>

</div>

</div>

)

}

export default Login