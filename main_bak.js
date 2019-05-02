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
                  // createFolders(containerID, workspaceIDs);
                },
                function(err) { console.error("Execute error", err); });
}

// Create folders. Make sure the client is loaded and sign-in is complete before calling this method.
/* function createFolders(getContainerID, workspaceID) {
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
*/

// Get a list of every trigger from the Cookie Consent Container
function getTriggers() {
  return gapi.client.tagmanager.accounts.containers.workspaces.triggers.list({
    "parent": "accounts/4701785906/containers/11828399/workspaces/10"
  })
      .then(function(response) {
              // Handle the results here (response.result has the parsed body).
              let triggers = response.result.trigger;
              console.log("Triggers ", triggers);
              for (let i = 0; i < triggers.length; i+=1) {
                let path = triggers[i].path;
                let containerID = triggers[i].containerId;
                let workspaceID = triggers[i].workspaceId;
                let triggerID = triggers[i].triggerId;
                let triggerName = triggers[i].name;
                let fingerPrint = triggers[i].fingerprint;
                let tagManagerUrl = triggers[i].tagManagerUrl;
                console.log("Trigger Number " + i);
                console.log(path);
                console.log(containerID);
                console.log(workspaceID);
                console.log(triggerID);
                console.log(triggerName);
                console.log(fingerPrint);
                console.log(tagManagerUrl);
              }
            },
            function(err) { console.error("Execute error", err); });
}

// Get a list of every variable from the Cookie Consent Container
function getVariables() {
  return gapi.client.tagmanager.accounts.containers.workspaces.variables.list({
    "parent": "accounts/4701785906/containers/11828399/workspaces/10"
  })
      .then(function(response) {
              // Handle the results here (response.result has the parsed body).
              console.log("Variables ", response);
            },
            function(err) { console.error("Execute error", err); });
}

// Create each trigger individually from the list retrieved from the getTriggers function
function createTriggers() {
  return gapi.client.tagmanager.accounts.containers.workspaces.triggers.create({
    "parent": "accounts/4701785906/containers/11714726/workspaces/8",
    "resource": {
      "path": "accounts/4701785906/containers/11828399/workspaces/10/triggers/5",
      "accountId": "4701785906",
      "containerId": "11828399",
      "workspaceId": "8",
      "triggerId": "5",
      "name": "Cookie Consent Marketing",
      "type": "customEvent",
      "customEventFilter": [
        {
          "type": "equals",
          "parameter": [
            {
              "type": "template",
              "key": "arg0",
              "value": "{{_event}}"
            },
            {
              "type": "template",
              "key": "arg1",
              "value": "cookieconsent_marketing"
            }
          ]
        }
      ],
      "fingerprint": "1556734655544",
      "tagManagerUrl": "https://tagmanager.google.com/#/container/accounts/4701785906/containers/11828399/workspaces/8/triggers/5?apiLink=trigger"
    }
  })
      .then(function(response) {
              // Handle the results here (response.result has the parsed body).
              console.log("Create Triggers ", response);
            },
            function(err) { console.error("Execute error", err); });
}

// Create each variable individually from the list retrieved from the getTriggers function
function createVariables() {
  return gapi.client.tagmanager.accounts.containers.workspaces.variables.create({
    "parent": "accounts/4701785906/containers/11714726/workspaces/8",
    "resource": {
      "path": "accounts/4701785906/containers/11828399/workspaces/10/variables/1",
      "accountId": "4701785906",
      "containerId": "11828399",
      "workspaceId": "10",
      "variableId": "1",
      "name": "Cookiebot.consent.marketing",
      "type": "jsm",
      "parameter": [
        {
          "type": "template",
          "key": "javascript",
          "value": "function()\n{\n  return Cookiebot.consent.marketing.toString()\n}"
        }
      ],
      "fingerprint": "1556737624368",
      "tagManagerUrl": "https://tagmanager.google.com/#/container/accounts/4701785906/containers/11828399/workspaces/10/variables/1?apiLink=variable",
      "formatValue": {}
    }
  })
      .then(function(response) {
              // Handle the results here (response.result has the parsed body).
              console.log("Create variables ", response);
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
               let workspaceID = getWorkspaceID(getContainerID);
               console.log("Workspace ID in main function" + workspaceID);
               console.log("Container ID in main function " + getContainerID);;
               //createFolders(getContainerID, workspaceID);
            }
            },
            function(err) { console.error("Execute error", err); });
}
