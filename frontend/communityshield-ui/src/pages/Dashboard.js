import DisasterForm from "../components/DisasterForm"
import MapView from "../components/MapView"
import "../App.css"

function Dashboard(){

return(

<div>

<div className="header">
🚨 Citizen Disaster Reporting Portal
</div>

<div className="container">

<div className="card">

<h2>Report Emergency</h2>

<p>
If you are experiencing a disaster situation,
send an SOS alert and rescue teams will respond quickly.
</p>

<DisasterForm/>

</div>

<div className="card">

<h2>Live Disaster Map</h2>

<MapView/>

</div>

</div>

</div>

)

}

export default Dashboard