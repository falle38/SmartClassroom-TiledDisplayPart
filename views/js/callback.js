

    var infos;
    var audioplayer;
    var menu;

$(document).ready(function () {
    var event = new Event('draw');
    var eventCloseMenu = new Event('closeMenu');
    var eventEndFullscreen = new Event('endfullscreen');
    var eventTimeUpdate = new Event('dataupdate');
    var isRotating = false;
    
    //=============================================================================
    // CALLBACK WHEN CLIENT IS CONNECTED TO SERVER
    //=============================================================================
    
    callbackConnected = function (data) {
        infos = data;
        initializeEventListener();
        createFullscreenCanvas()
        //initialize audio link for flowplayer
        initializeAudioLink(infos.id);
        manageControlBar();
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
    
    //=============================================================================
    // CREATE MEDIA WINDOW : (VIDEO, PDF, APPS ETC...)
    //=============================================================================

    launchWindow = function (windowId, type, url) {
        if (type == "video-tiled") {
            loadVideoTiledDisplay(windowId, url);
        }
        else if (type == "video-normal") {
            loadVideoNormalDisplay(windowId, url)
        }
        else if (type == "pdf") {
            loadPdf(windowId, url);
        }
        else if (type == "shared") {
            loadSharedWindow(windowId);
        }
        else if (type == "ping-pong") {
            launchPingPongGame(windowId, true);
        }
        menu.trigger.dispatchEvent(eventCloseMenu);
    };

    //=============================================================================
    // SHARE AND UPDATE WINDOW DATA : (POSITION, ROTATION, CSS ETC...)
    //=============================================================================
    
    createSharedWindow = function (windowId, title, type) {
        var canvas = createCanvas(windowId, "SHARED TEST", 400, 300, "shared", false, true);
        var rows = 2;
        if (infos.position.j <= ((rows / 2) - 1)) {
            if (!windowList[canvas.id].isRotated) {
                windowRotation(windowId, 180);
            }
        }
    };
    
    // called from server - to update the image data just for this client page
    // the data is a base64-encoded image
    updateWindowPosition = function (windowId, positionRemoteClient, top, left, hostWidth, hostHeight) {
        var window = getWindow(windowId);
        if (!isRotating) {
            window.style.removeProperty('-webkit-transition');
            window.style.removeProperty('transition');
        }
        
        var width = $('div.display').width();
        var height = $('div.display').height();
        var windowWidth = $('#window' + windowId).width();
        var windowHeight = $('#window' + windowId).height();
        //Adapt the scale if the host has a different height and width of display
        //left = (left * width) / hostWidth;
        //top = (top * height) / hostHeight;
        var rows = 2;
        var i = infos.position.i;
        var j = infos.position.j;
        var x, y;
        if (positionRemoteClient.j <= ((rows / 2) - 1)) {
            //Si les tables sont de sens opposés, on adapte la position de la fenêtre
            if (j <= ((rows / 2) - 1)) {
                left = width - left;
                top = height - top;
            }
            else {
                left = (width - left) - windowWidth;
                top = (height - top) - windowHeight;
            }
        }
        x = positionRemoteClient.i * width + left;
        y = positionRemoteClient.j * height + top;
        
        
        left = x - i * width;
        top = y - j * height;

        if (j <= ((rows / 2) - 1)) {
            //Si les tables sont de sens opposés, on adapte la position de la fenêtre
            if (positionRemoteClient.j > ((rows / 2) - 1)) {
                left = (width - left) - windowWidth;
                top = (height - top) - windowHeight;
            }
            else {
                left = width - left;
                top = height - top;
            }
        }
        window.style.top = top + "px";
        window.style.left = left + "px";
        
        //If the window is on the display
        //if (left >= 0 && left <= width && top >= 0 && top <= height && (left + windowWidth) >= 0 && (left + windowWidth) <= width && (top + windowHeight) >= 0 && (top + windowHeight) <= height) {
        if (left >= (0 + 20) && left <= (width - 20) && top >= (0 + 20) && top <= (height - 20) && (left + windowWidth) >= (0 + 20) && (left + windowWidth) <= (width - 20) && (top + windowHeight) >= (0 + 20) && (top + windowHeight) <= (height - 20)) {
            if (windowList["canvas" + windowId].isRotated) {
                console.log("DO ROTATION")
                askWindowRotation(windowId, 180);
            }
        }
    };
    
    // called from server - to update the image data just for this client page
    // the data is a base64-encoded image
    windowRotation = function (windowId, degree) {
        var window = getWindow(windowId);
        var angle = windowList["canvas" + windowId].angle + degree;
        windowList["canvas" + windowId].angle = angle;
        isRotating = true;
        setTimeout(function () { isRotating = false;}, 1000);
        window.style.WebkitTransitionDuration = '1s';
        window.style.webkitTransform = 'rotate(' + angle + 'deg)';
        windowList["canvas" + windowId].isRotated = !windowList["canvas" + windowId].isRotated;
        


    };

    //=============================================================================
    // SHARE MEDIA WINDOW : (VIDEO, PDF, APPS ETC...)
    //=============================================================================
    
    launchSharedMediaDisplay = function (windowId, type, title, data) {
        console.log("LAUNCHING");
        if (type == "ping-pong") {
            launchPingPongGame(windowId, false);
        }
        else {
            createCanvas(windowId, title, 400, 300, type, false, true, data);
        }
        // initializeAudioplayer(now.id, windowId);
        ReadyToReceiveMedia(windowId, type);
    };
    
    //=============================================================================
    // STREAMING VIDEO AND AUDIO
    //=============================================================================
    
    broadcastVideo = function (windowId, isPlayingAudio) {
        //initializeAudioplayer(now.id, windowId);
        console.log("READY");
        var canvas = document.createElement("canvas");
        var context = canvas.getContext('2d');
        // get HTML5 video handler
        var video = document.getElementById("video" + windowId);
        console.log(video);
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
            //video.play();
        }
    }
    
    // called from server - to update the image data just for this client page
    // the data is a base64-encoded image
    updateCanvas = function (windowId, image) {
        var window = getWindow(windowId);
        var canvasToDraw = document.getElementById("canvas" + windowId);
        var draw = canvasToDraw.getContext('2d');
        var rotated = false;
        // create a blank HTML image, put the data into the image src
        var img = new Image();
        img.src = image;
        
        // when the image loaded, draw the image on HTML5 canvas
        img.addEventListener("load", function () {
            var isTiled = windowList[canvasToDraw.id].isTiled;
            var masterPosition = windowList[canvasToDraw.id].data.masterPosition;

            var backing_canvas = document.getElementById("backing_" + canvasToDraw.id);
            backing_canvas.width = img.width;
            backing_canvas.height = img.height;
            var context = backing_canvas.getContext('2d');
            
            var rows = 2;
            var cols = 2;
            var tileX = 0;
            var tileY = 0;
            var tileWidth = img.width;
            var tileHeight = img.height;
            
            var orientation;
            //If picture has to be tiled
            if (isTiled) {
                tileWidth = Math.round(img.width / cols);
                tileHeight = Math.round(img.height / rows);
                var tileCenterX = tileWidth / 2;
                var tileCenterY = tileHeight / 2;
                
                //if (infos.orientation == "NE") {
                //    tileX = tileX + tileWidth;
                //}
                //else if (infos.orientation == "SW") {
                //    tileY = tileY + tileHeight;
                //}
                //else if (infos.orientation == "SE") {
                //    tileX = tileX + tileWidth;
                //    tileY = tileY + tileHeight;
                //}

                var i, j;
                if (masterPosition.j > ((rows/2) - 1)) {
                    //SENS CARTESIEN NORMALE
                    i = infos.position.i;
                    j = infos.position.j;
                }
                else {
                    //SENS CARTESIEN INVERSEE
                    //(NBTOTAL - 1) - COORDONNEE
                    i = (cols - 1) - infos.position.i;
                    j = (rows - 1) - infos.position.j;
                }
                tileX = tileX + i * tileWidth;
                tileY = tileY + j * tileHeight;
                if (j <= ((rows / 2) - 1)) {
                    if (!windowList[canvasToDraw.id].isRotated) {
                        console.log("ROTATED CS")
                        draw.translate(canvasToDraw.width, canvasToDraw.height);
                        draw.rotate(180 * (Math.PI / 180));
                        windowList[canvasToDraw.id].isRotated = true;
                    }
                }
            }
            else {
                if (windowList[canvasToDraw.id].isRotated) {
                    console.log("ROTATED CS")
                    draw.translate(canvasToDraw.width, canvasToDraw.height);
                    draw.rotate(180 * (Math.PI / 180));
                    windowList[canvasToDraw.id].isRotated = false;
                }
            }
            
            
            
            context.drawImage(img, tileX, tileY, tileWidth, tileHeight, 0, 0, img.width, img.height);
            draw.drawImage(backing_canvas, 0, 0, canvasToDraw.width, canvasToDraw.height);
            canvasToDraw.dispatchEvent(event);

            //draw.drawImage(img, tileX, tileY, tileWidth, tileHeight, 0, 0, img.width, img.height);
            //canvasToDraw.dispatchEvent(event);
            //draw.drawImage(canvasToCopy, 0, 0);


            //copy.drawImage(img, 0, 0);
            //draw.drawImage(canvasToCopy, tileX, tileY, tileWidth, tileHeight, 0, 0, canvasToDraw.width, canvasToDraw.height);

        });
    };
    

    //=============================================================================
    // REMOTE CONTROL FOR SYNCHRONIZING MEDIA OF CLIENTS
    //=============================================================================
    
    remoteMediaControl = function (windowId, mediaType, controlType, value) { 
        if (mediaType == "video") {
            if (controlType == "tiled-display") {
                var canvas = document.getElementById("canvas" + windowId);
                windowList[canvas.id].data.masterPosition = value;
                windowList[canvas.id].isTiled = true;
                fullWindow(canvas);
            }
            else if (controlType == "seekbar") {
                    var video = document.getElementById('video' + windowId)
                    video.currentTime = (value * video.duration) / 100;
            }
            else if (controlType == "play") {
                if (value == "event") {
                    var canvas = document.getElementById('canvas' + windowId);
                    windowList[canvas.id].data.paused = false;
                    var play = document.getElementById('play-video' + windowId);
                    play.innerHTML = "PAUSE";
                }
                else {
                    var video = document.getElementById('video' + windowId);
                    var play = document.getElementById('play-video' + windowId);
                    play.innerHTML = "PAUSE";
                    video.play();
                }

            }
            else if (controlType == "pause") {
                if (value == "event") {
                    var canvas = document.getElementById('canvas' + windowId);
                    windowList[canvas.id].data.paused = true;
                    var play = document.getElementById('play-video' + windowId);
                    play.innerHTML = "PLAY";
                }
                else {
                    var video = document.getElementById('video' + windowId);
                    var play = document.getElementById('play-video' + windowId);
                    play.innerHTML = "PLAY";
                    video.pause();
                }
            }
            else if (controlType == "currentTime") {
                var canvas = document.getElementById("canvas" + windowId);
                windowList[canvas.id].data.currentTime = value.currentTime;
                canvas.dispatchEvent(eventTimeUpdate);
            }
            else if (controlType == "endfullscreen") {
                var canvas = document.getElementById('canvas' + windowId);
                windowList[canvas.id].isTiled = false;
                canvas.dispatchEvent(eventEndFullscreen);
            }
        }
        else if (mediaType == "pdf") {
            if (controlType == "switch-tiled-display") {
                var canvas = document.getElementById("canvas" + windowId);
                windowList[canvas.id].isTiled = true;
                fullWindow(canvas);
            }
            else if (controlType == "seekbar") {
                var seekBar = document.getElementById('video-slider' + windowId)
                seekBar.value = value;
                var eventInput = new Event('input');
                seekBar.dispatchEvent(eventInput);
            }
            else if (controlType == "seekbar-event") {
                var seekBar = document.getElementById('video-slider' + windowId)
                seekBar.value = value;
                windowList["canvas" + windowId].data.currentPosition = value;
                
                if (seekBar.classList.contains('fill')) {
                    styles[windowId] = getFillStyle(seekBar);
                }
                else {
                    styles[windowId] = '';
                }
                if (seekBar.classList.contains('tip')) {
                    styles[windowId] += getTipStyle(seekBar);
                }
                s.textContent = styles.join('');
            }
            else if (controlType == "previous") {
                if (value == "event") {
                    var seekBar = document.getElementById('video-slider' + windowId)
                    seekBar.value--;
                    if (seekBar.classList.contains('fill')) {
                        styles[windowId] = getFillStyle(seekBar);
                    }
                    else {
                        styles[windowId] = '';
                    }
                    if (seekBar.classList.contains('tip')) {
                        styles[windowId] += getTipStyle(seekBar);
                    }
                    s.textContent = styles.join('');
                    windowList["canvas" + windowId].data.currentPosition--;
                }
                else {
                    var previous = document.getElementById('previous-pdf' + windowId)
                    var eventPrevious = new Event('previous');
                    previous.dispatchEvent(eventPrevious);
                }

            }
            else if (controlType == "next") {
                if (value == "event") {
                    var seekBar = document.getElementById('video-slider' + windowId)
                    seekBar.value++;
                    if (seekBar.classList.contains('fill')) {
                        styles[windowId] = getFillStyle(seekBar);
                    }
                    else {
                        styles[windowId] = '';
                    }
                    if (seekBar.classList.contains('tip')) {
                        styles[windowId] += getTipStyle(seekBar);
                    }
                    s.textContent = styles.join('');
                    windowList["canvas" + windowId].data.currentPosition++;
                }
                else {
                    var next = document.getElementById('next-pdf' + windowId)
                    var eventNext = new Event('next');
                    next.dispatchEvent(eventNext);
                }
            }
            else if (controlType == "endfullscreen") {
                var canvas = document.getElementById('canvas' + windowId);
                windowList[canvas.id].isTiled = false;
                canvas.dispatchEvent(eventEndFullscreen);
            }
        }
    }
    
    switchToTiledDisplay = function (windowId){
        var canvas = document.getElementById("canvas" + windowId);
        windowList[canvas.id].isTiled = true;
        fullWindow(canvas);
    }

    switchToNormalDisplay = function (windowId) {
        var canvas = document.getElementById("canvas" + windowId);
        windowList[canvas.id].isTiled = false;
    }
    

    playVideo = function () {
        document.getElementById("video").play();
    };

    playAudio = function () {
        document.getElementById("audio").play();
        //audioplayer.toggle();
    };
    
    
    //=============================================================================
    // REMOTE CONTROL FOR SYNCHRONIZING PING-PONG GAME BETWEEN CLIENTS
    //=============================================================================
    remoteGameControl = function (windowId, game, controlType, value) {
        if (game == "ping-pong") {
            if (controlType == "start") {
                console.log("REMOTE START")
                windowList["canvas" + windowId].data.game.start();
            }
            else if (controlType == "restart") {
                windowList["canvas" + windowId].data.game.restart();
            }
            else if (controlType == "moveBall") {
                var x = (value.x * windowList["canvas" + windowId].data.game.W) / value.W;
                var y = (value.y * windowList["canvas" + windowId].data.game.H) / value.H;
                windowList["canvas" + windowId].data.game.ball.x = windowList["canvas" + windowId].data.game.W - x;
                windowList["canvas" + windowId].data.game.ball.y = windowList["canvas" + windowId].data.game.H - y;
            }
            else if (controlType == "movePaddle") {
                var x = (value.x * windowList["canvas" + windowId].data.game.W) / value.W;
                windowList["canvas" + windowId].data.game.movePaddle(value.id, windowList["canvas" + windowId].data.game.W - windowList["canvas" + windowId].data.game.paddles[value.id].w - x);
            }
            else if (controlType == "tiled-display") {
                windowList["canvas" + windowId].isTiled = true;
                windowList["canvas" + windowId].data.game.launchFullScreen();
                
            }
            else if (controlType == "endfullscreen") {
                var eventEndFullscreen = new Event('endfullscreen');
                var canvas = document.getElementById('canvas' + windowId);
                canvas.dispatchEvent(eventEndFullscreen);
                windowList["canvas" + windowId].isTiled = false;
            }
        }
    }
});