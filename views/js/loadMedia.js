//=============================================================================
// LOAD VIDEO AND SHARE IT TO OTHER CLIENTS
//=============================================================================
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
       var data = { "masterPosition": infos.position, "duration": video.duration, "currentTime": video.currentTime, "paused": video.paused };
       var canvas = createCanvas(windowId, "VIDEO", 400, 300,"video",true, true, data);
       var ctx = canvas.getContext('2d');
       ctx.drawImage(this, 0, 0, this.videoWidth, this.videoHeight);
        shareMediaDisplay(windowId, "video", "VIDEO",false, data);
    });
}


function loadInputFile(div) {
    var fileInput = document.getElementById('video-input');
    var input = document.createElement('input');
    input.type = "file";
    input.className = "upload";
}

//=============================================================================
// LOAD PDF AND SHARE IT TO OTHER CLIENTS
//=============================================================================
function loadPdf(windowId, url) {
    PDFJS.getDocument('/static/helloworld.pdf').then(function (pdf) {
        //PDFJS.disableWorker = true;
        var data = { "masterPosition":infos.position, "pdf": pdf, "currentPosition": 1, "total": pdf.numPages};
        var canvasToDraw = createCanvas(windowId, "PDF", 400, 300, "pdf", true, true, data);
        //We send data to clients without the pdf object
        data = { "currentPosition": 1, "total": pdf.numPages };
        shareMediaDisplay(windowId, "pdf", "VIDEO", false, data);

        var drawContext = canvasToDraw.getContext('2d');
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

//=============================================================================
// DISPLAY A PDF PAGE INTO CANVAS
//=============================================================================
function loadPdfPage(windowId, index) {
    var canvas = document.getElementById("canvas" + windowId);
    var data = windowList[canvas.id].data;
    data.pdf.getPage(index).then(function (page) {
        var scale = 1.5;
        var viewport = page.getViewport(scale);
        
        //
        // Prepare canvas using PDF page dimensions
        //
        var backing_canvas = document.getElementById("backing_" + canvas.id);
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
            var context = canvas.getContext('2d');
            context.drawImage(backing_canvas, 0, 0, canvas.width, canvas.height);
            shareImage(windowId, canvas.toDataURL("image/jpeg"));
        });;
    });
    data.currentPosition = index;
}


function loadSharedWindow(windowId) {
    var canvas = createCanvas(windowId, "SHARED MAIN", 400, 300, "shared", true, true);
    var rows = 2;
    //if (infos.position.j <= ((rows / 2) - 1)) {
    //    if (!windowList[canvas.id].isRotated) {
    //        windowRotation(windowId, 180);
    //    }
    //}
    shareWindow(windowId, "SHARED TEST", "shared");
    
}