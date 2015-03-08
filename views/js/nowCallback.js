$(function () {
    now.callbackConnected = function (infos) {
        callbackConnected(infos);
    };

    askTiledDisplay = function (windowId,isPlayingAudio ,title, width, height) {
        now.askTiledDisplay(windowId, isPlayingAudio, title, width, height);
    };

    // called from server - to update the image data just for this client page
    // the data is a base64-encoded image
    now.launchTiledDisplay = function (windowId, title) {
        launchTiledDisplay(windowId, title);
    };
    
    now.updateWindowPosition = function (windowId, orientation, top, left) {
        updateWindowPosition(windowId, orientation, top, left);
    };

    now.createSharedWindow = function (windowId) {
        createSharedWindow(windowId);
    };

    now.broadcastVideo = function (windowId, isPlayingAudio) {
        broadcastVideo(windowId, isPlayingAudio);
    };

    ReadyToReceiveVideo = function (windowId) {
        now.ReadyToReceiveVideo(windowId);
    };

    ReadyToPlayAudio = function (windowId) {
        now.ReadyToPlayAudio(windowId);
    };

    now.playVideo = function () {
        playVideo();
    };

    now.playAudio = function () {
        playAudio();
    };


    // called from server - to update the image data just for this client page
    // the data is a base64-encoded image
    now.updateCanvas = function (windowId, image) {
        updateCanvas(windowId, image);
    };

    shareImage = function (windowID, image) {
        now.shareImage(windowID, image);
    };
    
    getWindowId = function () {
        return now.getWindowId();
    };
    

    shareWindowPosition = function (windowID, orientation, top, left) {
        now.shareWindowPosition(windowID, orientation, top, left);
    };
    
    shareWindow = function (windowID) {
        now.shareWindow(windowID);
    };

    streamAudioToClient = function (videoPath) {
        now.streamAudioToClient(videoPath);
    };

});

function askServerLoadVideoTiledDisplay(url) {
    now.getWindowId("video-tiled", url);
}

function askServerLoadVideoNormalDisplay(url) {
    now.getWindowId("video-normal", url);
}


function askServerLoadPdf(url) {
    now.getWindowId("pdf", url);
}

function askServerLoadSharedWindow() {
    now.getWindowId("shared");
}

now.launchWindow = function (windowId, type, url) {
    launchWindow(windowId, type, url);
};