

var notHead = false;
//TRUE IF DISPLAYING FULLSCREEN 
var fullWindowState;
//SAVE CANVAS DATA (display state, media data etc...)
var windowList = new Object();
var isRotated = false;


//=================================================================================
// MANAGE DISPLAY DIV : (Rotation etc...)
//=================================================================================

function rotateDisplayDiv() {
    var display = document.body;
    display.style.webkitTransform = 'rotate(' + 180 + 'deg)';
    isRotated = true;
}





//=================================================================================
// CREATE A NEW HTML/CSS/JQUERY WINDOW ACCORDING TO AN ID AND MANAGE DRAG AND DROP
//=================================================================================

function addWindow(windowId, title, width, height, type, isShared) {
    //CREATE PRINCIPAL WINDOW DIV
    var windowDiv = document.createElement('div');
    windowDiv.className = 'window pepo';
    windowDiv.id = 'window' + windowId;
    windowDiv.style.width = width + "px";
    
    //CREATE WINDOW HEADER
    var windowHeader = document.createElement('header');
    windowHeader.className = 'window-header';
    windowHeader.id = 'window-header' + windowId;
    
    //CREATE FULLSCREEN ICON
    var iconFullscreen = document.createElement('label');
    iconFullscreen.className = 'icon-fullscreen';
    iconFullscreen.innerHTML = "[  ]";
    
    //CREATE TILED DISPLAY ICON
    var iconTiled = document.createElement('label');
    iconTiled.className = 'icon-tiled';
    iconTiled.innerHTML = "T";
    
    //CREATE CLOSE ICON
    var iconClose = document.createElement('label');
    iconClose.className = 'icon-close';
    iconClose.innerHTML = "x";
    //CREATE HEADER TITLE
    var WindowTitle = document.createElement('div');
    WindowTitle.className = 'title-header';
    WindowTitle.innerHTML = title;
    
    //CREATE DIV FOR ADDING ICONS
    var toolbar = document.createElement('div');
    toolbar.className = 'toolbar-header';
    toolbar.appendChild(iconFullscreen);
    toolbar.appendChild(iconTiled);
    toolbar.appendChild(iconClose);
    
    //ADD TOOLBAR AND TITLE INTO WINDOW HEADER
    windowHeader.appendChild(toolbar);
    windowHeader.appendChild(WindowTitle);
    
    //CREATE WINDOW DIV FOR DISPLAYING
    var windowFormDiv = document.createElement('div');
    windowFormDiv.className = 'window-form';
    //windowFormDiv.innerHTML = "Content";
    windowFormDiv.style.height = height + 'px';
    
    //ADD HEADER AND DISPLAY DIV INTO WINDOW
    windowDiv.appendChild(windowHeader);
    windowDiv.appendChild(windowFormDiv);
    
   // ADD WINDOW INTO AREA
    var display = document.getElementsByClassName("display")[0];
    display.appendChild(windowDiv);
    
    //MANAGE DRAG AND DROP FOR MOUSE
    $("#window-header" + windowId).mousedown(function (e) {            
        $("#" + e.currentTarget.parentElement.id).pep({
            // constrainTo: 'parent',
            rotation : isRotated,
            start: function (ev, obj) {
                if (notHead) {
                    $.pep.unbind($("#" + e.currentTarget.parentElement.id));
                }
                //obj.$el.css({ background : 'red'});
            },
            drag: function (ev, obj) {
   
                var width = $('div.display').width();
                var height = $('div.display').height();
                if (isShared) {
                    now.shareWindowPosition(windowId, infos.orientation, obj.$el.context.offsetTop, obj.$el.context.offsetLeft, width, height);
                    //if (isRotated) {
                    //    now.shareWindowPosition(windowId, infos.orientation, height - obj.$el.context.offsetTop, width - obj.$el.context.offsetLeft, width, height);
                        
                    //}
                    //else {
                    //    now.shareWindowPosition(windowId, infos.orientation, obj.$el.context.offsetTop, obj.$el.context.offsetLeft, width, height);
                    //}
                }
            },
            
            easing: function (ev, obj) {
                var width = $('div.display').width();
                var height = $('div.display').height();
                               
                if (isShared) {
                    now.shareWindowPosition(windowId, infos.orientation, obj.$el.context.offsetTop, obj.$el.context.offsetLeft, width, height);
                    //if (isRotated) {
                    //    now.shareWindowPosition(windowId, infos.orientation, height - obj.$el.context.offsetTop, width - obj.$el.context.offsetLeft, width, height);
                        
                    //}
                    //else {
                    //    now.shareWindowPosition(windowId, infos.orientation, obj.$el.context.offsetTop, obj.$el.context.offsetLeft, width, height);
                    //}
                }
            },
            stop: function (ev, obj) {
                var vel = obj.velocity();
                //console.log(vel);
                
                if (vel.x > 1500 || vel.y > 1500 || vel.x < -1500 || vel.y < -1500) {
                    console.log("TABLE SUIVANTE");
                    //obj.$el.css({ background : 'green'}); 
                }
                $.pep.unbind($("#" + e.currentTarget.parentElement.id));
            }
        });
    });
    
    //MANAGE DRAG AND DROP FOR MOUSE
    $("#window-header" + windowId).on("touchstart", function (e) {
        console.log("Touch Event")
        e.preventDefault();
        $("#" + e.currentTarget.parentElement.id).pep({
            //constrainTo: 'parent',
            velocityMultiplier: 5,
            start: function (ev, obj) {
                if (notHead) {
                    $.pep.unbind($("#" + e.currentTarget.parentElement.id));
                }
                //obj.$el.css({ background : 'red'});
            },
            drag: function (ev, obj) {
                if (isShared) {
                    var width = $('div.display').width();
                    var height = $('div.display').height();
                    now.shareWindowPosition(windowId, infos.orientation, obj.$el.context.offsetTop, obj.$el.context.offsetLeft, width, height);
                }
            },
            easing: function (ev, obj) {
                if (isShared) {
                    var width = $('div.display').width();
                    var height = $('div.display').height();
                    now.shareWindowPosition(windowId, infos.orientation, obj.$el.context.offsetTop, obj.$el.context.offsetLeft, width, height);
                }
            },
            stop: function (ev, obj) {
                var vel = obj.velocity();
                
                if (vel.x > 1500 || vel.y > 1500 || vel.x < -1500 || vel.y < -1500) {
                    console.log("TABLE SUIVANTE");
                    //obj.$el.css({ background : 'green'}); 
                }
                $.pep.unbind($("#" + e.currentTarget.parentElement.id));
            }
        });
    });
    return windowDiv;
}

