function loadVideoTiledDisplay(windowId, url) {
    var video = document.createElement('video');
    video.id = "video" + windowId;
    video.style.display = "none";
    video.src = url;
    video.autoplay = false;
    video.loop = true;
    video.muted = false;
    //getWindow(windowId).appendChild(video);
    $('body').append(video);
    console.log(video)
    video.addEventListener('loadedmetadata', function () {
        //var canvas = createCanvas(windowId, "VIDEO", this.videoWidth, this.videoHeight);
       var canvas = createCanvas(windowId, "VIDEO", 400, 300,"video",true, true);
       var ctx = canvas.getContext('2d');
       ctx.drawImage(this, 0, 0, this.videoWidth, this.videoHeight);
       var data = { "duration": video.duration, "currentTime": video.currentTime };
       askTiledDisplay(windowId, "VIDEO",false, data);
    });
}

function loadVideoNormalDisplay(windowId, url) {
    var video = document.createElement('video');
    video.id = "video" + windowId;
    video.style.display = "none";
    video.src = url;
    video.autoplay = false;
    video.loop = true;
    //video.muted = true;
    //getWindow(windowId).appendChild(video);
    $('body').append(video);

    video.addEventListener('loadedmetadata', function () {

        //var canvas = createCanvas(windowId, "VIDEO", this.videoWidth, this.videoHeight);
        //var ctx = canvas.getContext('2d');
        //ctx.drawImage(this, 0, 0, this.videoWidth, this.videoHeight);
        var canvas = createCanvas(windowId, "VIDEO", 400, 300, "video", true, true);

        var ctx = canvas.getContext('2d');
        ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
        launchVideoNormalDisplay(windowId);
    });
}

function loadInputFile(div) {
    var fileInput = document.getElementById('video-input');
    var input = document.createElement('input');
    input.type = "file";
    input.className = "upload";
}

function loadPdf(windowId, url) {

    //PDFJS.disableWorker = true;
    var canvasToDraw = createCanvas(windowId, "PDF", 400, 300, "pdf", true, true);
    var drawContext = canvasToDraw.getContext('2d');
    
    PDFJS.getDocument('/static/helloworld.pdf').then(function (pdf) {
        // Using promise to fetch the page
        pdf.getPage(1).then(function (page) {
            var scale = 1.5;
            var viewport = page.getViewport(scale);
            
            //
            // Prepare canvas using PDF page dimensions
            //
            var backing_canvas = document.getElementById("backing_" + canvasToDraw.id);
            backing_canvas.height = viewport.height;
            backing_canvas.width = viewport.width;
            var backing_context = backing_canvas.getContext('2d');
             
            //
            // Render PDF page into canvas context
            //
            var renderContext = {
                canvasContext: backing_context,
                viewport: viewport
            };
            page.render(renderContext).promise.then(function () {
                drawContext.drawImage(backing_canvas, 0, 0, canvasToDraw.width, canvasToDraw.height);
            });;
        });
    });
}

function loadSharedWindow(windowId) {
    var canvasToDraw = createCanvas(windowId, "SHARED MAIN", 400, 300, "shared", true, true);
    shareWindow(windowId, "SHARED TEST", "shared");
    
}