/* 

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
      scope: 'https://www.googleapis.com/auth/tagmanager.edit.containers https://www.googleapis.com/auth/tagmanager.delete.containers'
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

*/

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
    let i = 1;
    console.log("Value of i is " + i);
    function loopContainers() {
      setTimeout(function () {
        console.log("Value of i passed to loopContainers " + i);
        let containerName = "Container " + i;
        console.log(containerName);
        createContainers(containerName);
        i++;
        if (i < 25) {
      	   loopContainers();
        }
      }, 10000)
    }
    loopContainers();
}

// Delete containers
function deleteContainers(containerID) {
  console.log("Container ID passed to delete function " + containerID);
  return gapi.client.tagmanager.accounts.containers.delete({
    "path": `accounts/4701785906/containers/${containerID}`
  })
      .then(function(response) {
              // Handle the results here (response.result has the parsed body).
              console.log("Response", response);
            },
            function(err) { console.error("Execute error", err); });
}

function removeContainers() {
  return gapi.client.tagmanager.accounts.containers.list({
    "parent": "/accounts/4701785906"
  })
      .then(function(response) {
            // Handle the results here (response.result has the parsed body).
            console.log("Response", response);
            const getContainers = response.result.container;
            console.log(getContainers);
            let i = 0;
            function loopRemoveContainers() {
              setTimeout(function () {
            		let getContainerID = getContainers[i].containerId;
            		if (getContainerID != 11828399) {
            		  deleteContainers(getContainerID);
            		}
                i++;
                if (i < getContainers.length) {
              	   loopRemoveContainers();
                }
              }, 10000)
            }
            loopRemoveContainers();
            },
            function(err) { console.error("Execute error", err); });
}
