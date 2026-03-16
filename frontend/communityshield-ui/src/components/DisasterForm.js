import {useState} from "react"
import axios from "axios"
import AlertModal from "./AlertModal"

function DisasterForm(){

const [disasterType,setDisasterType]=useState("")
const [description,setDescription]=useState("")
const [photo,setPhoto]=useState(null)

const [popup,setPopup]=useState("")

const sendSOS=async()=>{

try{

let photoUrl=""

if(photo){

const formData=new FormData()
formData.append("file",photo)

const uploadRes=await axios.post(
"http://127.0.0.1:8000/upload-photo",
formData,
{headers:{"Content-Type":"multipart/form-data"}}
)

photoUrl=uploadRes.data.file

}

navigator.geolocation.getCurrentPosition(async(position)=>{

const lat=position.coords.latitude
const lon=position.coords.longitude

await axios.post("http://127.0.0.1:8000/alert",{

disaster_type:disasterType,
description:description,
latitude:lat,
longitude:lon,
photo:photoUrl

})

setPopup("SOS sent successfully. Rescue teams have been notified.")

})

}catch{

setPopup("Error sending SOS. Please try again.")

}

}

return(

<div>

<select
value={disasterType}
onChange={(e)=>setDisasterType(e.target.value)}
>

<option value="">Select Disaster Type</option>
<option value="Flood">Flood</option>
<option value="Fire">Fire</option>
<option value="Earthquake">Earthquake</option>
<option value="Landslide">Landslide</option>

</select>

<textarea
placeholder="Describe the disaster situation"
value={description}
onChange={(e)=>setDescription(e.target.value)}
/>

<input
type="file"
onChange={(e)=>setPhoto(e.target.files[0])}
/>

<button onClick={sendSOS}>
🚨 Send Emergency SOS
</button>

<AlertModal
message={popup}
onClose={()=>setPopup("")}
/>

</div>

)

}

export default DisasterForm