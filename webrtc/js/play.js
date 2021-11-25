'use strict';
var playBtn = document.getElementById('play');
var stopBtn = document.getElementById('stop');

stopBtn.disabled = true;

playBtn.onclick = play;
stopBtn.onclick = stop;

var pc;

function play() {
	var signal_url = document.getElementById('signal_url').value;
	if (signal_url === '') {
		alert("need signal_url");
		document.getElementById('signal_url').focus();
		return;
	}
	playBtn.disabled = true;
	stopBtn.disabled = false;

	trace('Start play');

	var offerSdpOption = {
		offerToReceiveAudio: true,
		offerToReceiveVideo: true
	};

	pc = new RTCPeerConnection(null);
	pc.addTransceiver("audio", {direction: "recvonly"});
    pc.addTransceiver("video", {direction: "recvonly"});
	pc.onicecandidate = function(e) {
		onIceCandidate(pc, e);
	};
	pc.oniceconnectionstatechange = function(e) {
		onIceStateChange(pc, e);
	};
	pc.onaddstream = gotRemoteStream;

	pc.createOffer(offerSdpOption).then(function(offer) {
	trace("createOffer:\n"+offer.sdp);

	pc.setLocalDescription(offer);
	var version = "v1.0";
	var sessionId = "sessionid_test";
	var url = signal_url; 
	var request = {
		version: version,
		sessionId:  sessionId,
		localSdp: offer
	};

	$.ajax({
		type: "post",
		url: url,
		data: JSON.stringify(request),
		//contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: play_success,
		crossDomain: true
	});

	function play_success(data) {		
		if (data.code != 200) {
			trace("play failed, code:" + data.code);
			stop();
			return;
		}

		var remoteSdp = data.remoteSdp;
		trace("receive answer:\n" + remoteSdp.sdp);

		pc.setRemoteDescription(
			new RTCSessionDescription(remoteSdp),
				function() {
					trace("setRemoteDescription success!");
				},
				function(e) {
					trace("setRemoteDescription failed, message:" + e.message);
				}
			);
		}
	}).catch(function(reason) {
		trace('create offer failed, reason:' + reason);
	});
}

function onIceCandidate(pc, event) {
    trace('ICE candidate: \n' + (event.candidate ? event.candidate.candidate : '(null)'));
}

function onIceStateChange(pc, event) {
    if (pc) {
        if (pc.iceConnectionState == 'disconnected') {
            stop();
        }
        trace('ICE state: ' + pc.iceConnectionState);
        console.log('ICE state change event: ', event);
    }
}

function gotRemoteStream(e) {
    var remoteVideo = document.getElementById('video');
    remoteVideo.srcObject = e.stream;
    trace('Received remote stream');
}

function stop() {
    trace('Stop play');

    pc.close();
    pc = null;

    stopBtn.disabled = true;
    playBtn.disabled = false;
}