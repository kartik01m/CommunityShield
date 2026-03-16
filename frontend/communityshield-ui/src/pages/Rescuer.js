import {useEffect,useState} from "react"
import axios from "axios"
import MapView from "../components/MapView"
import AlertModal from "../components/AlertModal"
import "../App.css"

function Rescuer(){

const [alerts,setAlerts]=useState([])
const [popup,setPopup]=useState("")

const loadAlerts=async()=>{

const res=await axios.get("http://127.0.0.1:8000/alerts")
setAlerts(res.data)

}

useEffect(()=>{
loadAlerts()
},[])

const acceptRescue=async(id)=>{

try{

await axios.post(`http://127.0.0.1:8000/accept-rescue/${id}`)

setPopup("Rescue mission accepted. Team is responding.")

loadAlerts()

}catch{

setPopup("Error accepting rescue")

}

}

const severityClass=(level)=>{
if(!level) return ""
return level.toLowerCase()
}

return(

<div>

<div className="header">
🚑 Rescue Operations Command Center
</div>

<div className="container">

<h2>Active Disaster Alerts</h2>

{alerts.map(alert=>(

<div key={alert.id} className="card alert-card">

<h3>{alert.disaster_type}</h3>

<p>{alert.description}</p>

{alert.photo && (
<img src={alert.photo} alt="disaster"/>
)}

<p><b>AI Detection:</b> {alert.ai_prediction}</p>

<div className={`badge ${severityClass(alert.severity)}`}>
{alert.severity}
</div>

<br/><br/>

<button onClick={()=>acceptRescue(alert.id)}>
Accept Rescue Mission
</button>

</div>

))}

<div className="card">

<h2>Disaster Monitoring Map</h2>

<MapView alerts={alerts}/>

</div>

</div>

<AlertModal
message={popup}
onClose={()=>setPopup("")}
/>

</div>

)

}

export default Rescuer