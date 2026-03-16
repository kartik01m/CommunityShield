import "../App.css"

function AlertModal({message,onClose}){

if(!message) return null

return(

<div className="modal-overlay">

<div className="modal-box">

<h2>✅ SUCCESS</h2>

<p>{message}</p>

<button onClick={onClose}>
OK
</button>

</div>

</div>

)

}

export default AlertModal