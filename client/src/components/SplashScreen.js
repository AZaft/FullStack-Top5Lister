import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { useHistory } from 'react-router-dom'
export default function SplashScreen() {
    const history = useHistory();
    const ColorButton = styled(Button)(({ theme }) => ({
        
        backgroundColor: "#d4d4f5",
        '&:hover': {
          backgroundColor: "#c8c8f5",
        },
      }));

    const handleCreateAcccount = () => {
        history.push("/register");
    };

    const handleLogin = () => {
        history.push("/login");
    };

    const handleGuest = () => {
        
    };
    
    return (
        <div id="splash-screen">
                <Typography variant="h1" component="h2">
                    Welome to the Top 5 Lister
                </Typography>
                <br/>
                <br/>
                <Typography variant="h5" component="h2" align = "center">
                    Select an option below to start viewing community and user lists now. <br/>
                    Create an account or login to make and publish your own, as well as to <br/>comment on, like, and dislike other lists!
                </Typography>
                <br/>
                <br/>
                <br/>
                <Box sx={{ '& button': { marginRight: 10, marginLeft: 10}}}>
                    <ColorButton onClick={handleCreateAcccount} variant="contained" size= "large">Create Account</ColorButton>
                    <ColorButton onClick={handleLogin} variant="contained" size= "large">Login</ColorButton>
                    <ColorButton onClick={handleGuest} variant="contained" size= "large">Continue as Guest</ColorButton>
                </Box>
        </div>
    )
}