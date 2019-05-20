const authorizeButton = document.getElementById('authorize-button');
const signoutButton = document.getElementById('signout-button');

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
      console.log("signed in");
    } else {
      authorizeButton.style.display = 'block';
      signoutButton.style.display = 'none';
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

// Create Containers
function createContainers(containerName) {
    console.log(containerName);
    return gapi.client.tagmanager.accounts.containers.create({
      "parent": "accounts/4701785906",
      "resource": {
        "name": containerName,
        "usageContext": [
          "web"
        ]
      }
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
              },
              function(err) { console.error("Execute error", err); });
  }

function addContainers() {
    let i = 6;
    function loopContainers() {
      setTimeout(function () {
        i++;
        if (i < 15) {
      	loopContainers();
        }
      }, 10000)
    loopContainers();
  }
}
