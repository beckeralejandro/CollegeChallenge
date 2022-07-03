import React, { useEffect } from 'react';

import Head from 'next/head'

import styles from '/styles/Home.module.css'
import { Container, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ListItem from '@mui/material/ListItem';
import ListOrders  from '../components/ListOrders';
import Button from '@mui/material/Button';
import { style } from '@mui/system';

export default function Home() {
  const today = new Date();

  const [student, setStudent] = React.useState(null)

  useEffect(()=>{
    GetStudent(setStudent);
  }, []);
  
  const [studentOrders, setStudentOrders] = React.useState([])

  function initOrders(data){
    let init = data.map((order) => ({...order, checked: false, enabled: false}));
    
    const ordersNotPaid = data.filter(obj => {
      return obj.status != 'PAID';
    });
    
    setStudentOrders(
      init.map(order => {
        if (ordersNotPaid.length > 0 && order.id === ordersNotPaid[0].id)
          order.enable = true
        
        return order;
      })        
    )
  }

  useEffect(()=>{
    GetStudentOrders(initOrders);
  }, []);

  const totalPaying = studentOrders.reduce(function(prevVal, curVal, index, array){
    if (curVal.checked){
      let interest = 0;
      if (curVal.interest)
        interest = parseFloat(curVal.interest);

      return prevVal + parseFloat(curVal.price) + interest;
    }
    else
      return prevVal;
  }, 0);

  const ordersPaid = studentOrders.filter(obj => {
    return obj.status == 'PAID';
  });

  const ordersToPay = studentOrders.filter(obj => {
    const date = new Date(obj.due);
    
    return obj.status != 'PAID' && date < today;
  });

  const ordersFuture = studentOrders.filter(obj => {
    const date = new Date(obj.due);
    
    return obj.status != 'PAID' && date > today;
  });

  const [ sharedOrders, setSharedOrders ] = React.useState({});

  useEffect(() => {
    if (sharedOrders.id){      
      setStudentOrders(prevState => {

        let pos = 0;
        let posChecked = 0;
        let enableNextChecked = false;
        let list = prevState.map(order => {
          if (enableNextChecked){
            order.enable = true;
            enableNextChecked = false;
          }
          if (order.id === sharedOrders.id){
            order.checked = sharedOrders.checked
            enableNextChecked = true;
            posChecked = pos;
          }
          
          pos++;
          return order;
        });
        
        if (!sharedOrders.checked){
          pos = 0;
          list = prevState.map(order => {
              if(pos >= posChecked){
                order.checked = false;
                if(pos > posChecked)
                  order.enable = false;
              }

            pos++;
            return order;
          });
        }

        return list;
        }
      )
    }
  }, [sharedOrders]);

  return (
    (student && studentOrders &&
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <header>
        <Paper elevation={3} style={{position: 'fixed', width: '100%', zIndex: '99999999'}}>
          <Box className={styles.title}>
            <ListItem alignItems='center' sx={{ justifyContent: 'center' }}>
              <Avatar sx={{ mr: '5px' }}>{student.school.name.charAt(0).toUpperCase()}</Avatar> Colegio {student.school.name}
            </ListItem>
            
          </Box>
        </Paper>
      </header> 

      <Box className={styles.main}>
        <Box mb={1} mr={2} ml={2} sx={{marginTop: '60px'}}>
          <Container maxWidth="sm" className={styles.container}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                {student.first_name} {student.last_name}
              </Grid>
              <Grid item xs={6} sx={{textAlign: 'right'}}>
                {student.cohort}
              </Grid>
              <Grid item xs={6}>
                Total a Pagar
              </Grid>
              <Grid item xs={6} sx={{textAlign: 'right'}}>
                ${totalPaying.toFixed(2)}
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Box mb={1}>
          <Container maxWidth="sm" className={styles.containerCuotas}>
            <Accordion sx={{ boxShadow: "none" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                
                <Typography>
                    Cuotas pagadas<br/>
                    <Typography variant="overline">
                      Dale click para expandir
                    </Typography>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ListOrders orders={ordersPaid} setSharedOrders={setSharedOrders}  />
              </AccordionDetails>
            </Accordion>
          </Container>
        </Box>

        <Box mb={1}>
          <Container maxWidth="sm" className={styles.containerCuotas}>
            <Accordion sx={{ boxShadow: "none" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>
                    Cuotas pendientes<br/>
                    <Typography variant="overline">
                      Dale click para expandir
                    </Typography>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ListOrders orders={ordersToPay} setSharedOrders={setSharedOrders} />
              </AccordionDetails>
            </Accordion>
          </Container>
        </Box>

        <Box>
          <Container maxWidth="sm" className={styles.containerCuotas}>
            <Accordion sx={{ boxShadow: "none" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                
                <Typography>
                    Cuotas futuras<br/>
                    <Typography variant="overline">
                      Dale click para expandir
                    </Typography>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ListOrders orders={ordersFuture} setSharedOrders={setSharedOrders} />
              </AccordionDetails>
            </Accordion>
          </Container>
        </Box>
      </Box>
      
      {(totalPaying > 0 &&
        <Button className={styles.buttonPay} size="large" variant="contained">IR A PAGAR </Button>
      )}
    </>)
  );

  async function GetStudent(setState) {
    const header = {'hash': 'OcJn4jYChW'};
    const url = 'http://ec2-3-239-221-74.compute-1.amazonaws.com:8000/api/v1/students/3b35fb50-3d5e-41b3-96d6-c5566141fab0/';

    await GetApi(url, header, setState);
  }

  async function GetStudentOrders(setState) {
    const header = {'hash': 'OcJn4jYChW'};
    const url = 'http://ec2-3-239-221-74.compute-1.amazonaws.com:8000/api/v1/students/3b35fb50-3d5e-41b3-96d6-c5566141fab0/orders/';

    await GetApi(url, header, setState);
  }

  async function GetApi(url, header, setState){
      const request = await fetch(url, {
        method: 'GET',
        headers: header,
      });
      const data = await request.json()
      
      setState(data)
  }
}