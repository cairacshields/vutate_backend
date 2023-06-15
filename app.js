//region setup
import admin from "firebase-admin";
import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { getDatabase, ref as refTwo, set, child, push, update, onValue, off } from "firebase/database";
import { getMessaging, getToken } from "firebase/messaging";
import {v2} from '@google-cloud/translate';
import textToSpeech from '@google-cloud/text-to-speech';
import util from 'util';
import url from 'url';
//import ffmpeg from 'ffmpeg';
import express  from 'express';
import ngrok from 'ngrok';
import axios from "axios";
import ffmpegStatic from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
var command = ffmpeg();
const projectId = 'dubbme-34e04';
const translate = new v2.Translate({projectId});
const txtToSpeechClient = new textToSpeech.TextToSpeechClient();
var app = express();
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import request from 'request';
import path from "path";
import { readFileSync } from "node:fs";
import { Configuration as PlaidConfiguration, PlaidApi, PlaidEnvironments } from 'plaid';
const plaidConfig = new PlaidConfiguration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': "64077700b64f4d0013e9feb1",
      'PLAID-SECRET': "0e3e8620f62289a635c941fbe9361e",
    },
  },
});
const plaidClient = new PlaidApi(plaidConfig);

import client from 'https';    
import download from 'image-downloader';
import im from 'imagemagick';
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

// Tell fluent-ffmpeg where it can find FFmpeg
ffmpeg.setFfmpegPath(ffmpegStatic);

const assembly = axios.create({
    baseURL: "https://api.assemblyai.com/v2",
    headers: {
        authorization: "9374d668a2f94bc7937a2c653b01ad00",
    },
});

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// await ngrok.disconnect(); // stops all
// await ngrok.kill(); //

// // relocate the config file too:
// await ngrok.upgradeConfig({ relocate: true });

	(async function() {
	  const url = await ngrok.connect({
	  	authToken: '2RA2rqqyqLiy5RaOdBGKqTGPHnE_39QP9Vvu7iv7wuN6YQatg',
	  	subdomain: 'api.vutuate',
	  	//hostname: 'api.vutuate.ngrok.io',
	  	addr: 3000,
	  	onStatusChange: status => {
	  		console.log(`🐛 Ngrok onStatusChange() -> ${status}`)
	  	}, // 'closed' - connection is lost, 'connected' - reconnected
  		onLogEvent: data => {
  			console.log(`🦀 Ngrok onLogEvent() -> ${data}`)
  		}, 
	  });
	  console.log("NGROK URL --> " + url);
	})();


const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

//endregion

//region Firebase 
const firebaseConfig = {
  apiKey: "AIzaSyCLSJrAmULqisFwgdq1bv73TelTIlXvQgE",
  authDomain: "bobbi-687a0.firebaseapp.com",
  databaseURL: "https://bobbi-687a0-default-rtdb.firebaseio.com",
  projectId: "bobbi-687a0",
  storageBucket: "bobbi-687a0.appspot.com",
  messagingSenderId: "952788294332",
  appId: "1:952788294332:android:68f05de757d537d60d4eb9"
};
import serviceAccount from "/Users/cairashields/Downloads/bobbi-687a0-firebase-adminsdk-3blw2-1666c876b5.json" assert { type: "json" };

const firebaseApp = initializeApp(firebaseConfig);
var bobbiStorageApp = getStorage(firebaseApp);
const bobbiDatabase = getDatabase(firebaseApp);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bobbi-687a0-default-rtdb.firebaseio.com"
});
//const messaging = getMessaging(firebaseApp);


// This registration token comes from the client FCM SDKs.
const registrationToken = 'eL06p-DQYEdgtwSKnD8MrX:APA91bEHoI6Orhh1Z7A22_S3LBKm-tMqacnzHLcx9eIasAfXf-KDX_RslmFWc5fZVi5H3yY1Xd64eJxO5wV0HCpxog0lfGRM3bF-N5Z7BwUwa1HIIeBzJJ_0aF9v0-6EyjPT6qXwkCpT';

const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
  };

const message = {
  data: {
    score: '850',
    time: '2:45'
  },
  token: registrationToken
};

// Send a message to the device corresponding to the provided
// registration token.
admin.messaging().send(message)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });
//endregion 


//region requests 

app.post('/firebase/notification', (req, res) =>{
    const registrationToken = req.body.registrationToken
    const message = req.body.message
    const options =  notification_options
    
      admin.messaging().sendToDevice(registrationToken, message, options)
      .then( response => {

       res.status(200).send("Notification sent successfully")
       
      })
      .catch( error => {
          console.log(error);
      });

});


