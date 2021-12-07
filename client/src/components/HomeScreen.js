import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import ListCard from './ListCard.js'
import { IconButton, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
import ListToolBar from './ListToolBar';
import { useHistory, useLocation } from 'react-router-dom'

const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const location = useLocation();
    const history = useHistory();


    useEffect(() => {

        if(location.pathname === "/home" ){
            if(auth.user)
                store.loadIdNamePairs();
        }

        if(location.pathname === "/all" )
            store.loadAllLists();

        if(location.pathname === "/community"){
            store.clearTop5Lists();
        }

        if(location.pathname === "/user"){
            store.clearTop5Lists();
        }

        if(location.pathname === "/community"){
            store.loadAllCommunityLists();
        }
    }, [auth.user, location]);
    
    function handleCreateNewList() {
        store.createNewList();
    }
    
    let listCard = "";
    if (store.top5Lists) {
        listCard = 
            <List disablePadding sx={{ width: '98%', left: '1.5%' }}>
            {
                store.top5Lists.map((list) => (
                    <ListCard
                        key={list._id}
                        top5list={list}
                        selected={false}
                    />
                ))
            }
            </List>;
    }

    let statusBar = "";

    if(location.pathname === "/home"){
        statusBar =
        <div id="list-selector-heading">
        <IconButton 
            disabled = {!(location.pathname === "/home")}
            id="add-list-button"
            onClick={handleCreateNewList}
            style={{opacity: !(location.pathname === "/home") ? "0.3" : "1"}}
        >
            <AddIcon sx={{ fontSize: 75, color: 'black'}}/>
        </IconButton>
            <Typography variant="h3">Your Lists</Typography>
        </div>;
    } else {
        let currentTab = location.pathname.substring(1);
        statusBar =
        <div id="list-selector-heading">
            <Typography variant="h3">{currentTab.charAt(0).toUpperCase() + currentTab.slice(1)} Lists</Typography>
        </div>;
    }
    

    return (
        <div id="top5-list-selector">
            <ListToolBar/>

            <div id="list-selector-list">
                {
                    listCard
                }
            </div>

            {statusBar}

        </div>)
}

export default HomeScreen;