import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import { IconButton, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
import ListToolBar from './ListToolBar';

const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);
    
    function handleCreateNewList() {
        store.createNewList();
    }
    let listCard = "";
    if (store) {
        listCard = 
            <List sx={{ width: '90%', left: '5%', bgcolor: 'background.paper' }}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
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