//GET WINDOW
function getWindow(windowId) {
    return document.getElementById('window' + windowId);
}

//=============================================================================
// CREATE A AUDIOPLAYER TO PLAY ALL STREAMED AUDIO
//=============================================================================
function initializeAudioLink(id) {
    var audioLink = document.createElement('a');
    //audioLink.href = "/audio" + id;
    audioLink.id = "audioPlayer";
    audioLink.style.visibility = "hidden";
    audioLink.style.width = "2px";
    audioLink.style.height = "2px";
    $('body').append(audioLink);
}

function initializeAudioplayer(id, windowId) {
    console.log("AUDIOPLAY LAUNCHING" + id);
    var audioplayer = flowplayer("audioPlayer", "/includes/flowplayer.swf", {
        clip: {
            // baseUrl for both parent and instream clips
            url: "/audio" + id,
            autoBuffering: true,
            autoPlay: false,
            onBegin: function () {
                ReadyToPlayAudio(windowId);
            }
        }
    });
    setAudioPlayer(audioplayer);
}

//=============================================================================
// CREATE CANVAS INTO HTML WINDOW FOR DISPLAYING MEDIA (VIDEO, PDF, APPS etc..)
//=============================================================================

function createCanvas(windowId, title, width, height, type, isMaster, isShared, data) {
    var canvasToDraw = document.createElement('canvas');
    canvasToDraw.id = 'canvas' + windowId;
    canvasToDraw.width = width;
    canvasToDraw.height = height;
    
    var backing_canvas = document.createElement("canvas");
    backing_canvas.id = "backing_" + canvasToDraw.id;
    backing_canvas.style.display = "none";
    
    //var windowDiv = addWindow(windowId, title, width + 10, height + 5, type);
    var windowDiv = addWindow(windowId, title, width, height, type, isShared);
    windowDiv.getElementsByClassName('window-form')[0].appendChild(canvasToDraw);
    windowDiv.getElementsByClassName('window-form')[0].appendChild(backing_canvas);
    
    var media = { "type": type, "isTiled": false, "isMaster": isMaster, "data": data }
    windowList[canvasToDraw.id] = media;
    
    if (type == "video") {
        var videoControls = createVideoControls(windowId, false, isMaster);
        windowDiv.appendChild(videoControls);
        
        var timeoutIdentifier;
        
        $("#" + videoControls.id).mousemove(function (e) {
            if (timeoutIdentifier) {
                clearTimeout(timeoutIdentifier);
            }
            timeoutIdentifier = setTimeout(function () {
                $("#" + videoControls.id).slideUp(200);
            }, 2500);
        });
        
        $("#" + canvasToDraw.id).mousemove(function (e) {
            $("#" + videoControls.id).slideDown(200);
            
            if (timeoutIdentifier) {
                clearTimeout(timeoutIdentifier);
            }
            timeoutIdentifier = setTimeout(function () {
                $("#" + videoControls.id).slideUp(200);
            }, 2500);
        });
    
    }
    else if (type == "pdf") {
        var pdfControls = createPdfControls(windowId, false, isMaster);
        windowDiv.appendChild(pdfControls);
        
        var timeoutIdentifier;
        
        $("#" + pdfControls.id).mousemove(function (e) {
            if (timeoutIdentifier) {
                clearTimeout(timeoutIdentifier);
            }
            timeoutIdentifier = setTimeout(function () {
                $("#" + pdfControls.id).slideUp(200);
            }, 2500);
        });
        
        $("#" + canvasToDraw.id).mousemove(function (e) {
            $("#" + pdfControls.id).slideDown(200);
            
            if (timeoutIdentifier) {
                clearTimeout(timeoutIdentifier);
            }
            timeoutIdentifier = setTimeout(function () {
                $("#" + pdfControls.id).slideUp(200);
            }, 2500);
        });
    
    }
    return canvasToDraw;
};

