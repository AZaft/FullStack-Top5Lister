import { React, useContext, useState } from "react";
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

function Top5Item(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsItemEditActive();
        }
        setEditActive(newActive);
        
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let { index } = props;
            let text = event.target.value;
            store.currentList.items[index] = text;
            toggleEdit();
        }
    }

    function handleBlur(event) {
        let { index } = props;
        let text = event.target.value;
        store.currentList.items[index] = text;
        toggleEdit();
    }


    let { index } = props;

    let itemClass = "top5-item";
    
    if(!editActive){

        return (
                <ListItem
                    id={'item-' + (index+1)}
                    key={props.key}
                    className={itemClass}
                    sx={{ display: 'flex', backgroundColor: "#d4af37", borderRadius: 2, mt: "1%", mb: "1%"}}
                    onDoubleClick={handleToggleEdit}
                >
                    <Box sx={{ pt: "1%", pb: "1%"}}>{store.currentList.items[index]}</Box>
                </ListItem>
        )
    } else{

        return(
                <TextField
                    required
                    fullWidth
                    id={'item-' + (index+1)}
                    name="name"
                    className='list-card'
                    onKeyPress={handleKeyPress}
                    onBlur={handleBlur}
                    defaultValue={props.text}
                    sx={{ display: 'flex', backgroundColor: "#d4af37", borderRadius: 2, mb: "1%"}}
                    autoFocus
                />      
        )
    }
}

export default Top5Item;