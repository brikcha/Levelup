import React, { useState } from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { CiMenuKebab } from 'react-icons/ci';
import { AiOutlineMenuUnfold } from 'react-icons/ai';
//import InboxIcon from '@mui/icons-material/MoveToInbox';
//import MailIcon from '@mui/icons-material/Mail';

const SwipeableTemporaryDrawer = () => {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const buttonStyle = {
    color: 'white',
    background: 'transparent',
    border: 'none',
  };
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event.key === 'Tab' || event.key === 'Shift'))
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
    sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
    role="presentation"
    onClick={toggleDrawer(anchor, false)}
    onKeyDown={toggleDrawer(anchor, false)}
  >
    <List>
        <ListItem>
          <ListItemButton href='/cart' >
            <ListItemText  >Cart</ListItemText>
          </ListItemButton>
          </ListItem>

          <Divider />
          <ListItem>

          <ListItemButton href='/whishlist' >
            <ListItemText  >Wishlist</ListItemText>
          </ListItemButton>
          </ListItem>
          <Divider />

          <ListItem>

          <ListItemButton href='/vieworder' >
            <ListItemText  >View Order</ListItemText>
          </ListItemButton></ListItem>
  
    </List>
   
  </Box>
  );

  return (
    <div>
<Button color="primary" style={buttonStyle} onClick={toggleDrawer('left', true)}>
  <AiOutlineMenuUnfold style={{fontSize: "1.5rem"}}/>
</Button>
      <SwipeableDrawer
        anchor="left"
        open={state['left']}
        onClose={toggleDrawer('left', false)}
        onOpen={toggleDrawer('left', true)}
      >
        {list('left')}
      </SwipeableDrawer>
    </div>
  );
};

export default SwipeableTemporaryDrawer;