function reloadCanvas(canvas) {
    var backing_canvas = document.getElementById("backing_" + canvas.id);
    var draw = canvas.getContext('2d');
    draw.drawImage(backing_canvas, 0, 0, canvas.width, canvas.height);
}

//=============================================================================
// CREATE A CONTROLS BAR FOR CANVAS DISPLAYING VIDEOS
//=============================================================================

function createVideoControls(windowId, isFullscreen, isMaster) {
    if (isFullscreen) {
        var ID = "-fullscreen";
    }
    else {
        var ID = windowId;
    }
    var toolbar = document.createElement('div');
    toolbar.className = 'media-controls transparent';
    toolbar.id = "media-controls" + ID;
    toolbar.style.display = "none";
    
    var canvas = document.getElementById("canvas" + windowId);
    if (isMaster) {
        var video = document.getElementById("video" + windowId);
    }
    else {
        var video = windowList[canvas.id].data;
    }
    
    var current_time = document.createElement('div');
    current_time.className = 'video-currentTime';
    current_time.id = "video-currentTime" + ID;
    current_time.innerHTML = "0:00";
    
    var play = document.createElement('div');
    play.className = 'play-video';
    play.id = 'play-video' + ID;
    play.innerHTML = "PLAY";
    
    var duration = document.createElement('div');
    duration.className = 'video-duration';
    duration.id = 'video-duration' + ID;
    duration.innerHTML = Math.round(video.duration / 60) + ":" + (Math.round(video.duration) % 60).toString().replace(/^(\d)$/, '0$1');
    
    var seekBar = document.createElement('input');
    seekBar.type = "range";
    seekBar.className = ' video-slider fill fill--1';
    seekBar.id = 'video-slider' + ID;
    seekBar.value = '0';
    seekBar.step = "0.1";
    seekBar.max = "100";
    styles.push('');
    
    // Case isFullscreen : The event listener will be set outside this function to remove it easily
    if (isMaster && !isFullscreen) {
        video.addEventListener("timeupdate", function () {
            var data = { "duration": video.duration, "currentTime": video.currentTime };
            askRemoteMediaControl(windowId, "video", "currentTime", data, "except-host");
            seekBar.value = ((100 * video.currentTime) / video.duration);
            document.getElementById('video-currentTime' + ID).innerHTML = Math.round(video.currentTime / 60) + ":" + (Math.round(video.currentTime) % 60).toString().replace(/^(\d)$/, '0$1');
            
            if (seekBar.classList.contains('fill')) {
                styles[ID] = getFillStyle(seekBar);
            }
            else {
                styles[ID] = '';
            }
            if (seekBar.classList.contains('tip')) {
                styles[ID] += getTipStyle(seekBar);
            }
            s.textContent = styles.join('');

        }, false);
    }
    // Case isFullscreen : The event listener will be set outside this function to remove it easily
    else if (!isFullscreen) {
        canvas.addEventListener("dataupdate", function () {
            seekBar.value = ((100 * video.currentTime) / video.duration);
            document.getElementById('video-currentTime' + ID).innerHTML = Math.round(video.currentTime / 60) + ":" + (Math.round(video.currentTime) % 60).toString().replace(/^(\d)$/, '0$1');
            
            if (seekBar.classList.contains('fill')) {
                styles[ID] = getFillStyle(seekBar);
            }
            else {
                styles[ID] = '';
            }
            if (seekBar.classList.contains('tip')) {
                styles[ID] += getTipStyle(seekBar);
            }
            s.textContent = styles.join('');
        }, false);
    }
    
    seekBar.addEventListener('input', function () {
        if (isMaster) {
            video.currentTime = (this.value * video.duration) / 100;
            document.getElementById('video-currentTime' + ID).innerHTML = (Math.round(video.currentTime) % 60) + ":" + Math.round(video.currentTime / 60).toString().replace(/^(\d)$/, '0$1');
        }
        else {
            askRemoteMediaControl(windowId, "video", "seekbar", this.value, "master");
        }
        if (this.classList.contains('fill')) {
            styles[ID] = getFillStyle(this);
        }
        else {
            styles[ID] = '';
        }
        s.textContent = styles.join('');
    }, false);
    
    play.addEventListener('mousedown', function () {
        if (isMaster) {
            if (video.paused) {
                this.innerHTML = "PAUSE";
                askRemoteMediaControl(windowId, "video", "play", "event", "except-host");
                video.play();
            }
            else {
                this.innerHTML = "PLAY";
                askRemoteMediaControl(windowId, "video", "pause", "event", "except-host");
                video.pause();
            }
        }
        else {
            if (video.paused) {
                this.innerHTML = "PAUSE";
                askRemoteMediaControl(windowId, "video", "play", "", "master");
            }
            else {
                this.innerHTML = "PLAY";
                askRemoteMediaControl(windowId, "video", "pause", "", "master");
            }
        }
    }, false);
    
    toolbar.appendChild(seekBar);
    toolbar.appendChild(play);
    toolbar.appendChild(current_time);
    toolbar.appendChild(duration);
    return toolbar;
}


