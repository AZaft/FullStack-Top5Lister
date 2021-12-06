import { useContext, useEffect } from 'react'
import Top5Item from './Top5Item.js'
import List from '@mui/material/List';
import { Box, Typography, IconButton } from '@mui/material'
import { GlobalStoreContext } from '../store/index.js'
import { useHistory } from 'react-router-dom'
import Grid from '@mui/material/Grid';
import ListToolBar from './ListToolBar';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    
    window.onload  = function() {
        history.push("/home");
    }

    const handleKeyPress = (event) => {
        if(event.keyCode == 13){
            store.currentList.name = event.target.value;
            event.target.blur();
        }
    }

    const handleBlur = (event) =>{
        store.currentList.name = event.target.value;
    }

    const handlePublish =(event) => {
        store.publishCurrentList();
    }

    const handleSave =(event) => {
        store.updateCurrentList();
        history.push("/home");
    }

    let editItems = "";
    if (store.currentList) {
        editItems = 
            <List id="edit-items" sx={{ bgcolor: '#2c2f70' }}>
                {
                    store.currentList.items.map((item, index) => (
                        <Top5Item 
                            key={'top5-item-' + (index+1)}
                            text={item}
                            index={index}
                        />
                    ))
                }
            </List>;
    }
    return (
        <div id="top5-list-selector">
            <ListToolBar/>
            
            <div id="workspace" style={{backgroundColor: "#d4d4f5", border: "2px solid black", borderRadius: "10px"}}>
                <div style = {{backgroundColor: "white" , borderRadius: "8px", margin: "1%", width:"50%"}}>
                    <TextField 
                        onKeyDown={handleKeyPress}
                        onBlur={handleBlur}
                        id="outlined-basic" 
                        defaultValue={(store.currentList !== null) ? store.currentList.name : ""} 
                        label="List Name" 
                        variant="outlined" 
                        fullWidth />
                </div>
                <Grid 
                    container 
                    spacing={0}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ bgcolor: '#2c2f70', width: "98%", borderRadius: 4, ml: "1%", height: "65%"}}
                >
                    <Grid item xs={1}>
                            <Typography align = "center" sx = {{fontWeight: 'bold', p: "10%", m: "12%", bgcolor: "#d4af37", borderRadius: 2}} variant= "h5">1. </Typography>
                            <Typography align = "center" sx = {{fontWeight: 'bold', p: "10%", m: "12%", bgcolor: "#d4af37", borderRadius: 2}} variant= "h5">2. </Typography>
                            <Typography align = "center" sx = {{fontWeight: 'bold', p: "10%", m: "12%", bgcolor: "#d4af37", borderRadius: 2}} variant= "h5">3. </Typography>
                            <Typography align = "center" sx = {{fontWeight: 'bold', p: "10%", m: "12%", bgcolor: "#d4af37", borderRadius: 2}} variant= "h5">4. </Typography>
                            <Typography align = "center" sx = {{fontWeight: 'bold', p: "10%", m: "12%", bgcolor: "#d4af37", borderRadius: 2}} variant= "h5">5. </Typography>
                    </Grid>
                    <Grid item xs={11}>
                        <Box sx={{ width: "99%" }}>
                            {editItems}
                        </Box>
                    </Grid>
                </Grid>

                <div style={{position: "absolute", bottom: "0", right:"0", marginRight: "2%", marginBottom: "1%", width:"20%"}}>
                    <Button onClick={handleSave} size="large" sx={{ border:"1px solid", color: "black", backgroundColor: "gray"}} variant="contained">Save</Button>
                    <Button onClick={handlePublish} size="large" sx={{float: "right", border:"1px solid", color: "black", backgroundColor: "gray"}} variant="contained">Publish</Button>
                </div>
                
            </div>


            <div id="list-selector-heading">
                <IconButton 
                    id="add-list-button"
                    disabled="true"
                >
                    <AddIcon sx={{ fontSize: 75}}/>
                </IconButton>
                    <Typography variant="h3">Your Lists</Typography>
                </div>
        </div>
    )
}

export default WorkspaceScreen;