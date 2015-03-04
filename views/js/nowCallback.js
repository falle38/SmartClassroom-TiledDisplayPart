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
    
    now.updateWindowPosition = function (windowId, top, left) {
        updateWindowPosition(windowId, top, left);
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
    
    
    shareWindowPosition = function (windowID, top, left) {
        now.shareWindowPosition(windowID, top, left);
    };
    
    shareWindow = function (windowID) {
        now.shareWindow(windowID);
    };

    streamAudioToClient = function (videoPath) {
        now.streamAudioToClient(videoPath);
    };

});