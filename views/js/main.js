

var notHead = false;
var buttonMenuPressed = false;
//var nbWindow = 0;
var fullWindowState;

var windowList = new Object();


function addWindow(windowId, title, width, height, type, isShared) {
    // Your existing code unmodified...
    var windowDiv = document.createElement('div');
    windowDiv.className = 'window pepo';
    windowDiv.id = 'window' + windowId;
    windowDiv.style.width = width + "px";
    var windowHeader = document.createElement('header');
    windowHeader.className = 'window-header';
    windowHeader.id = 'window-header' + windowId;
    
    var iconFullscreen = document.createElement('label');
    iconFullscreen.className = 'icon-fullscreen';
    iconFullscreen.innerHTML = "[  ]";
    
    var iconTiled= document.createElement('label');
    iconTiled.className = 'icon-tiled';
    iconTiled.innerHTML = "T";
    
    var iconClose = document.createElement('label');
    iconClose.className = 'icon-close';
    iconClose.innerHTML = "x";
    var WindowNameH2 = document.createElement('h2');
    WindowNameH2.innerHTML = title;
    
    windowHeader.appendChild(iconFullscreen);
    windowHeader.appendChild(iconTiled);
    windowHeader.appendChild(iconClose);
    windowHeader.appendChild(WindowNameH2);
    
    var windowFormDiv = document.createElement('div');
    windowFormDiv.className = 'window-form';
    //windowFormDiv.innerHTML = "Content";
    windowFormDiv.style.height = height + 'px';
    
    windowDiv.appendChild(windowHeader);
    windowDiv.appendChild(windowFormDiv);
    
    document.getElementsByClassName('display')[0].appendChild(windowDiv);
    
    $("#window-header" + windowId).mousedown(function (e) {
        console.log("Mouse Event")
        $("#" + e.currentTarget.parentElement.id).pep({
           // constrainTo: 'parent',
            start: function (ev, obj) {
                if (notHead) {
                    $.pep.unbind($("#" + e.currentTarget.parentElement.id));
                }
                //obj.$el.css({ background : 'red'});
            },
            drag: function (ev, obj) {
                if (isShared) {
                    now.shareWindowPosition(windowId, infos.orientation, obj.$el.context.offsetTop, obj.$el.context.offsetLeft);
                }
            },
            
            easing: function (ev, obj) {
                if (isShared) {
                    now.shareWindowPosition(windowId, infos.orientation, obj.$el.context.offsetTop, obj.$el.context.offsetLeft);
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
    
    $("#window-header" + windowId).on("touchstart", function (e) {
        console.log("Touch Event")
        e.preventDefault();
        $("#" + e.currentTarget.parentElement.id).pep({
            //constrainTo: 'parent',
            velocityMultiplier:5,
            start: function (ev, obj) {
                if (notHead) {
                    $.pep.unbind($("#" + e.currentTarget.parentElement.id));
                }
                //obj.$el.css({ background : 'red'});
            },
            drag: function (ev, obj) {
                if (isShared) {
                    now.shareWindowPosition(windowId, infos.orientation, obj.$el.context.offsetTop, obj.$el.context.offsetLeft);
                }
            },
            easing: function (ev, obj) {
                if (isShared) {
                    now.shareWindowPosition(windowId, infos.orientation, obj.$el.context.offsetTop, obj.$el.context.offsetLeft);
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


function getWindow(windowId) {
    return document.getElementById('window' + windowId);
}

function createVideoControls(windowId, isFullscreen, isMaster) {
    if (isFullscreen) {
        var ID = "-fullscreen";
    }
    else {
        var ID = windowId;
    }
    var toolbar = document.createElement('div');
    toolbar.className = 'video-controls transparent';
    toolbar.id = "video-controls" + ID;
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
            shareData(windowId, data);
            seekBar.value = ((100 * video.currentTime) / video.duration);
            document.getElementById('video-currentTime' + ID).innerHTML = Math.round(video.currentTime/60) + ":" + (Math.round(video.currentTime) % 60).toString().replace(/^(\d)$/, '0$1');
            
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
    else if(!isFullscreen) {
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
            askRemoteMediaControl(windowId, "video", "seekbar", this.value, false);
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
                askRemoteMediaControl(windowId, "video", "play", "event", true);
                video.play();
            }
            else {
                this.innerHTML = "PLAY";
                askRemoteMediaControl(windowId, "video", "pause", "event", true);
                video.pause();
            }
        }
        else {
            if (video.paused) {
                this.innerHTML = "PAUSE";
                askRemoteMediaControl(windowId, "video", "play", "", false);
            }
            else {
                this.innerHTML = "PLAY";
                askRemoteMediaControl(windowId, "video", "pause", "", false);
            }
        }
    }, false);
    
    toolbar.appendChild(seekBar);
    toolbar.appendChild(play);
    toolbar.appendChild(current_time);
    toolbar.appendChild(duration);
    return toolbar;
}

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
    return canvasToDraw;
};


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
        
        
        var videoControls = createVideoControls(windowId, true, isMaster);
        videoControls.style.marginTop = "-37px";
        
        var listenerVideoTimeUpdate = function (e) {
            
            var data = { "duration": this.duration, "currentTime": this.currentTime };
            shareData(windowId, data);
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
        $("body").append(videoControls);

        var fullscreenButton = document.getElementById('close-fullscreen');
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
        
        $("#" + canvasToDraw.id).mousemove(function (e) {
            $("#fullscreen-controls-id").slideDown(200);
            $("#" + videoControls.id).slideDown(200);
            
            if (timeoutIdentifier) {
                clearTimeout(timeoutIdentifier);
            }
            timeoutIdentifier = setTimeout(function () {
                $("#" + videoControls.id).slideUp(200);
                $("#fullscreen-controls-id").slideUp(200);
            }, 2500);
        });
        
        var draw = canvasToDraw.getContext('2d');
        
        if (windowList[canvas.id].type == "pdf") {
            reloadCanvas(canvas); 
        }

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
            
            if (isMaster) {
                video.removeEventListener("timeupdate", listenerVideoTimeUpdate, false);
            }
            else {
                canvas.removeEventListener("dataupdate", listenerCanvasDataUpdate, false);
            }
            canvasToDraw.style.display = "none";
            fullWindowState = false;
            $("#fullscreen-controls-id").slideUp(1);     
            document.body.removeChild(videoControls);
            fullscreenButton.removeEventListener("mousedown", askEndFullscreen, false);
            canvas.removeEventListener("endfullscreen", endFullscreen, false);
            canvas.removeEventListener("draw", listener, false);
            
        }
        var askEndFullscreen = function (e) {
            askRemoteMediaControl(windowId, "video", "endfullscreen", "", true);
        }
        
        canvas.addEventListener('draw', listener, false);
        canvas.addEventListener('endfullscreen', endFullscreen , false)
        
        fullscreenButton.addEventListener('mousedown', askEndFullscreen , false);
    }
}



function reloadCanvas(canvas) {
    var backing_canvas = document.getElementById("backing_" + canvas.id);
    var draw = canvas.getContext('2d');
    draw.drawImage(backing_canvas, 0, 0, canvas.width, canvas.height);
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
    //var divFullscreen = document.createElement('div');
    //divFullscreen.id = "divFullscreen";
    //divFullscreen.style.display = "none";
    //divFullscreen.style.overflow = "hidden";
    //$("body").append(divFullscreen);

    var canvasFullscreen = document.createElement('canvas');
    canvasFullscreen.className = "canvasFullWindow";
    canvasFullscreen.id = "canvasFullscreen";
    canvasFullscreen.style.display = "none";
    //canvasFullscreen.style.zIndex = "1";
    $("body").append(canvasFullscreen);
}


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
    
    $(".display").on("touchstart mousedown", "label.icon-close", function (e) {
        e.currentTarget.parentElement.parentElement.parentElement.removeChild(e.currentTarget.parentElement.parentElement);
    });
    
    $(".display").on("touchstart mousedown", "label.icon-fullscreen", function (e) {
        var windowId = e.currentTarget.parentElement.parentElement.id.split('window')[1];
        var canvas = document.getElementById("canvas" + windowId);
        fullWindow(canvas);
    });
    
    $(".display").on("touchstart mousedown", "label.icon-tiled", function (e) {
        var windowId = e.currentTarget.parentElement.parentElement.id.split('window')[1];
        askSwitchToTiledDisplay(windowId);
    });
    
    
    $(".display").on("touchstart",function (e) {
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