//=============================================================================
// CREATE A CONTROLS BAR FOR CANVAS DISPLAYING PDF
//=============================================================================

function createPdfControls(windowId, isFullscreen, isMaster) {
    if (isFullscreen) {
        var ID = "-fullscreen";
    }
    else {
        var ID = windowId;
    }
    var toolbar = document.createElement('div');
    toolbar.className = 'media-controls transparent';
    toolbar.id = "media-controls" + ID;
    toolbar.style.display = "none";
    
    var canvas = document.getElementById("canvas" + windowId);
    var data = windowList[canvas.id].data;
    
    var previous = document.createElement('div');
    previous.className = 'previous-pdf';
    previous.id = 'previous-pdf' + ID;
    previous.innerHTML = "PREVIOUS";
    
    var next = document.createElement('div');
    next.className = 'next-pdf';
    next.id = 'next-pdf' + ID;
    next.innerHTML = "NEXT";
    
    var seekBar = document.createElement('input');
    seekBar.type = "range";
    seekBar.className = ' video-slider fill fill--1';
    seekBar.id = 'video-slider' + ID;
    seekBar.value = '0';
    seekBar.step = "1";
    seekBar.max = data.total - 1;
    styles.push('');
    
    seekBar.addEventListener('input', function () {
        if (isMaster) {
            loadPdfPage(windowId, parseInt(this.value) + 1);
            askRemoteMediaControl(windowId, "pdf", "seekbar-event", this.value, "except-host");
        }
        else {
            askRemoteMediaControl(windowId, "pdf", "seekbar", this.value, "master");
        }
        if (this.classList.contains('fill')) {
            styles[ID] = getFillStyle(this);
        }
        else {
            styles[ID] = '';
        }
        s.textContent = styles.join('');
    }, false);
    
    previous.addEventListener('mousedown', function () {
        if (isMaster) {
            if (data.currentPosition > 1) {
                askRemoteMediaControl(windowId, "pdf", "seekbar-event", seekBar.value, "except-host");
                loadPdfPage(windowId, data.currentPosition - 1);
                seekBar.value--;
            }
        }
        else {
            if (data.currentPosition > 1) {
                askRemoteMediaControl(windowId, "pdf", "previous", "", "master");
            }
        }
        if (seekBar.classList.contains('fill')) {
            styles[ID] = getFillStyle(seekBar);
        }
        else {
            styles[ID] = '';
        }
        if (seekBar.classList.contains('tip')) {
            styles[ID] += getTipStyle(seekBar);
        }
        s.textContent = styles.join('');
    }, false);
    
    next.addEventListener('mousedown', function () {
        if (isMaster) {
            if (data.currentPosition < data.total) {
                seekBar.value++;
                askRemoteMediaControl(windowId, "pdf", "seekbar-event", seekBar.value, "except-host");
                loadPdfPage(windowId, data.currentPosition + 1);
                
                if (seekBar.classList.contains('fill')) {
                    styles[ID] = getFillStyle(seekBar);
                }
                else {
                    styles[ID] = '';
                }
                if (seekBar.classList.contains('tip')) {
                    styles[ID] += getTipStyle(seekBar);
                }
                s.textContent = styles.join('');
            }
        }
        else {
            askRemoteMediaControl(windowId, "pdf", "next", "", "master");
        }
    }, false);
    
    toolbar.appendChild(seekBar);
    toolbar.appendChild(previous);
    toolbar.appendChild(next);
    //toolbar.appendChild(duration);
    return toolbar;
}

