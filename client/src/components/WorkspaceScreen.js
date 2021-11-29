import { useContext, useEffect } from 'react'
import Top5Item from './Top5Item.js'
import List from '@mui/material/List';
import { Typography } from '@mui/material'
import { GlobalStoreContext } from '../store/index.js'
import { useHistory } from 'react-router-dom'

function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    
    window.onload  = function() {
        history.push("/home");
    }

    let editItems = "";
    if (store.currentList) {
        editItems = 
            <List id="edit-items" sx={{ bgcolor: 'background.paper' }}>
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
        <div id="top5-workspace">
            <div id="edit-numbering">
                <div className="item-number"><Typography variant="h3">1.</Typography></div>
                <div className="item-number"><Typography variant="h3">2.</Typography></div>
                <div className="item-number"><Typography variant="h3">3.</Typography></div>
                <div className="item-number"><Typography variant="h3">4.</Typography></div>
                <div className="item-number"><Typography variant="h3">5.</Typography></div>
            </div>
            {editItems}
        </div>
    )
}

export default WorkspaceScreen;