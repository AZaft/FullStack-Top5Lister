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
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import DeleteModal from './DeleteModal';
import { useHistory } from 'react-router-dom'
import AuthContext from '../auth'
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

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
    const likedOrDisliked = () => {
        if(top5list.likes.includes(auth.user.userName)){
            return "liked";
        }
        if(top5list.dislikes.includes(auth.user.userName)){
            return "disliked";
        }
        return "";
    }

    const { store } = useContext(GlobalStoreContext);
    const { top5list } = props;
    const [expanded, setExpanded] = useState(false);
    const [open, setOpen] = useState(false);
    const { auth } = useContext(AuthContext);
    const [like, setLike] = useState(likedOrDisliked());
    const history = useHistory();

    

    const handleExpandClick = (event, id) => {
        setExpanded(!expanded);
        if(!expanded){
            top5list.views++;
            store.updateList(id,top5list);
        }
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

    const handleLike = () => {
        if(like === "liked"){
            let index = top5list.likes.indexOf(auth.user.userName);
            top5list.likes.splice(index, 1);
            setLike("");
        }

        if(like === ""){
            top5list.likes.push(auth.user.userName);
            setLike("liked");
        }

        if(like === "disliked"){
            let index = top5list.dislikes.indexOf(auth.user.userName);
            top5list.dislikes.splice(index, 1);
            top5list.likes.push(auth.user.userName);
            setLike("liked");
        }
        store.updateList(top5list._id,top5list);
    }

    const handleDislike = () => {
        if(like === "liked"){
            let index = top5list.likes.indexOf(auth.user.userName);
            top5list.likes.splice(index, 1);
            top5list.dislikes.push(auth.user.userName);
            setLike("disliked");
        }

        if(like === ""){
            top5list.dislikes.push(auth.user.userName);
            setLike("disliked");
        }

        if(like === "disliked"){
            let index = top5list.dislikes.indexOf(auth.user.userName);
            top5list.dislikes.splice(index, 1);
            setLike("");;
        }
        store.updateList(top5list._id,top5list);
    }

    
    let itemCards = "";
    if(store.currentList){
        let items = store.currentList.items;
        itemCards =
        <div style={{
            backgroundColor: "#2c2f70",
            borderRadius: "10px",
            marginLeft: "3%"
        }}>
            <Typography variant="h3" color = "#c8a53b">1. {items[0]}</Typography>
            <Typography variant="h3" color = "#c8a53b">2. {items[1]}</Typography>
            <Typography variant="h3" color = "#c8a53b">3. {items[2]}</Typography>
            <Typography variant="h3" color = "#c8a53b">4. {items[3]}</Typography>
            <Typography variant="h3" color = "#c8a53b">5. {items[4]}</Typography>
        </div>
    }


    let comments = "";
    if(store.currentList){
        let listComments = top5list.comments
        comments =
            <Box sx = {{mr: "2%"}}>
               
                    {
                        
                        listComments.map((c) => (
                            <Box sx = {{backgroundColor: "#c8a53b", borderRadius: 2, border: 1}}>
                                <Typography variant="h7" sx = {{ml: "1%", color: "blue", textDecoration: "underline"}}> {c.user} </Typography>
                                <Typography variant="h6" ml = "1%"> {c.comment} </Typography>
                            </Box>
                        )) 
                    }
                
            </Box>
    }


    let thumbsUp = <ThumbUpOutlinedIcon fontSize="large"/>;
    if(like === "liked"){
        thumbsUp = <ThumbUpIcon fontSize="large"/>;
    }

    let thumbsDown = <ThumbDownOutlinedIcon fontSize="large"/>;
    if(like === "disliked"){
        thumbsDown = <ThumbDownIcon fontSize="large"/>;
    }
    return (
        <Card style={{ backgroundColor: top5list.published ? "#d4d4f5" : "#d4d4f5", borderRadius: "10px", marginBottom: "10px"}} >
            <DeleteModal 
                    open={open}
                    setOpen={setOpen}
                    listName={top5list.name}
            />

            <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: "8px"
            }}>

                <Typography ml = "0.6vw" variant="h4" style={{ flex: 1 }}>
                    {top5list.name} 
                </Typography>

                <IconButton onClick={() =>handleLike()}>
                    {thumbsUp}
                </IconButton>

                <Typography sx={{ mr: "3vw" }}> {top5list.likes.length} </Typography>

                <IconButton onClick={() => handleDislike()}>
                    {thumbsDown}
                </IconButton>

                <Typography sx={{ mr: "3vw" }}> {top5list.dislikes.length} </Typography>

                <IconButton onClick={(event) => {
                    if(!open)
                        handleDeleteList(event, top5list._id)
                    }}>
                    <DeleteForeverOutlinedIcon fontSize="large"/>
                </IconButton>
            </div>
            

            <Typography ml = "1.2vw">
                By: {top5list.user}
            </Typography>
            
            
            
            <Collapse in={expanded} timeout="auto" unmountOnExit>

                <Grid 
                    container spacing={2}
                    justifyContent="center"
                    alignItems="flex-end"
                >
                    <Grid item xs={6}>
                        {itemCards}
                    </Grid>
                    <Grid item xs={6}>
                        <div style={{
                            height: "14em",
                            overflowY: "scroll"
                        }}>
                            {comments}
                        </div>
                        <div style = {{backgroundColor: "white" , borderRadius: "8px", marginRight: "3%"}}>
                            <TextField id="outlined-basic" label="Add Comment" variant="outlined" fullWidth />
                        </div>
                        
                    </Grid>
                </Grid>
                
            </Collapse>

            <CardActions>
                <Button size="small" color="error" sx={{ mr: "50vw" }} onClick={(event) => {handleEditList(event, top5list._id)}} >
                    Edit
                </Button>
                
                

                <Typography style={{ flex: 1 }}>
                    Views: {top5list.views}
                </Typography>

                <ExpandMore
                    expand={expanded}
                    onClick={ (event) => {handleExpandClick(event, top5list._id)}}
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