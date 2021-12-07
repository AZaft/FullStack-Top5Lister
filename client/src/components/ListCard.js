import { useContext, useState, useEffect } from 'react'
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
        if(!auth.user){
            return "";
        }
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
    const [comment, setComment] = useState("");
    const history = useHistory();

    useEffect(() => {
        let comment = document.getElementById("comment"+ (top5list.comments.length-1));
        
        if(comment)
            comment.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }, [comment])
    
    
    const handleExpandClick = (event, id) => {
        setExpanded(!expanded);
        if(!expanded && top5list.published){
            top5list.views++;
            store.updateList(id,top5list);
        }
        store.setCurrentList(id);
    };

    const handleEditList = async (event, id) => {
        let response = await store.setCurrentList(id);
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

    const handleKeyPress = (event) => {
        if(event.keyCode == 13){
            let comment = {user: auth.user.userName, comment: event.target.value};
            top5list.comments.push(comment);
            store.updateList(top5list._id,top5list);
            setComment(event.target.value);
            event.target.value = "";
        }
    }


    
    let items = top5list.items;
    let itemCards =
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

    if(top5list.community){
        let items = top5list.communityScore;
        itemCards =
        <div style={{
            backgroundColor: "#2c2f70",
            borderRadius: "10px",
            marginLeft: "3%"
        }}>
            <Typography variant="h3" color = "#c8a53b">1. {Object.keys(items)[0]}</Typography>
            <Typography ml = "6%" variant="h7" color = "#c8a53b"> ({items[Object.keys(items)[0]]} votes) </Typography>

            <Typography variant="h3" color = "#c8a53b">2. {Object.keys(items)[1]}</Typography>
            <Typography ml = "6%" variant="h7" color = "#c8a53b"> ({items[Object.keys(items)[1]]} votes) </Typography>

            <Typography variant="h3" color = "#c8a53b">3. {Object.keys(items)[2]}</Typography>
            <Typography ml = "6%" variant="h7" color = "#c8a53b"> ({items[Object.keys(items)[2]]} votes) </Typography>

            <Typography variant="h3" color = "#c8a53b">4. {Object.keys(items)[3]}</Typography>
            <Typography ml = "6%" variant="h7" color = "#c8a53b"> ({items[Object.keys(items)[3]]} votes) </Typography>

            <Typography variant="h3" color = "#c8a53b">5. {Object.keys(items)[4]}</Typography>
            <Typography ml = "6%" variant="h7" color = "#c8a53b"> ({items[Object.keys(items)[4]]} votes) </Typography>
        </div>
    }
    


    let comments = "";
    if(top5list.published){
        let listComments = top5list.comments
        comments =
            <Box sx = {{mr: "2%"}}>
                    {
                        listComments.map((c, index) => {
                            
                            return(
                                <Box  id={"comment" + index} sx = {{backgroundColor: "#c8a53b", borderRadius: 2, border: 1, mb: "2%"}}>
                                    <Typography variant="h7" sx = {{ml: "1%", color: "blue", textDecoration: "underline"}}> {c.user} </Typography>
                                    <Typography variant="h6" ml = "1%"> {c.comment} </Typography>
                                </ Box>
                            );
                            
                        })
                        
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

    let dateInfo = "";
    if(top5list.community){
        dateInfo = 
            <div>
                <Typography display="inline" sx={{ ml: "0.6vw"}}> Updated: </Typography>
                <Typography display="inline"sx={{mr: "53vw", textDecoration: 'underline', color: 'green' }}>{top5list.updatedAt.substring(0,10)}</Typography>
            </div>
    } else if(top5list.published){
        dateInfo = 
            <div>
                <Typography display="inline" sx={{ ml: "0.6vw"}}> Published: </Typography>
                <Typography display="inline"sx={{mr: "53vw", textDecoration: 'underline', color: 'green' }}>{top5list.publishDate.substring(0,10)}</Typography>
            </div>
    } else {
        dateInfo = 
            <Button size="small" color="error" sx={{ mr: "50vw" }} onClick={(event) => {handleEditList(event, top5list._id)}} >
                Edit
            </Button>
    }

    let listUser = "";
    let listUser2 = "";
    if(!top5list.community){
        listUser = 
                <Typography ml = "1.2vw" display="inline"> By: </Typography>
        listUser2 =
                <Typography  display="inline" style={{ textDecoration: 'underline', color: 'blue' }}>
                    {top5list.user}
                </Typography>;
    }

    return (
        <Card style={{ backgroundColor: top5list.published ? "#d4d4f5" : "#fffff1", borderRadius: "10px", marginBottom: "10px", border: "1px solid"}} >
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

                {top5list.published ? 
                <IconButton disabled={!auth.user} onClick={() =>handleLike()}>
                    {thumbsUp}
                </IconButton>
                : "" }
                
                {top5list.published ?
                <Typography sx={{ mr: "3vw" }}> {top5list.likes.length} </Typography>
                : "" }

                {top5list.published ?
                <IconButton disabled={!auth.user} onClick={() => handleDislike()}>
                    {thumbsDown}
                </IconButton>
                : "" }


                {top5list.published ?
                <Typography sx={{ mr: "3vw" }}> {top5list.dislikes.length} </Typography>
                : "" }

                <IconButton disabled={!auth.user ||(auth.user.userName !== top5list.user)} onClick={(event) => {
                    if(!open)
                        handleDeleteList(event, top5list._id)
                    }}>
                    <DeleteForeverOutlinedIcon fontSize="large"/>
                </IconButton>
            </div>
            

            {listUser}
            {listUser2}

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
                        <div id="comment-div" style={{
                            height: "14em",
                            overflowY: "scroll"
                        }}>
                            {comments}
                        </div>

                        {top5list.published ?
                        <div style = {{backgroundColor: "white" , borderRadius: "8px", marginRight: "3%"}}>
                            <TextField disabled={!auth.user} id="outlined-basic" label="Add Comment" variant="outlined" fullWidth onKeyDown={handleKeyPress} />
                        </div>
                        :
                        ""}

                    </Grid>
                </Grid>
                
            </Collapse>

            <CardActions>
                {dateInfo}
                
                {top5list.published ?
                    <Typography>
                        Views: 
                    </Typography>
                    
                : 
                <Typography style={{ flex: 1 }}></Typography>}

                {top5list.published ?
                    <Typography style={{ flex: 1 , color: "red"}}>
                        {top5list.views}
                    </Typography>
                : 
                <Typography style={{ flex: 1 }}>
                    
                </Typography> }

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