//=============================================================================
// MANAGE FULLSCREEN
//=============================================================================

function fullWindow(canvas) {
    
    if (!fullWindowState) {
        fullWindowState = true;
        var windowId = canvas.id.split('canvas')[1];
        var isMaster = windowList[canvas.id].isMaster;
        
        // Canvas goes full window
        var canvasToDraw = document.getElementById('canvasFullscreen');
        //var divFullscreen = document.getElementById('divFullscreen');")
        launchFullScreen(document.documentElement);
        
        saveLeft = canvas.parentElement.parentElement.offsetLeft;
        saveTop = canvas.parentElement.parentElement.offsetTop;
        saveWidth = canvas.width;
        saveHeight = canvas.height;
        saveDisplay = canvas.style.display;
        
        canvasToDraw.width = window.innerWidth;
        canvasToDraw.height = window.innerHeight;
        canvasToDraw.style.display = "block";
        
        canvas.style.display = "none";
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        if (windowList[canvas.id].type == "video") {
            var videoControls = createVideoControls(windowId, true, isMaster);
            videoControls.style.marginTop = "-64px";
            
            var listenerVideoTimeUpdate = function (e) {
                
                var data = { "duration": this.duration, "currentTime": this.currentTime };
                askRemoteMediaControl(windowId, "video", "currentTime", data, "except-host");
                var seekBar = document.getElementById('video-slider-fullscreen');
                seekBar.value = ((100 * this.currentTime) / this.duration);
                document.getElementById('video-currentTime-fullscreen').innerHTML = Math.round(this.currentTime / 60) + ":" + (Math.round(this.currentTime) % 60).toString().replace(/^(\d)$/, '0$1');
                
                if (seekBar.classList.contains('fill')) {
                    styles["-fullscreen"] = getFillStyle(seekBar);
                }
                else {
                    styles["-fullscreen"] = '';
                }
                if (seekBar.classList.contains('tip')) {
                    styles["-fullscreen"] += getTipStyle(seekBar);
                }
                s.textContent = styles.join('');
            }
            
            var listenerCanvasDataUpdate = function (e) {
                var video = windowList[this.id].data;
                var seekBar = document.getElementById('video-slider-fullscreen');
                seekBar.value = ((100 * video.currentTime) / video.duration);
                document.getElementById('video-currentTime-fullscreen').innerHTML = Math.round(video.currentTime / 60) + ":" + (Math.round(video.currentTime) % 60).toString().replace(/^(\d)$/, '0$1');
                
                if (seekBar.classList.contains('fill')) {
                    styles["-fullscreen"] = getFillStyle(seekBar);
                }
                else {
                    styles["-fullscreen"] = '';
                }
                if (seekBar.classList.contains('tip')) {
                    styles["-fullscreen"] += getTipStyle(seekBar);
                }
                s.textContent = styles.join('');
            }
            
            if (isMaster) {
                var video = document.getElementById("video" + windowId);
                video.addEventListener("timeupdate", listenerVideoTimeUpdate, false);
            }
            else {
                canvas.addEventListener("dataupdate", listenerCanvasDataUpdate, false);
            }
            var timeoutIdentifier;
            $("#" + videoControls.id).mousemove(function (e) {
                if (timeoutIdentifier) {
                    clearTimeout(timeoutIdentifier);
                }
                timeoutIdentifier = setTimeout(function () {
                    $("#fullscreen-controls-id").slideUp(200);
                    $("#" + videoControls.id).slideUp(200);
                }, 2500);
            });
            
            var fullscreenControlListener = function (e) {
                $("#fullscreen-controls-id").slideDown(200);
                $("#" + videoControls.id).slideDown(200);
                
                if (timeoutIdentifier) {
                    clearTimeout(timeoutIdentifier);
                }
                timeoutIdentifier = setTimeout(function () {
                    $("#" + videoControls.id).slideUp(200);
                    $("#fullscreen-controls-id").slideUp(200);
                }, 2500);
            }
            
            canvasToDraw.addEventListener("mousemove", fullscreenControlListener, false);
            $("body").append(videoControls);
        }
        else if (windowList[canvas.id].type == "pdf") {
            var pdfControls = createPdfControls(windowId, true, isMaster);
            pdfControls.style.marginTop = "-64px";
            
            var timeoutIdentifier;
            $("#" + pdfControls.id).mousedown(function (e) {
                console.log(timeoutIdentifier)
                if (timeoutIdentifier) {
                    
                    clearTimeout(timeoutIdentifier);
                }
                timeoutIdentifier = setTimeout(function () {
                    $("#fullscreen-controls-id").slideUp(200);
                    $("#" + pdfControls.id).slideUp(200);
                }, 2500);
            });
            
            var fullscreenControlListener = function (e) {
                $("#fullscreen-controls-id").slideDown(200);
                $("#" + pdfControls.id).slideDown(200);
                
                if (timeoutIdentifier) {
                    clearTimeout(timeoutIdentifier);
                }
                timeoutIdentifier = setTimeout(function () {
                    $("#" + pdfControls.id).slideUp(200);
                    $("#fullscreen-controls-id").slideUp(200);
                }, 2500);
            }
            canvasToDraw.addEventListener("mousemove", fullscreenControlListener, false);
            $("body").append(pdfControls);
            reloadCanvas(canvas);
        }
        
        var fullscreenButton = document.getElementById('close-fullscreen');
        var draw = canvasToDraw.getContext('2d');

        window.addEventListener('resize', function (e) {
            
            canvasToDraw.width = window.innerWidth;
            canvasToDraw.height = window.innerHeight;
            draw.drawImage(canvas, 0, 0, canvasToDraw.width, canvasToDraw.height);
        }, false);
        
        var listener = function (e) {
            draw.drawImage(canvas, 0, 0, canvasToDraw.width, canvasToDraw.height);
        }
        
        var endFullscreen = function (e) {
            cancelFullScreen(document.documentElement);
            canvas.width = saveWidth;
            canvas.height = saveHeight;
            canvas.parentElement.parentElement.style.top = saveTop + "px";
            canvas.parentElement.parentElement.style.left = saveLeft + "px";
            canvas.style.display = saveDisplay;
            reloadCanvas(canvas)
            
            
            canvasToDraw.style.display = "none";
            fullWindowState = false;
            $("#fullscreen-controls-id").slideUp(1);
            
            if (windowList[canvas.id].type == "video") {
                document.body.removeChild(videoControls);
                if (isMaster) {
                    video.removeEventListener("timeupdate", listenerVideoTimeUpdate, false);
                }
                else {
                    canvas.removeEventListener("dataupdate", listenerCanvasDataUpdate, false);
                }
            }
            else if (windowList[canvas.id].type == "pdf") {
                document.body.removeChild(pdfControls);
            }
            canvasToDraw.removeEventListener("mousemove", fullscreenControlListener, false);
            fullscreenButton.removeEventListener("mousedown", askEndFullscreen, false);
            canvas.removeEventListener("endfullscreen", endFullscreen, false);
            canvas.removeEventListener("draw", listener, false);
            
        }
        var askEndFullscreen = function (e) {
            askRemoteMediaControl(windowId, "video", "endfullscreen", "", "all");
        }
        canvas.addEventListener('draw', listener, false);
        canvas.addEventListener('endfullscreen', endFullscreen , false)
        fullscreenButton.addEventListener('mousedown', askEndFullscreen , false);
    }
}

