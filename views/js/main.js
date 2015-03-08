

var notHead = false;
var buttonMenuPressed = false;
//var nbWindow = 0;
var fullWindowState;

var windowList = new Object();

function addWindow(windowId, title, width, height, type) {
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
        $("#" + e.currentTarget.parentElement.id).pep({
           // constrainTo: 'parent',
            start: function (ev, obj) {
                if (notHead) {
                    $.pep.unbind($("#" + e.currentTarget.parentElement.id));
                }
                //obj.$el.css({ background : 'red'});
            },
            drag: function (ev, obj) {
                if (type == "shared") {
                    now.shareWindowPosition(windowId, infos.orientation, obj.$el.context.offsetTop, obj.$el.context.offsetLeft);
                }
            },
            
            easing: function (ev, obj) {
                if (type == "shared") {
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
    
    $("#window-header" + windowId).on("touchstart", function (evt) {
        evt.preventDefault();
        var touch = evt.changedTouches;
        console.log(evt);
        $("#" + evt.currentTarget.parentElement.id).pep({
            constrainTo: 'parent',
            start: function (ev, obj) {
                if (notHead) {
                    $.pep.unbind($("#" + evt.currentTarget.parentElement.id));
                }
                //obj.$el.css({ background : 'red'});
            },
            drag: function (ev, obj) {
                if (type == "shared") {
                    now.shareWindowPosition(windowId, obj.$el.context.offsetTop, obj.$el.context.offsetLeft);
                }
            },
            
            stop: function (ev, obj) {
                var vel = obj.velocity();
                //console.log(vel);
                
                if (vel.x > 1500 || vel.y > 1500 || vel.x < -1500 || vel.y < -1500) {
                    console.log("TABLE SUIVANTE");
                    //obj.$el.css({ background : 'green'}); 
                }
                $.pep.unbind($("#" + evt.currentTarget.parentElement.id));
            }
        });
    });
    //nbWindow++;
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
                console.log("META");
                ReadyToPlayAudio(windowId);
            }
        }
    });
    setAudioPlayer(audioplayer);
}


function getWindow(windowId) {
    return document.getElementById('window' + windowId);
}


function createFullscreenControls() {
    var toolbar = document.createElement('div');
    toolbar.className = 'fullscreen-controls transparent';
    toolbar.id = "fullscreen-controls-id";
    //toolbar.width = width;
    //toolbar.height = height;
    toolbar.style.display = "none";

    var stop_fullscreen = document.createElement('div');
    stop_fullscreen.className = 'play-video';
    stop_fullscreen.id = 'stop-fullscreen';
    stop_fullscreen.innerHTML = "Stop Fullscreen";
    
    toolbar.appendChild(stop_fullscreen);
    return toolbar;
}