app.get('/', async (req, res) => {
	console.log("welcome to the server which owns the entire world 🌐");
	res.status(200).send('<h1>Successful Response goes here... </h1>');
});

app.get('/processVideo/:projectId/:vidId/:uuid', async (req, res) => {
	// Reading video ID from the URL
		const projectId = req.params.projectId;
    const vidId = req.params.vidId;
    const uuid = req.params.uuid;
    const downloadLocation = `allProjects/${uuid}/${projectId}/originalVideo/${vidId}`;

	// await getDownloadURL(ref(dubbMeStorageApp, downloadLocation))
	// .then( async ( downloadUrl ) => {
	// 	console.log("Got the download url for the video --> " + downloadUrl);

	// 	await queueTranscription(downloadUrl, vidId, projectId, uuid);

	// 	//TODO --> Also begin removing the original audio from the video 
	// 	await removeOGVideoAudio(downloadUrl, vidId, projectId, uuid);

	// 	res.status(200).send({});
	// }).catch(err => console.log("ERROR! Getting the Download URL from firebaseStorage ref => " + err.message));

});

app.post('/collarLocations', async (req, res) => {
	const data = req.body;
	const product = data["product"];
	//UNIX Epoch time
	const when = data["when"];
	const body = data["body"];
	const temperature = body["temperature"];
	const lat = data["best_lat"];
	const lon = data["best_lon"];
	const bestLocation = data["best_location"];
	const bestTimezone = data["best_timezone"];

	console.log(`📍 Received a POST request from Notecard! ${JSON.stringify(data)}`);

	const resourceRef = refTwo(bobbiDatabase, `collars/`);

	//We need to find the targeted collar based on the productId
	onValue(resourceRef, async (snapshot) => {
		off(resourceRef, 'value');
	  const data = snapshot.val();
		console.log(`✨ Final Step! Got some data => ${JSON.stringify(data)}`);

		snapshot.forEach(async function(childSnapshot) {
      // key will be "ada" the first time and "alan" the second time
	     var key = childSnapshot.key;
	     // childData will be the actual contents of the child
	     var childData = childSnapshot.val();
	     if (childData["deviceId"] == product) {
	  		//we found our culprit! 

	  		await update(refTwo(bobbiDatabase, `collars/${childData["id"]}/`), {
			    mostRecentLat: lat,
			    mostRecentLon: lon,
			    lastLocationUpdate: when,
			    temperature: temperature
			  });

			await push(refTwo(bobbiDatabase, `collars/${childData["id"]}/todaysLocationUpdates/`), {
			    latitute: lat,
			    longitude: lon,
			    time: when,
			  });

	  	}
	  });	

	}); 

	res.status(200).send();
});

app.post('/collarMotion', async (req, res) => {
	const data = req.body;
	const product = data["product"];
	//UNIX Epoch time
	const when = data["when"];
	const towerWhen = data["tower_when"];
	const body = data["body"];
	const walking = body["walking"];
	const running = body["running"];
	const resting = body["resting"];
	const x = body["x"];
	const y = body["y"];
	const z = body["z"];

	var timeStamp = when;
	if (timeStamp == null || timeStamp == undefined) {
		timeStamp = towerWhen;
	}


	console.log(`🚶‍♂️ Received a POST request from Notecard! ${JSON.stringify(data)}`);

	const resourceRef = refTwo(bobbiDatabase, `collars/`);

	onValue(resourceRef, async (snapshot) => {
			off(resourceRef, 'value');
		  const data = snapshot.val();
			console.log(`✨ Final Step! Got some data => ${JSON.stringify(data)}`);

			snapshot.forEach(async function(childSnapshot) {
	      // key will be "ada" the first time and "alan" the second time
		     var key = childSnapshot.key;
		     // childData will be the actual contents of the child
		     var childData = childSnapshot.val();
		     if (childData["deviceId"] == product) {
		  		//we found our culprit! 

				await push(refTwo(bobbiDatabase, `collars/${childData["id"]}/todaysMotionUpdates/`), {
				    walking: walking,
				    running: running,
				    resting:resting,
				    time: timeStamp,
				    x: x,
				    y: y,
				    z: z
				  });

		  	}
		  });	

	}); 

	res.status(200).send();
});

//endregion

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function between(min, max) {  
  return Math.floor(
    Math.random() * (max - min) + min
  )
}


//endregion 
export { app };
