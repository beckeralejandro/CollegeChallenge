import * as React from 'react';

import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function Layout({ orders, setSharedOrders }) {    
    const handleToggle = (value) => (e) => {
        setSharedOrders({id: value, checked: e.target.checked});
    };

    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {orders.map((value) => {
                //value.checked = false;
                const labelId = `c-${value}`;
                return (
                <ListItem
                    key={value.id}
                    disablePadding
                >
                    <ListItemText 
                        primary={value.name}
                        secondary={DateParse(value.due, value.status)}
                    />
                    {(
                        value.status != 'PAID' && <>
                            <ListItemText 
                                primary={`$ ${value.price}`} 
                                secondary={(value.interest && `Interes: $ ${value.interest}`)}
                                sx={{textAlign: 'right', marginRight: '10px'}}
                            />
                            <ListItemIcon>
                                <Checkbox
                                    tabIndex={-1}
                                    edge = "end"
                                    disableRipple
                                    checked={value.checked}
                                    disabled = {!value.enable}
                                    onChange={handleToggle(value.id)}
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                        </>
                    )}

                    {(
                        value.status == 'PAID' &&
                        <ListItemIcon>
                            <ArrowForwardIosIcon />
                        </ListItemIcon>
                    )}
                    
                </ListItem>
                )
            })}
        </List>
    )
}

function DateParse(dateString, status){
    const date = new Date(dateString);
    const today = new Date();
    let venc = 'Vencido el';
    if (date > today)
        venc = 'Vence el';
    if (status == 'PAID')
        venc = 'Pagado el';

    const monthShortName = date.toLocaleDateString('mx-MX', { 
        month: 'short'
    });
    return `${venc} ${date.getDate()} de ${monthShortName}`;
}