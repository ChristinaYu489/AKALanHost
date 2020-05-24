function MediaRecorderWrapper() {
    var onCompleteListener = function(url, blob) {};
    var mediaRecorder;
    var localStream = null;
    var chunks = [];
    var url;

    function init(stream) {
        localStream = stream;
    }

    function startRecord() {
        if (typeof MediaRecorder.isTypeSupported == 'function') {
            if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
                var options = { mimeType: 'video/webm;codecs=vp9' };
            } else if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
                var options = { mimeType: 'video/webm;codecs=h264' };
            } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
                var options = { mimeType: 'video/webm;codecs=vp8' };
            }
            console.log(typeof localStream);
            mediaRecorder = new MediaRecorder(localStream, options);
        } else {
            mediaRecorder = new MediaRecorder(localStream);
        }
    
        mediaRecorder.ondataavailable = function(e) {
            chunks.push(e.data);
        };
    
        mediaRecorder.onstop = function() {
            var blob = new Blob(chunks, {type: "audio/webm"});
            var url = window.URL.createObjectURL(blob);
            onCompleteListener(url, blob);
            chunks = [];
        }
    
        mediaRecorder.start(10);
    }
    function stopRecord(listener) {
        onCompleteListener = listener;
        mediaRecorder.stop();
    }

    return {
        init: init,
        startRecord: startRecord,
        stopRecord: stopRecord
    };
}

var mediaRecorderWrapper = MediaRecorderWrapper();