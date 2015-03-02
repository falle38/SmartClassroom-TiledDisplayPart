

var notHead = false;
var buttonMenuPressed = false;
var nbWindow = 0;
var fullWindowState;

var windowList = new Object();

function addWindow(windowId, title, width, height) {
    // Your existing code unmodified...
    var windowDiv = document.createElement('div');
    windowDiv.className = 'window pepo';
    windowDiv.id = 'window' + windowId;
    windowDiv.style.width = width + "px";
    var windowHeader = document.createElement('header');
    windowHeader.className = 'window-header';
    windowHeader.id = 'window-header' + windowId;

    var iconPrevA = document.createElement('a');
    iconPrevA.className = 'icon-prev';

    var iconCloseA = document.createElement('a');
    iconCloseA.className = 'icon-close';
    iconCloseA.innerHTML = "x";
    var WindowNameH2 = document.createElement('h2');
    WindowNameH2.innerHTML = title;

    windowHeader.appendChild(iconPrevA);
    windowHeader.appendChild(iconCloseA);
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
            constrainTo: 'parent',
            start: function (ev, obj) {
                if (notHead) {
                    $.pep.unbind($("#" + e.currentTarget.parentElement.id));
                }
                //obj.$el.css({ background : 'red'});
            },
            drag: function (ev, obj) {

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
    nbWindow++;
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

function createCanvas(windowId,title, width, height, type) {
    var canvasToDraw = document.createElement('canvas');
    canvasToDraw.id = 'canvas' + windowId;
    canvasToDraw.width = width;
    canvasToDraw.height = height;
    
    var backing_canvas = document.createElement("canvas");
    backing_canvas.id = "backing_" + canvasToDraw.id;
    backing_canvas.style.display = "none";

    var windowDiv = addWindow(windowId, title, width + 10, height + 5);
    windowDiv.getElementsByClassName('window-form')[0].appendChild(canvasToDraw);
    windowDiv.getElementsByClassName('window-form')[0].appendChild(backing_canvas);
    $("#" + canvasToDraw.id).mousedown(function (e) {
        console.log("FULLWINDOW");
        fullWindow(e.currentTarget);
    });
    
  
    


    var media = {"type":type} 
    windowList[canvasToDraw.id] = media;
    

    return canvasToDraw;
};


function fullWindow(canvas) {
    if (!fullWindowState) {
        fullWindowState = true;
        // Canvas goes full window
        var canvasToDraw = document.createElement('canvas');
        canvasToDraw.className = "canvasFullWindow";
        canvasToDraw.id = "canvasFullscreen";
        //wrapper.className = "wrapperFullfullWindow";
        

        launchFullScreen(document.documentElement);

        saveWidth = canvas.width
        saveHeight = canvas.height
        saveDisplay = canvas.style.display;


        canvasToDraw.width = window.innerWidth;
        canvasToDraw.height = window.innerHeight;

        canvas.style.display = "none";
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        

        console.log(window);
        var draw = canvasToDraw.getContext('2d');
        //saveCanvas = canvasToDraw;
        
        if (windowList[canvas.id].type == "pdf") {
            reloadCanvas(canvas);
           
        }

        $("body").append(canvasToDraw);

        window.addEventListener('resize', function (e) {
            console.log("RESIZE");
            canvasToDraw.width = window.innerWidth;
            canvasToDraw.height = window.innerHeight;
            draw.drawImage(canvas, 0, 0, canvasToDraw.width, canvasToDraw.height);
        }, false);

        canvas.addEventListener('draw', function (e) {
            console.log("EVENT DRAW");
            draw.drawImage(canvas, 0, 0, canvasToDraw.width, canvasToDraw.height);

        }, false);

        canvasToDraw.addEventListener('mousedown', function (e) {
            cancelFullScreen(document.documentElement);
            canvas.width = saveWidth;
            canvas.height = saveHeight;
            canvas.style.display = saveDisplay;
            reloadCanvas(canvas)
            $("#" + canvasToDraw.id).remove();
            fullWindowState = false;
        }, false);

    }
}

function reloadCanvas(canvas){
    var backing_canvas = document.getElementById("backing_" + canvas.id);
    var draw = canvas.getContext('2d');
    draw.drawImage(backing_canvas, 0, 0, canvas.width, canvas.height);
}

function launchFullScreen(element) {
    if (element.requestFullscreen)
    { element.requestFullscreen(); }
    else if (element.mozRequestFullScreen)
    { element.mozRequestFullScreen(); }
    else if (element.webkitRequestFullscreen)
    { element.webkitRequestFullscreen(); }
    else if (element.msRequestFullscreen)
    { element.msRequestFullscreen(); }
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

function initializeEventListener() {

    $("#buttonAddWindow").mousedown(function (e) {
        console.log("MAIN");
        buttonMenuPressed = true;
    });

    $("#buttonAddWindow").mouseup(function (e) {
        if (buttonMenuPressed) {
            addWindow(nbWindow, "SUDOKU", 400, 200);
            buttonMenuPressed = false;
        }
    });

    $("#buttonloadvideo").mousedown(function (e) {
        buttonmenupressed = true;
    });

    $(".load-normal-display").mousedown(function (e) {
        console.log("LOADING");
        var inputFile = document.getElementById('input-video-normal-display');
        var fileUrl = window.URL.createObjectURL(inputFile.files[0]);
        
        loadVideoNormalDisplay(nbWindow, fileUrl);
    });

    $(".load-tiled-display").mousedown(function (e) {
        
        var inputFile =document.getElementById('input-video-tiled-display');
        var fileUrl = window.URL.createObjectURL(inputFile.files[0]);
        console.log(inputFile.files);
        loadVideoTiledDisplay(nbWindow, fileUrl);
    });
    
    $(".load-pdf").mousedown(function (e) {
        
        var inputFile = document.getElementById('input-pdf');
        var fileUrl = window.URL.createObjectURL(inputFile.files[0]);
        loadPdf(nbWindow, fileUrl);
    });

    $("#buttonLoadVideo").mouseup(function (e) {
        if (buttonMenuPressed) {
            console.log("PRESSED");
            loadVideo(nbWindow, "/static/snk.mp4");
            buttonMenuPressed = false;
        }
    });

    $(".display").on("mousedown", "a.icon-close", function (e) {
        notHead = true;
    });

    $(".display").on("mouseup", "a.icon-close", function (e) {
        e.currentTarget.parentElement.parentElement.parentElement.removeChild(e.currentTarget.parentElement.parentElement);
    });

    $(".display").mouseup(function (e) {
        notHead = false;
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