const authorizeButton = document.getElementById('authorize-button');
const signoutButton = document.getElementById('signout-button');
const content = document.getElementById('content');
const channelForm = document.getElementById('channel-form');
const channelInput = document.getElementById('channel-input');
const videoContainer = document.getElementById('video-container');

//Load auth2 library
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  // Initialize the client with API key and People API, and initialize OAuth with an
  // OAuth 2.0 client ID and scopes (space delimited string) to request access.
  gapi.client.init({
      apiKey: 'AIzaSyDuDvkZ-vE52s-6QEc3HjWCg_KQULlkSWM',
      discoveryDocs: ["https://content.googleapis.com/discovery/v1/apis/tagmanager/v2/rest"],
      clientId: '659636898517-r6pov4qopv2pm7vshf0tpuf4ooeqnq7j.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/tagmanager.edit.containers'
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  });
}

// Update UI sign in state changes
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      authorizeButton.style.display = 'none';
      signoutButton.style.display = 'block';
      content.style.display = 'block';
      videoContainer.style.display = 'block';
      console.log("signed in");
    } else {
      authorizeButton.style.display = 'block';
      signoutButton.style.display = 'none';
      content.style.display = 'none';
      videoContainer.style.display = 'none';
      console.log("signed out");
    }
}

// Handle login
authorizeButton.addEventListener("click", function(){
  gapi.auth2.getAuthInstance().signIn();
});

// Handle logout
signoutButton.addEventListener("click", function(){
  gapi.auth2.getAuthInstance().signOut();
});

// Make sure the client is loaded and sign-in is complete before calling this method.
function execute() {
  return gapi.client.tagmanager.accounts.containers.list({
    "parent": "/accounts/4701785906"
  })
      .then(function(response) {
            // Handle the results here (response.result has the parsed body).
            console.log("Response", response);
            const getContainers = response.result.container;
            console.log(getContainers);
            for (let i=0; i < getContainers.length; i +=1) {
               console.log(getContainers[i].containerId);
            }
            },
            function(err) { console.error("Execute error", err); });
 }