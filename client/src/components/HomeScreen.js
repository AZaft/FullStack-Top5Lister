import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import ListCard from './ListCard.js'
import { IconButton, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
import ListToolBar from './ListToolBar';
import { useHistory, useLocation, useParams } from 'react-router-dom'

const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const location = useLocation();



    useEffect(() => {
        if(auth.user){
            if(location.pathname === "/home" )
                store.loadIdNamePairs();

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
    return (
        <div id="top5-list-selector">
            <ListToolBar/>

            <div id="list-selector-list">
                {
                    listCard
                }
            </div>

            <div id="list-selector-heading">
            <IconButton 
                id="add-list-button"
                onClick={handleCreateNewList}
            >
                <AddIcon sx={{ fontSize: 75, color: 'black'}}/>
            </IconButton>
                <Typography variant="h3">Your Lists</Typography>
            </div>

        </div>)
}

export default HomeScreen;