import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import DeleteModal from './DeleteModal';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';



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

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
        


    async function handleDeleteList(event, id) {
        event.stopPropagation();
        setOpen(true);
        store.markListForDeletion(id);
    }


    return (
        <Card >
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

                <IconButton sx={{ mr: "3vw" }}>
                    <ThumbUpOutlinedIcon fontSize="large"/>
                </IconButton>
                <IconButton sx={{ mr: "3vw" }}>
                    <ThumbDownOutlinedIcon fontSize="large"/>
                </IconButton>

                <IconButton onClick={(event) => {
                    if(!open)
                        handleDeleteList(event, idNamePair._id)
                    }}>
                    <DeleteForeverOutlinedIcon fontSize="large"/>
                </IconButton>
            </div>
            

            <Typography ml = "1.2vw">
                By:
            </Typography>
            
            <CardActions>
                <Button size="small" color="error" sx={{ mr: "50vw" }}>
                    Edit
                </Button>
                
                

                <Typography style={{ flex: 1 }}>
                    Views: 
                </Typography>

                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"

                >   
                        <ExpandMoreIcon fontSize="large"/>
                </ExpandMore>
            </CardActions>
            
            <Collapse in={expanded} timeout="auto" unmountOnExit>
               
                    <Typography paragraph>
                        Test
                    </Typography>
               
            </Collapse>
        </Card>
    );
}

export default ListCard;