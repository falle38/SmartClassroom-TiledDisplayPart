/**
 * Real Time Video Sharing built on nowJS and Node.JS
 * Author: fyhao
 */

// include utility library
var util = require('./util.js');

// include ExpressJS framework
var express = require('express');

var ffmpeg = require('fluent-ffmpeg');

// create a server from the express
var app = express.createServer(express.logger());

// serve static content in /static directory
app.use("/static", express.static(__dirname + "/static"));
app.use("/includes", express.static(__dirname + "/views/includes"));
app.use("/js", express.static(__dirname + "/views/js"));
app.use("/css", express.static(__dirname + "/views/css"));
app.use("/fonts", express.static(__dirname + "/views/fonts"));
app.use("/flowplayer", express.static(__dirname + "/views/flowplayer"));


var clientAudioStreamList = [];

// handle main page, the client page
app.get("/", function(req, res) {
    res.contentType("text/html");
    res.send(util.template('index3'));
});

// handle host page, the page to do the main control
app.get("/host", function(req, res) {
    res.contentType("text/html");
    res.send(util.template('host'));
});

app.get("/audio0", function (req, res) {
    console.log("AUDIO_GET");
    clientAudioStreamList.push(res);
});

app.get("/audio1", function (req, res) {
    console.log("AUDIO_GET");
    clientAudioStreamList.push(res);
});

// make this process listen to port 80 or 8080
app.listen(process.env.PORT || 8080);

// include nowJS framework handler
var nowjs = require('now');

// initialize nowJS into everyone object
var everyone = nowjs.initialize(app);

// to create a unique key for each registered session name
var key = 0;

// to store each registered session name
var clientList = new Object();

var hosts = new Object();

var orientation = new Object();
orientation["NW"] = false;
orientation["NE"] = false;
orientation["SW"] = false;
orientation["SE"] = false;

var nbWindow = 0;



// trigger when each client user connect to nowjs
nowjs.on('connect', function () {
    
	
    // for each client user, check if there has already associated name
    if(!this.now.name) {
	
        var b = false;
        for (var o in orientation){
            if(!orientation[o]){
                orientation[o] = this;
                this.now.name = 'name' + key;
                this.now.id = key;
                var client = {"id":this.now.id, "object":this, "orientation":o};
                clientList[this.now.id] = client;
                this.now.callbackConnected(client);
                // generate a name for this new client user
		
                key++;
                b= true;
				break;
            }
        }	
        if(!b){
            everyone.removeUser(this.user.clientId);
        }

        //if (key == 2) {
        //    everyone.now.playAudio();
        //}
    }
	

});

// trigger when each client user disconnect from nowjs
nowjs.on('disconnect', function() {
    if(this.now.id){
        orientation[clientList[this.now.id].orientation] = false;
        delete clientList[this.now.id];
    }
});

everyone.now.getWindowId = function (type, url) {
    this.now.launchWindow(nbWindow, type, url);
    nbWindow++;
};


// called from client - just execute one client context (host)
everyone.now.askRemoteMediaControl = function (windowId, mediaType, controlType, value, isForEveryone) {
    if (isForEveryone) {
        everyone.now.filterRemoteMediaControl(windowId, mediaType, controlType, value, this.now.id);
    }
    else {
        clientList[hosts[windowId].client].object.now.remoteMediaControl(windowId, mediaType, controlType, value);
    }
};

// called from server - execute every client context, then we can do filtering
everyone.now.filterRemoteMediaControl = function (windowId, mediaType, controlType, value, clientId) {
    // by right, it will execute in every client context include host page, we need to filter out the host by delete its name
    if (this.now.id == clientId) {return;}
    // ok, now we call the client side update image method, to update the screen into HTML5 canvas
    this.now.remoteMediaControl(windowId, mediaType, controlType, value);
};


// called from client - just execute one client context (host)
everyone.now.askTiledDisplay = function (windowId, type, title, isPlayingAudio, data) {
    var client = this;
    var shareMedia = nowjs.getGroup("shareMedia" + windowId);
   // shareMedia.addUser(this.user.clientId);
    countCallback = function (nb) {
        var host = { "client": client.now.id,"group": shareMedia ,"nbCurrent": 0, "nbExpected": nb, "isPlayingAudio": isPlayingAudio , "nbReadyAudio": 0, "nbReadyAudioExpected": nb }
        hosts[windowId] = host;
        everyone.now.filterAskTiledDisplay(windowId, type, title, data);
    };
    everyone.count(countCallback);
   
    this.now.ReadyToReceiveVideo(windowId, type);
    //var host = { "client": this.now.id, "nbCurrent": 0, "nbExpected": 1,"isPlayingAudio":isPlayingAudio ,"nbReadyAudio": 0, "nbReadyAudioExpected": 2 }
    //hosts[windowId] = host;
    //everyone.now.filterAskTiledDisplay(windowId, title, data);
};