function launchFullScreen(element) {
    if (element.requestFullscreen) { element.requestFullscreen(); }
    else if (element.mozRequestFullScreen) { element.mozRequestFullScreen(); }
    else if (element.webkitRequestFullscreen) { element.webkitRequestFullscreen(); }
    else if (element.msRequestFullscreen) { element.msRequestFullscreen(); }
}

function cancelFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

function createFullscreenCanvas() {
    var canvasFullscreen = document.createElement('canvas');
    canvasFullscreen.className = "canvasFullWindow";
    canvasFullscreen.id = "canvasFullscreen";
    canvasFullscreen.style.display = "none";
    //canvasFullscreen.style.zIndex = "1";  
    $("body").append(canvasFullscreen);
}


//=============================================================================
// ALL EVENTS LISTENER
//=============================================================================

function initializeEventListener() {
    $(".load-normal-display").mousedown(function (e) {
        var inputFile = document.getElementById('input-video-normal-display');
        var fileUrl = window.URL.createObjectURL(inputFile.files[0]);
        
        askServerLoadVideoNormalDisplay(fileUrl);
    });
    
    $(".load-tiled-display").mousedown(function (e) {
        
        var inputFile = document.getElementById('input-video-tiled-display');
        var fileUrl = window.URL.createObjectURL(inputFile.files[0]);
        askServerLoadVideoTiledDisplay(fileUrl);
    });
    
    $(".load-pdf").mousedown(function (e) {
        
        var inputFile = document.getElementById('input-pdf');
        var fileUrl = window.URL.createObjectURL(inputFile.files[0]);
        askServerLoadPdf(fileUrl);
    });
    
    $(".load-shared-window").mousedown(function (e) {
        askServerLoadSharedWindow();
    });
    
    $(".load-ping-pong").mousedown(function (e) {
        askServerLoadPingPong();
    });
    
    $(".rotate-display-div").mousedown(function (e) {
        rotateDisplayDiv();
    });
    
    $(".display").on("touchstart mousedown", "label.icon-close", function (e) {
        e.preventDefault();
        e.currentTarget.parentElement.parentElement.parentElement.parentElement.removeChild(e.currentTarget.parentElement.parentElement.parentElement);
    });
    
    $(".display").on("touchstart mousedown", "label.icon-fullscreen", function (e) {
        e.preventDefault();
        var windowId = e.currentTarget.parentElement.parentElement.parentElement.id.split('window')[1];
        var canvas = document.getElementById("canvas" + windowId);
        
        if (windowList["canvas" + windowId].type == "game") {
            windowList["canvas" + windowId].data.game.launchFullScreen();
        }
        else {
            fullWindow(canvas);
        }
    });
    
    $(".display").on("touchstart mousedown", "label.icon-tiled", function (e) {
        e.preventDefault();
        var windowId = e.currentTarget.parentElement.parentElement.parentElement.id.split('window')[1];
        if (windowList["canvas" + windowId].type == "game") {
            askRemoteGameControl(windowId, "ping-pong", "tiled-display", "", "all");
        }
        else {
            askRemoteMediaControl(windowId, windowList["canvas" + windowId].type, "tiled-display", "", "all");
        }
    });
    
    $(".display").on("touchmove", function (e) {
        e.preventDefault();
    });
    
    // action lorsque le label est cliqué
    $(".input-file-trigger").on("mousedown", function (e) {
        $(".input-file").focus();
        return false;
    });
    
    // affiche un retour visuel dès que input:file change
    $(".input-file").on("change", function (e) {
        e.currentTarget.parentElement.getElementsByClassName("file-return").innerHTML = this.value;
    });
};


//=============================================================================
// USEFUL FUNCTIONS
//=============================================================================

function getOffset(el) {
    var _x = 0;
    var _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}
var s = document.createElement('style'), 
    r = document.querySelectorAll('input[type=range]'), 
    n_r = r.length, 
    styles = [], 
    pp = ['-webkit-slider-runnable-', '-moz-range-'],
    n_pp = pp.length;

manageControlBar = function () {
    document.getElementsByTagName('body')[0].appendChild(s);
}

function formatage(nombre) {
    var zero = "";
    if (nombre < 100) {
        zero = "0";
        if (nombre < 10) {
            zero = "00";
        }
    }
    return zero + nombre;
}