function loadVideoTiledDisplay(windowId, url) {
    var video = document.createElement('video');
    video.id = "video";
    video.style.display = "none";
    video.src = url;
    video.autoplay = false;
    video.loop = true;
    video.muted = false;
    $('body').append(video);
    console.log(video)
    video.addEventListener('loadedmetadata', function () {
        console.log("METADATA")
        //var canvas = createCanvas(windowId, "VIDEO", this.videoWidth, this.videoHeight);
       var canvas = createCanvas(windowId, "VIDEO", 400, 300);
       var ctx = canvas.getContext('2d');
       ctx.drawImage(this, 0, 0, this.videoWidth, this.videoHeight);
        
       askTiledDisplay(windowId, "VIDEO",false);
    });
}

function loadVideoNormalDisplay(windowId, url) {
    var video = document.createElement('video');
    video.id = "video";
    video.style.display = "none";
    video.src = url;
    video.autoplay = false;
    video.loop = true;
    //video.muted = true;
    $('body').append(video);

    video.addEventListener('loadedmetadata', function () {

        //var canvas = createCanvas(windowId, "VIDEO", this.videoWidth, this.videoHeight);
        //var ctx = canvas.getContext('2d');
        //ctx.drawImage(this, 0, 0, this.videoWidth, this.videoHeight);
        var canvas = createCanvas(windowId, url, 400, 300);
        var ctx = canvas.getContext('2d');
        ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
        launchVideoNormalDisplay(windowId);
        video.play();
    });
}

function loadInputFile(div) {
    var fileInput = document.getElementById('video-input');
    var input = document.createElement('input');
    input.type = "file";
    input.className = "upload";
    
}