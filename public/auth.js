chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('recieved message: ' + request.message);
  if (request.message == 'get_user') {
    xhrWithAuth('GET',
      'https://www.googleapis.com/plus/v1/people/me',
      false,
      onUserInfoFetched);
  }
});

function xhrWithAuth(method, url, interactive, callback) {
  var access_token;

  var retry = true;

  getToken();

  function getToken() {
    chrome.identity.getAuthToken({interactive: interactive}, function(token) {
      if (chrome.runtime.lastError) {
        callback(chrome.runtime.lastError);
        return;
      }

      access_token = token;
      requestStart();
    });
  }

  function requestStart() {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.onload = requestComplete;
    xhr.send();
  }

  function requestComplete() {
    if (this.status == 401 && retry) {
      retry = false;
      chrome.identity.removeCachedAuthToken({token: access_token}, getToken);
    } else {
      console.log(this.response);
      callback(null, this.status, this.response);
    }
  }
}

function onUserInfoFetched(error, status, response) {
  if (!error && status == 200) {
    console.log('made it to user info fetched');
    console.log(response);
  } else {
    console.log('in user info fetched with error tho');
  }

  chrome.runtime.sendMessage({message: 'user', user: response});
}