function createVideoControls(windowId, isFullscreen) {
    
    if (isFullscreen) {
        var ID = "fullscreen";
    }
    else {
        var ID = windowId;
    }
    var toolbar = document.createElement('div');
    toolbar.className = 'video-controls transparent';
    toolbar.id = "video-controls" + ID;
    //toolbar.width = width;
    //toolbar.height = height;
    toolbar.style.display = "none";
    
    var video = document.getElementById("video" + windowId);
    
    
    
    var current_time = document.createElement('div');
    current_time.className = 'video-currentTime';
    current_time.id = "video-currentTime" + ID;
    current_time.innerHTML = "0";
    
    var play = document.createElement('div');
    play.className = 'play-video';
    play.id = 'play-video' + ID;
    play.innerHTML = "PLAY";
    
    var current_time2 = document.createElement('div');
    current_time2.className = 'video-time';
    current_time2.id = "video-time3";
    console.log(video.duration)
    current_time2.innerHTML = video.duration;
    
    var current_time3 = document.createElement('div');
    current_time3.className = 'video-time';
    current_time3.id = "video-time4";
    current_time3.innerHTML = "0";
    
    var current_time4 = document.createElement('div');
    current_time4.className = 'video-time';
    current_time4.id = "video-time5";
    current_time4.innerHTML = "0";
    
    var seekBar = document.createElement('input');
    seekBar.type = "range";
    seekBar.className = ' video-slider fill fill--1';
    seekBar.id = 'video-slider' + ID;
    seekBar.value = '0';
    
    styles.push('');
    
    video.addEventListener("timeupdate", function () {
        console.log("PLAY")
        seekBar.value = ((100 * video.currentTime) / video.duration);
        document.getElementById('video-currentTime' + ID).innerHTML = seekBar.value;
        var idx = seekBar.id.split('r')[1];
        
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
    
    seekBar.addEventListener('input', function () {
        video.currentTime = (this.value * video.duration) / 100;
        document.getElementById('video-currentTime' + ID).innerHTML = this.value;
        
        if (this.classList.contains('fill')) {
            styles[ID] = getFillStyle(this);
        }
        else {
            styles[ID] = '';
        }
        
        s.textContent = styles.join('');
    }, false);
    
    
    
    
    play.addEventListener('mousedown', function () {
        
        if (video.paused) {
            this.innerHTML = "PAUSE";
            video.play();
        }
        else {
            this.innerHTML = "PLAY";
            video.pause();
        }
    }, false);
    
    
    
    
    toolbar.appendChild(seekBar);
    toolbar.appendChild(play);
    toolbar.appendChild(current_time);
    
    toolbar.appendChild(current_time2);
    toolbar.appendChild(current_time3);
    toolbar.appendChild(current_time4);
    
    return toolbar;
}

function createCanvas(windowId, title, width, height, type, isMaster) {
    var canvasToDraw = document.createElement('canvas');
    canvasToDraw.id = 'canvas' + windowId;
    canvasToDraw.width = width;
    canvasToDraw.height = height;
    
    
    
    
    //$("#" + canvasToDraw.id).mouseover(
    //    function (e) {
    //        console.log("ADAM")
    //        //$('#tlbar').slideDown(200);
    //        $('#r3').slideDown(200);
    //    },
    //            function () {
    //        //$('#tlbar').slideUp(200);
    //        $('#r3').slideUp(200);
    //    }
    //);
    
    //$(toolbar.id).hover(
    //    function () {
    //        $(this).removeClass('transparent');
    //    },
    //            function () {
    //        $(this).addClass('transparent');
    //    }
    //);
    
    
    
    var backing_canvas = document.createElement("canvas");
    backing_canvas.id = "backing_" + canvasToDraw.id;
    backing_canvas.style.display = "none";
    
    //var windowDiv = addWindow(windowId, title, width + 10, height + 5, type);
    var windowDiv = addWindow(windowId, title, width, height, type);
    windowDiv.getElementsByClassName('window-form')[0].appendChild(canvasToDraw);
    windowDiv.getElementsByClassName('window-form')[0].appendChild(backing_canvas);
    
    
    if (type == "video" && isMaster) {
        var videoControls = createVideoControls(windowId, false);
        windowDiv.appendChild(videoControls);
        
        var timeoutIdentifier;
        
        $("#" + videoControls.id).mousemove(function (e) {
            if (timeoutIdentifier) {
                clearTimeout(timeoutIdentifier);
            }
            timeoutIdentifier = setTimeout(function () {
                $("#" + videoControls.id).slideUp(200);
            }, 5000);
        });
        
        $("#" + canvasToDraw.id).mousemove(function (e) {
            $("#" + videoControls.id).slideDown(200);
            
            if (timeoutIdentifier) {
                clearTimeout(timeoutIdentifier);
            }
            timeoutIdentifier = setTimeout(function () {
                $("#" + videoControls.id).slideUp(200);
            }, 5000);
        });
    
    }
    
    
    
    var media = { "type": type }
    windowList[canvasToDraw.id] = media;
    
    
    return canvasToDraw;
};


function fullWindow(canvas) {
    if (!fullWindowState) {
        fullWindowState = true;
        // Canvas goes full window
        var canvasToDraw = document.getElementById('canvasFullscreen');
        //var divFullscreen = document.getElementById('divFullscreen');
        

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
        
        
        var videoControls = createVideoControls(canvas.id.split('canvas')[1], true);
        
        //videoControls.style.marginTop = "30px";
        $("body").append(videoControls);
        
        var timeoutIdentifier;
        
        $("#" + videoControls.id).mousemove(function (e) {
            if (timeoutIdentifier) {
                clearTimeout(timeoutIdentifier);
            }
            timeoutIdentifier = setTimeout(function () {
                $("#fullscreen-controls-id").slideUp(200);
                $("#" + videoControls.id).slideUp(200);
            }, 5000);
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
            }, 5000);
        });
        
        var draw = canvasToDraw.getContext('2d');
        //saveCanvas = canvasToDraw;
        
        if (windowList[canvas.id].type == "pdf") {
            reloadCanvas(canvas); 
        }
        
        // $("body").append(canvasToDraw);
        
        window.addEventListener('resize', function (e) {
            console.log("RESIZE");
            canvasToDraw.width = window.innerWidth;
            canvasToDraw.height = window.innerHeight;
            draw.drawImage(canvas, 0, 0, canvasToDraw.width, canvasToDraw.height);
        }, false);
        
        var listener = function (e) {
            console.log("EVENT DRAW");
            draw.drawImage(canvas, 0, 0, canvasToDraw.width, canvasToDraw.height);
        }
        
        var endFullscreen = function (e) {
            console.log("END FULL");
            cancelFullScreen(document.documentElement);
            canvas.width = saveWidth;
            canvas.height = saveHeight;
            canvas.parentElement.parentElement.style.top = saveTop + "px";
            canvas.parentElement.parentElement.style.left = saveLeft + "px";
            canvas.style.display = saveDisplay;
            reloadCanvas(canvas)
            canvas.removeEventListener("draw", listener, false);
            e.currentTarget.style.display = "none";
            // $("#" + canvasToDraw.id).remove();
            fullWindowState = false;
            canvasToDraw.removeEventListener("mousedown", endFullscreen, false);
        }
        

        
        canvas.addEventListener('draw', listener, false);
        canvasToDraw.addEventListener('mousedown',endFullscreen , false);

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
        console.log("LOADING");
        var inputFile = document.getElementById('input-video-normal-display');
        var fileUrl = window.URL.createObjectURL(inputFile.files[0]);
        
        askServerLoadVideoNormalDisplay(fileUrl);
    });
    
    $(".load-tiled-display").mousedown(function (e) {
        
        var inputFile = document.getElementById('input-video-tiled-display');
        var fileUrl = window.URL.createObjectURL(inputFile.files[0]);
        console.log(inputFile.files);
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
    
    $(".display").on("mousedown", "label.icon-close", function (e) {
        e.currentTarget.parentElement.parentElement.parentElement.removeChild(e.currentTarget.parentElement.parentElement);
    });
    
    $(".display").on("mousedown", "label.icon-fullscreen", function (e) {
        var windowId = e.currentTarget.parentElement.parentElement.id.split('window')[1];
        var canvas = document.getElementById("canvas" + windowId);
        fullWindow(canvas);
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

