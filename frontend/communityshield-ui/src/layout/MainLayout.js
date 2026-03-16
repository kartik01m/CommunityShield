import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

const drawerWidth = 220;

function MainLayout({ children }) {

const navigate = useNavigate()

return (

<div style={{display:"flex"}}>

<Drawer
variant="permanent"
sx={{width:drawerWidth}}

>

<List>

<ListItem button onClick={()=>navigate("/dashboard")}>
<ListItemText primary="Citizen Dashboard"/>
</ListItem>

<ListItem button onClick={()=>navigate("/rescuer")}>
<ListItemText primary="Rescuer Dashboard"/>
</ListItem>

</List>

</Drawer>

<div style={{flexGrow:1}}>

<AppBar position="static">

<Toolbar>

<Typography variant="h6">
CommunityShield Disaster Platform
</Typography>

</Toolbar>

</AppBar>

<div style={{padding:"20px"}}>

{children}

</div>

</div>

</div>

)

}

export default MainLayout