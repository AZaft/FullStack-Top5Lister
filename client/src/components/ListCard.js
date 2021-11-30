import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import DeleteModal from './DeleteModal';
import { useHistory } from 'react-router-dom'



const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { idNamePair } = props;
    const [expanded, setExpanded] = useState(false);
    const [open, setOpen] = useState(false);
    const history = useHistory();

    const handleExpandClick = (event, id) => {
        setExpanded(!expanded);
        store.setCurrentList(id);
    };

    const handleEditList = (event, id) => {
        store.setCurrentList(id);
        history.push("/top5list/" + id);
    };
        


    async function handleDeleteList(event, id) {
        event.stopPropagation();
        setOpen(true);
        store.markListForDeletion(id);
    }


    let itemCards = "";
    if(store.currentList){
        let items = store.currentList.items;
        itemCards =
        <div style={{
            backgroundColor: "#2c2f70",
            borderRadius: "10px",
            marginLeft: "1.2vw",
            width: "50%"
        }}>
            <Typography variant="h3" color = "#c8a53b">1. {items[0]}</Typography>
            <Typography variant="h3" color = "#c8a53b">2. {items[1]}</Typography>
            <Typography variant="h3" color = "#c8a53b">3. {items[2]}</Typography>
            <Typography variant="h3" color = "#c8a53b">4. {items[3]}</Typography>
            <Typography variant="h3" color = "#c8a53b">5. {items[4]}</Typography>
        </div>
    }
    
    

    return (
        <Card  style={{backgroundColor: "#d4d4f5", borderRadius: "10px", marginBottom: "10px"}} >
            <DeleteModal 
                    open={open}
                    setOpen={setOpen}
                    listName={idNamePair.name}
            />

            <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: "8px"
            }}>

                <Typography ml = "0.6vw" variant="h4" style={{ flex: 1 }}>
                    {idNamePair.name} 
                </Typography>

                <IconButton>
                    <ThumbUpOutlinedIcon fontSize="large"/>
                </IconButton>

                <Typography sx={{ mr: "3vw" }}> {idNamePair.likes} </Typography>

                <IconButton>
                    <ThumbDownOutlinedIcon fontSize="large"/>
                </IconButton>

                <Typography sx={{ mr: "3vw" }}> {idNamePair.dislikes} </Typography>

                <IconButton onClick={(event) => {
                    if(!open)
                        handleDeleteList(event, idNamePair._id)
                    }}>
                    <DeleteForeverOutlinedIcon fontSize="large"/>
                </IconButton>
            </div>
            

            <Typography ml = "1.2vw">
                By: {idNamePair.user}
            </Typography>
            
            
            
            <Collapse in={expanded} timeout="auto" unmountOnExit>
               
                {itemCards}
               
            </Collapse>

            <CardActions>
                <Button size="small" color="error" sx={{ mr: "50vw" }} onClick={(event) => {handleEditList(event, idNamePair._id)}} >
                    Edit
                </Button>
                
                

                <Typography style={{ flex: 1 }}>
                    Views: {idNamePair.views}
                </Typography>

                <ExpandMore
                    expand={expanded}
                    onClick={ (event) => {handleExpandClick(event, idNamePair._id)}}
                    aria-expanded={expanded}
                    aria-label="show more"

                >   
                        <ExpandMoreIcon fontSize="large"/>
                </ExpandMore>
            </CardActions>
        </Card>
    );
}

export default ListCard;