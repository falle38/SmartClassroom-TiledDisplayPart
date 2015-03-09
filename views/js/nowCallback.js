$(function () {
    now.callbackConnected = function (infos) {
        callbackConnected(infos);
    };

    askTiledDisplay = function (windowId, title, isPlayingAudio, data) {
        now.askTiledDisplay(windowId, title, isPlayingAudio, data);
    };
    now.updateData = function (windowId, data) {
        updateData(windowId, data);
    };
    
    shareData = function (windowId, data) {
        now.shareData(windowId, data);
    };

    // called from server - to update the image data just for this client page
    // the data is a base64-encoded image
    now.launchTiledDisplay = function (windowId, title, data) {
        launchTiledDisplay(windowId, title, data);
    };
    
    now.updateWindowPosition = function (windowId, orientation, top, left) {
        updateWindowPosition(windowId, orientation, top, left);
    };

    now.createSharedWindow = function (windowId, title, type) {
        createSharedWindow(windowId, title, type);
    };

    now.broadcastVideo = function (windowId, isPlayingAudio) {
        broadcastVideo(windowId, isPlayingAudio);
    };

    ReadyToReceiveVideo = function (windowId) {
        now.ReadyToReceiveVideo(windowId);
    };
    
    now.switchToTiledDisplay = function (windowId){
        switchToTiledDisplay(windowId);
    }
    
    now.switchToNormalDisplay = function (windowId) {
        switchToNormalDisplay(windowId);
    }
    
    askSwitchToTiledDisplay = function (windowId) {
        now.askSwitchToTiledDisplay(windowId);
    };
    
    // called from client - just execute one client context (host)
    askSwitchToNormalDisplay = function (windowId) {
        // update the data to the other clients other than host
        now.askSwitchToNormalDisplay(windowId);
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
    
    shareWindow = function (windowId, title, type) {
        now.shareWindow(windowId, title, type);
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