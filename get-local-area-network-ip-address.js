// a refactoring of code found on:
//   http://net.ipcalf.com/

window.getLocalAreaNetworkIpAddress = function(timeoutMs) {
  timeoutMs = timeoutMs || 1000;

  return new Promise(function(resolve, reject) {
    // NOTE: window.RTCPeerConnection is "not a constructor" in FF22/23
    var RTCPeerConnection = /*window.RTCPeerConnection ||*/ window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

    if (RTCPeerConnection) {
      var isResolved = false;
      var timer = null;

      var ignoreAddr = {
        "0.0.0.0"   : false,
        "127.0.0.1" : false,
        "localhost" : false
      };

      var testCandidateAddress = function(newAddr) {
        if (isResolved) return;
        if (newAddr in ignoreAddr) return;

        resolve(newAddr);
        isResolved = true;

        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      };

      var grepSDP = function(sdp) {
        if (isResolved) return;

        var hosts = [];
        sdp.split('\r\n').forEach(function (line) { // c.f. http://tools.ietf.org/html/rfc4566#page-39
          if (~line.indexOf("a=candidate")) {       // http://tools.ietf.org/html/rfc4566#section-5.13
            var parts = line.split(' '),            // http://tools.ietf.org/html/rfc5245#section-15.1
                addr = parts[4],
                type = parts[7];
            if (type === 'host') testCandidateAddress(addr);
          }
          else if (~line.indexOf("c=")) {           // http://tools.ietf.org/html/rfc4566#section-5.7
            var parts = line.split(' '),
                addr = parts[2];
            testCandidateAddress(addr);
          }
        });
      };

      var rtc = new RTCPeerConnection({iceServers:[]});
      if (1 || window.mozRTCPeerConnection) {       // FF [and now Chrome!] needs a channel/stream to proceed
        rtc.createDataChannel('', {reliable:false});
      };

      rtc.onicecandidate = function (evt) {
        // convert the candidate to SDP so we can run it through our general parser
        // see https://twitter.com/lancestout/status/525796175425720320 for details
        if (evt.candidate) grepSDP("a="+evt.candidate.candidate);
      };

      rtc.createOffer(function (offerDesc) {
        grepSDP(offerDesc.sdp);
        rtc.setLocalDescription(offerDesc);
      }, function (e) {});

      timer = setTimeout(
        function() {
          reject(new Error("timeout occurred"));
          isResolved = true;
          timer = null;
        },
        timeoutMs
      );
    }
    else {
      reject(new Error("RTCPeerConnection constructor is undefined"));
    }
  });
}