// called from server - execute every client context, then we can do filtering
everyone.now.filterAskTiledDisplay = function (windowId, type, title, data) {
    // by right, it will execute in every client context include host page, we need to filter out the host by delete its name
    if (this.now.id == hosts[windowId].client){ return; console.log("HOST NOT READY");}
    // ok, now we call the client side update image method, to update the screen into HTML5 canvas
    this.now.launchTiledDisplay(windowId, type, title, data);
};

// called from client - just execute one client context (host)
everyone.now.shareData = function (windowId, data) {
    // update the data to the other clients other than host
    hosts[windowId].group.now.filterShareData(windowId, data, this.now.id);
};

// called from client - just execute one client context (host)
everyone.now.filterShareData = function (windowId, data, hostId) {
    // update the data to the other clients other than host
    if (this.now.id == hostId) return;
    this.now.updateData(windowId, data);

};


everyone.now.ReadyToReceiveVideo = function (windowId, type) {
    hosts[windowId].nbCurrent++;
    hosts[windowId].group.addUser(this.user.clientId)
    console.log(hosts[windowId].nbCurrent);

    if (hosts[windowId].nbCurrent == hosts[windowId].nbExpected) {
        if (type == "video") {
            clientList[hosts[windowId].client].object.now.broadcastVideo(windowId, hosts[windowId].isPlayingAudio);
        }
    }  
};

everyone.now.ReadyToPlayAudio = function (windowId) {
    hosts[windowId].nbReadyAudio++;
    if (hosts[windowId].nbReadyAudio == hosts[windowId].nbReadyAudioExpected) {
        //Play Video only if clients are ready to play audio
        everyone.now.playAudio();
        clientList[hosts[windowId].client].object.now.playVideo();
        
    }
};

// called from client - just execute one client context (host)
everyone.now.shareImage = function (windowId, image) {
    // update the data to the other clients other than host
    hosts[windowId].group.now.updateCanvas(windowId, image);
};

// called from client - just execute one client context (host)
everyone.now.askSwitchToTiledDisplay = function (windowId) {
    // update the data to the other clients other than host
    hosts[windowId].group.now.switchToTiledDisplay(windowId);
};

// called from client - just execute one client context (host)
everyone.now.askSwitchToNormalDisplay = function (windowId) {
    // update the data to the other clients other than host
    hosts[windowId].group.now.switchToNormalDisplay(windowId);
};

sendAudioDataToStreamList = function (data) {
    for (var i in clientAudioStreamList) {
        clientAudioStreamList[i].write(data);
    }
}

// called from client - just execute one client context (host)
everyone.now.shareWindowPosition = function (windowId, orientation, top, left) {
    // update the data to the other clients other than host
    everyone.now.filterShareWindowPosition(windowId, orientation, top, left, this.now.id);
};

// called from client - just execute one client context (host)
everyone.now.filterShareWindowPosition = function (windowId, orientation, top, left, hostId) {
    // update the data to the other clients other than host
    if (this.now.id == hostId) return;
    this.now.updateWindowPosition(windowId, orientation, top, left);

};



// called from client - just execute one client context (host)
everyone.now.shareWindow = function (windowId, title, type) {
    // update the data to the other clients other than host
    everyone.now.filterShareWindow(windowId, title, type, this.now.id);
};

// called from client - just execute one client context (host)
everyone.now.filterShareWindow = function (windowId, title, type, hostId) {
    // update the data to the other clients other than host
    if (this.now.id == hostId) return;
    this.now.createSharedWindow(windowId, title, type);

};



sendAudioDataToStreamList = function (data) {
    for (var i in clientAudioStreamList) {
        clientAudioStreamList[i].write(data);
    }
}

everyone.now.streamAudioToClient = function(videoPath){
    var proc = ffmpeg(videoPath)
   .setFfmpegPath("C:\\dev\\ffmpeg-win64-shared\\bin\\ffmpeg.exe")
   .setFfprobePath("C:\\dev\\ffmpeg-win64-shared\\bin\\ffprobe.exe")
   .setFlvtoolPath("C:\\dev\\flvtool2\\flvtool2.exe")
   // use the 'flashvideo' preset (located in /lib/presets/flashvideo.js)
   .preset('flashvideo')
   // setup event handlers
    .format('flv')
    .noVideo()
   .on('end', function () {
       console.log('file has been converted succesfully');
   })
   .on('error', function (err) {
       console.log('an error happened: ' + err.message);
   })
    // save to stream
   .pipe({ end: true }).on('data', function (chunk) {
       //console.log("DATA_AUDIO");
       sendAudioDataToStreamList(chunk);
   });
}