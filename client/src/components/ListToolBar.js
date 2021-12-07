import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';
import SortIcon from '@mui/icons-material/Sort';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import FunctionsSharpIcon from '@mui/icons-material/FunctionsSharp';
import { useHistory, useLocation } from 'react-router-dom'
import { GlobalStoreContext } from '../store'
import React, { useContext } from 'react'
import AuthContext from '../auth'

const style = {
  background : '#2E3B55'
};

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(0),
    width: '40vw',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40vw',
    },
  },
}));

export default function ListToolBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const history = useHistory();
  const location = useLocation();
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const disableBar = location.pathname !== "/home" && location.pathname !== "/all" && location.pathname !== "/user" && location.pathname !== "/community";

  const handleSortMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSortViews = () => {
    store.sortLists("views");
    setAnchorEl(null);
  };

  const handleSortLikes = () => {
    store.sortLists("likes");
    setAnchorEl(null);
  };

  const handleSortDislikes = () => {
    store.sortLists("dislikes");
    setAnchorEl(null);
  };

  const handleSortDateAsc = () => {
    store.sortLists("dateAsc");
    setAnchorEl(null);
  };

  const handleSortDateDsc = () => {
    store.sortLists("dateDsc");
    setAnchorEl(null);
  };

  const handleHome = () => {
    history.push("/home");
  }

  const handleAllLists = () => {
    history.push("/all");
  }

  const handleUserLists = () => {
    history.push("/user");
  }

  const handleCommunityLists = () => {
    history.push("/community");
  }

  const handleKeyPress = (event) => {
    if(event.keyCode == 13){
        let searchBy = event.target.value;
  
        if(location.pathname === "/home"){
          if(searchBy)
            store.loadUserListsByName(searchBy);
          else
            store.loadIdNamePairs();
        }

        if(location.pathname === "/all"){
          if(searchBy)
            store.loadListsByName(searchBy);
          else
            store.loadAllLists();
        }

        if(location.pathname === "/user"){
          if(searchBy)
            store.loadListsByUser(searchBy);
          else
            store.clearTop5Lists();
        }

        if(location.pathname === "/community"){
          if(searchBy)
            store.loadCommunityListsByName(searchBy);
          else
            store.loadAllCommunityLists();
        }
    }
}

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleSortDateDsc}>Publish Date (Newest)</MenuItem>
      <MenuItem onClick={handleSortDateAsc}>Publish Date (Oldest)</MenuItem>
      <MenuItem onClick={handleSortViews}>Views</MenuItem>
      <MenuItem onClick={handleSortLikes}>Likes</MenuItem>
      <MenuItem onClick={handleSortDislikes}>Dislikes</MenuItem>
    </Menu>
  );

  return (
    <Box  sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ background: 'transparent', color: "black", boxShadow: 'none', }}>
        <Toolbar>
          <IconButton
            disabled = {!auth.user || disableBar}
            size="large"
            edge="start"
            color="inherit"
            aria-label="Home Lists"
            sx={{ mr: 2 }}
            onClick={handleHome}
          >
            <HomeOutlinedIcon />
          </IconButton>
          <IconButton
            disabled = {disableBar}
            size="large"
            edge="start"
            color="inherit"
            aria-label="All Lists"
            sx={{ mr: 2 }}
            onClick={handleAllLists}
          >
            <PeopleAltOutlinedIcon />
          </IconButton>
          <IconButton
            disabled = {disableBar}
            size="large"
            edge="start"
            color="inherit"
            aria-label="User Lists"
            sx={{ mr: 2 }}
            onClick={handleUserLists}
          >
            <PersonOutlineOutlinedIcon />
          </IconButton>

          <IconButton
            disabled = {disableBar}
            size="large"
            edge="start"
            color="inherit"
            aria-label="Community Lists"
            sx={{ mr: 2 }}
            onClick={handleCommunityLists}
          >
            <FunctionsSharpIcon />
          </IconButton>
          
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              disabled = {disableBar}
              onKeyDown={handleKeyPress}
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="h6" component="div">
            Sort By
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              disabled = {disableBar}
              size="large"
              edge="end"
              aria-label="sort options"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleSortMenuOpen}
              color="inherit"
            >
              <SortIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-haspopup="true"
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </Box>
  );
}