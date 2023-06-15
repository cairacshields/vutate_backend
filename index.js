/**
 * 
 * 
 * Server for Vutate program. 
 * Fun image manipulation. 
 * For a price of course 🤣
 * 
 * **/

import http from 'http';
import {app} from './app.js';


app.set('port', 3000);
const server = http.createServer(app);

app.listen(3000, () => {
  console.log(`Listening on port 3000`);
});

server.listen(4000);