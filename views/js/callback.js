$(document).ready(function () {

    var infos;
    var event = new Event('draw');
    var event1 = new Event('closeMenu');
    var audioplayer;
    var menu;
    callbackConnected = function (data) {
        infos = data;
        initializeEventListener();
        //initialize audio link for flowplayer
        initializeAudioLink(infos.id);
        menu = new mlPushMenu(document.getElementById('mp-menu'), document.getElementById('trigger'));

        audioplayer = flowplayer("audioPlayer", "/includes/flowplayer.swf", {
            width: 0,
            heigth: 0,
            clip: {
                // baseUrl for both parent and instream clips
                url: "/audio" + infos.id,
                autoBuffering: true,
                autoPlay: false,
                onBegin: function () {
                    audioplayer.toggle();
                    audioplayer.toggle();
                    console.log("META");

                    ReadyToPlayAudio(0);

                }
            }
        });


        console.log(infos);
    }


    setAudioPlayer = function (player) {
        audioplayer = player;
    }

    launchVideoNormalDisplay = function (windowId) {
        menu.trigger.dispatchEvent(event1);
        //initializeAudioplayer(now.id, windowId);
        console.log("PLAYING NORMAL");

        //var canvas = document.createElement("canvas");
        // get HTML5 video handler
        var video = document.getElementById("video");

      //  canvas.width = video.videoWidth;
        //canvas.height = video.videoHeight;
        //$(canvas).css("display", "none");
        var videoPlayed = false;

        // trigger when the video is played
        video.addEventListener("play", function () {
            console.log("DRAW");
            videoPlayed = true;
            // re adjust the canvas width and height based on the video's one...
            var w = video.videoWidth;
            var h = video.videoHeight;
            draw(this, w, h);
        }, false);

        // trigger when the video is paused
        video.addEventListener("pause", function () {
            // mark this video is in not playing mode
            videoPlayed = false;
        }, false);

        // draw the video into HTML5 canvas
        var draw = function (v, w, h) {
            var window = getWindow(windowId);
            var canvasToDraw = window.getElementsByClassName('window-form')[0].getElementsByTagName("canvas")[0];
            var drawContext = canvasToDraw.getContext('2d');

            //var ctx = canvas.getContext('2d');

            // if the video is not in playing, we not draw the screen
            if (!videoPlayed) return;
            // re initialize the backing canvas
            //ctx.clearRect(0, 0, w, h);
            // ctx.drawImage(v, 0, 0, w, h);
            var canvas = document.getElementbyId("canvas");
            canvas.width = w;
            canvas.height = h;
            var context = canvas.getContext('2d');
            //context.drawImage(v, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
            drawContext.drawImage(v, 0, 0, canvasToDraw.width, canvasToDraw.height);
            canvasToDraw.dispatchEvent(event);
            setTimeout(draw, 16, v, w, h);
        };        
    }

    broadcastVideo = function (windowId, isPlayingAudio) {
        //initializeAudioplayer(now.id, windowId);
        console.log("READY");
        var canvas = document.createElement("canvas");
        var context = canvas.getContext('2d');
        // get HTML5 video handler
        var video = document.getElementById("video");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        $(canvas).css("display", "none");
        var videoPlayed = false;

        // trigger when the video is played
        video.addEventListener("play", function () {
            console.log("DRAW");
            videoPlayed = true;
            // re adjust the canvas width and height based on the video's one...
            var w = video.videoWidth;
            var h = video.videoHeight;
            draw(this, context, w, h);
        }, false);

        // trigger when the video is paused
        video.addEventListener("pause", function () {
            // mark this video is in not playing mode
            videoPlayed = false;
        }, false);

        // draw the video into HTML5 canvas
        var draw = function (v, ctx, w, h) {

            // if the video is not in playing, we not draw the screen
            if (!videoPlayed) return;
            // re initialize the backing canvas
            ctx.clearRect(0, 0, w, h);
            ctx.drawImage(v, 0, 0, w, h);
            shareImage(windowId, canvas.toDataURL("image/jpeg"));
            setTimeout(draw, 40, v, ctx, w, h);
        };
        if (isPlayingAudio) {
            //streamAudioToClient("C:/Users/Adam/Desktop/RT1/static/snk.mp4");
            //Stream audio to all client and waiting for playing video
            streamAudioToClient("./static/snk.mp4");
            //streamAudioToClient(video.src);
        }
        else {
            //Play video directly if there is no audio to stream
            video.play();
        }
    }

    launchTiledDisplay = function (windowId, title) {
        console.log("LAUNCHING");
        createCanvas(windowId,title, 400, 300, "video_tiled" );
        // initializeAudioplayer(now.id, windowId);
        ReadyToReceiveVideo(windowId);
    };


    // called from server - to update the image data just for this client page
    // the data is a base64-encoded image
    updateCanvas = function (windowId, image) {


        var window = getWindow(windowId);
        var canvasToDraw = window.getElementsByClassName('window-form')[0].getElementsByTagName("canvas")[0];
        var draw = canvasToDraw.getContext('2d');

        //var canvasToCopy = document.createElement("canvas");
        //canvasToCopy.width = canvasToDraw.width;
        //canvasToCopy.height = canvasToDraw.height;
        //var copy = canvasToCopy.getContext('2d');
        
        // create a blank HTML image, put the data into the image src
        var img = new Image();
        img.src = image;

        
        // when the image loaded, draw the image on HTML5 canvas
        img.addEventListener("load", function () {
            var canvas = document.getElementById("backing_"+ canvasToDraw.id);
            canvas.width = img.width;
            canvas.height = img.height;
            var context = canvas.getContext('2d');

            var rows = 2;
            var cols = 2;
            var tileX = 0;
            var tileY = 0;
            //var tileWidth = Math.round(canvasToDraw.width / cols);
            //var tileHeight = Math.round(canvasToDraw.height / rows);
            var tileWidth = Math.round(img.width / cols);
            var tileHeight = Math.round(img.height / rows);
            var tileCenterX = tileWidth / 2;
            var tileCenterY = tileHeight / 2;

            if (infos.orientation == "NE") {
                tileX = tileX + tileWidth;
            }
            else if (infos.orientation == "SW") {
                tileY = tileY + tileHeight;
            }
            else if (infos.orientation == "SE") {
                tileX = tileX + tileWidth;
                tileY = tileY + tileHeight;
            }
            context.drawImage(img, tileX, tileY, tileWidth, tileHeight, 0, 0, img.width, img.height);
            draw.drawImage(canvas, 0, 0, canvasToDraw.width, canvasToDraw.height);
            canvasToDraw.dispatchEvent(event);

            //draw.drawImage(img, tileX, tileY, tileWidth, tileHeight, 0, 0, img.width, img.height);
            //canvasToDraw.dispatchEvent(event);
            //draw.drawImage(canvasToCopy, 0, 0);


            //copy.drawImage(img, 0, 0);
            //draw.drawImage(canvasToCopy, tileX, tileY, tileWidth, tileHeight, 0, 0, canvasToDraw.width, canvasToDraw.height);

        });
    };


    playVideo = function () {
        document.getElementById("video").play();
    };

    playAudio = function () {
        document.getElementById("audio").play();
        //audioplayer.toggle();
    };


});