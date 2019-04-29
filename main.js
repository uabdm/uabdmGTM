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

// Get Workspace. Make sure the client is loaded and sign-in is complete before calling this method.
function getWorkspaceID(containerID) {
  return gapi.client.tagmanager.accounts.containers.workspaces.list({
        "parent": "accounts/4701785906/containers/" + containerID
      })
          .then(function(response) {
                  // Handle the results here (response.result has the parsed body).
                  let workspaceIDs = response.result.workspace[0].workspaceId;
                  console.log("Get Workspace Response ", response);
                  console.log("Workspace ID " + workspaceIDs);
                  return workspaceIDs;
                },
                function(err) { console.error("Execute error", err); });
}

// Create folders. Make sure the client is loaded and sign-in is complete before calling this method.
function createFolders(getContainerID, workspaceID) {
  let containerID = getContainerID;
  console.log("Create Folders " + containerID);
  console.log("Wokspace ID output in folders function " + workspaceID);
  return gapi.client.tagmanager.accounts.containers.workspaces.folders.create({
    "parent": "accounts/4701785906/containers/" + containerID + "/workspaces/" + workspaceID,
    "resource": {
      "path": "accounts/4701785906/containers/11714274/workspaces/16/folders/15",
      "accountId": "4701785906",
      "containerId": "11714274",
      "workspaceId": "16",
      "folderId": "15",
      "name": "Cookie Consent",
      "fingerprint": "1555780534108",
      "tagManagerUrl": "https://tagmanager.google.com/#/container/accounts/4701785906/containers/11714274/workspaces/16/folders?apiLink=folder"
    }
  })
      .then(function(response) {
              // Handle the results here (response.result has the parsed body).
              console.log("Response", response);
            },
            function(err) { console.error("Execute error", err); });
}


//  Get Container IDs. Make sure the client is loaded and sign-in is complete before calling this method.
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
               let getContainerID = getContainers[i].containerId;
               console.log("Container ID in main function " + getContainerID);
               let workspaceID = getWorkspaceID(getContainerID);
               console.log("Workspace ID main function" + workspaceID);
               createFolders(getContainerID, workspaceID);
            }
            },
            function(err) { console.error("Execute error", err); });
}
