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
                  let containerIDs = containerID;
                  let workspaceIDs = response.result.workspace[0].workspaceId;
                  console.log("Get Workspace Response ", response);
                  console.log("Workspace ID " + workspaceIDs);
                  // createFolders(containerIDs, workspaceIDs);
                  //getTriggers(containerIDs, workspaceIDs);
                  //getVariables(containerIDs, workspaceIDs);
                  getTags(containerIDs, workspaceIDs);
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

// Get a list of every tag from the source container
function getTags(containerIDs, workspaceIDs) {
  return gapi.client.tagmanager.accounts.containers.workspaces.tags.list({
    "parent": "accounts/4701785906/containers/11828399/workspaces/11"
  })
      .then(function(response) {
              // Handle the results here (response.result has the parsed body).
              let tags = response.result.tag;
              let i = 0;
              console.log("Tags ", response);
              function loopTags() {
                setTimeout(function () {
                  console.log("Value of i passed to loopTags" + i);
                  let path = tags[i].path;
                  let containerID = tags[i].containerId;
                  let workspaceID = tags[i].workspaceId;
                  let tagID = tags[i].tagId;
                  let tagName = tags[i].name;
                  let fingerPrint = tags[i].fingerprint;
                  let tagManagerUrl = tags[i].tagManagerUrl;
                  let value = tags[i].parameter[7].value;
                  /*
                  console.log("Trigger Number " + i);
                  console.log(path);
                  console.log(containerID);
                  console.log(workspaceID);
                  console.log(triggerID);
                  console.log(triggerName);
                  console.log(fingerPrint);
                  console.log(tagManagerUrl);
                  console.log(value);
                  */
                  console.log("Container IDs passed through to GetTags function is " + containerIDs);
                  console.log("Workspace IDs passed through to GetTags function is " + workspaceIDs);
                  createTags(containerIDs, workspaceIDs, path, containerID, workspaceID, tagID, tagName, fingerPrint, tagManagerUrl, value);
                  i++;
                  if (i < tags.length) {
                    loopTags();
                  }
                }, 60000)
            }
              loopTags();
            },
            function(err) { console.error("Execute error", err); });
}

// Get a list of every trigger from the source container
function getTriggers(containerIDs, workspaceIDs) {
  return gapi.client.tagmanager.accounts.containers.workspaces.triggers.list({
    "parent": "accounts/4701785906/containers/11828399/workspaces/11"
  })
      .then(function(response) {
              // Handle the results here (response.result has the parsed body).
              let triggers = response.result.trigger;
              let i = 0;
              console.log("Triggers ", triggers);
              function loopTriggers() {
                setTimeout(function () {
                  console.log("Value of i passed to loopTriggers" + i);
                  let path = triggers[i].path;
                  let containerID = triggers[i].containerId;
                  let workspaceID = triggers[i].workspaceId;
                  let triggerID = triggers[i].triggerId;
                  let triggerName = triggers[i].name;
                  let fingerPrint = triggers[i].fingerprint;
                  let tagManagerUrl = triggers[i].tagManagerUrl;
                  let value = triggers[i].customEventFilter[0].parameter[1].value;
                  /*
                  console.log("Trigger Number " + i);
                  console.log(path);
                  console.log(containerID);
                  console.log(workspaceID);
                  console.log(triggerID);
                  console.log(triggerName);
                  console.log(fingerPrint);
                  console.log(tagManagerUrl);
                  console.log(value);
                  */
                  console.log("Container IDs passed through to GetTriggers function is " + containerIDs);
                  console.log("Workspace IDs passed through to GetTriggers function is " + workspaceIDs);
                  createTriggers(containerIDs, workspaceIDs, path, containerID, workspaceID, triggerID, triggerName, fingerPrint, tagManagerUrl, value);
                  i++;
                  if (i < triggers.length) {
                    loopTriggers();
                  }
                }, 60000)
            }
              loopTriggers();
            },
            function(err) { console.error("Execute error", err); });
}

// Get a list of every variable from the source container
function getVariables(containerIDs, workspaceIDs) {
  return gapi.client.tagmanager.accounts.containers.workspaces.variables.list({
    "parent": "accounts/4701785906/containers/11828399/workspaces/11"
  })
      .then(function(response) {
              // Handle the results here (response.result has the parsed body).
              console.log("Response ", response);
              // Handle the results here (response.result has the parsed body).
              let variables = response.result.variable;
              let i = 0;
              console.log("Variables ", variables);
              function loopVariables() {
                setTimeout(function () {
                  console.log("Value of i passed to loopVariables" + i);
                  let path = variables[i].path;
                  let containerID = variables[i].containerId;
                  let workspaceID = variables[i].workspaceId;
                  let variableID = variables[i].variableId;
                  let variableName = variables[i].name;
                  let fingerPrint = variables[i].fingerprint;
                  let tagManagerUrl = variables[i].tagManagerUrl;
                  let value = variables[i].parameter[0].value;

                /*  console.log("Variable Number " + i);
                  console.log(path);
                  console.log(containerID);
                  console.log(workspaceID);
                  console.log(variableID);
                  console.log(variableName);
                  console.log(fingerPrint);
                  console.log(tagManagerUrl);
                  console.log(value); */

                  console.log("Container IDs passed through to getVariables function is " + containerIDs);
                  console.log("Workspace IDs passed through to getVariables function is " + workspaceIDs);
                  createVariables(containerIDs, workspaceIDs, path, containerID, workspaceID, variableID, variableName, fingerPrint, tagManagerUrl, value);
                  i++;
                  if (i < variables.length) {
                    loopVariables();
                  }
                }, 60000)
            }
              loopVariables();
            },
            function(err) { console.error("Execute error", err); });
}

// Create each tag individually from the list retrieved from the getTags function
function createTags(containerIDs, workspaceIDs, path, containerID, workspaceID, tagID, tagName, fingerPrint, tagManagerUrl, value) {
  console.log(path);
  console.log(containerIDs);
  console.log(workspaceIDs);
  console.log(tagID);
  console.log(tagName);
  console.log(fingerPrint);
  console.log(tagManagerUrl);
  console.log(value);
  return gapi.client.tagmanager.accounts.containers.workspaces.tags.create({
    "parent": `accounts/4701785906/containers/${containerIDs}/workspaces/${workspaceIDs}`,
    "resource": {
      "path": path,
      "accountId": "4701785906",
      "containerId": "11828399",
      "workspaceId": "11",
      "tagId": tagID,
      "name": tagName,
      "type": "ua",
      "parameter": [
        {
          "type": "boolean",
          "key": "nonInteraction",
          "value": "false"
        },
        {
          "type": "boolean",
          "key": "overrideGaSettings",
          "value": "true"
        },
        {
          "type": "list",
          "key": "fieldsToSet",
          "list": [
            {
              "type": "map",
              "map": [
                {
                  "type": "template",
                  "key": "fieldName",
                  "value": "cookieDomain"
                },
                {
                  "type": "template",
                  "key": "value",
                  "value": "auto"
                }
              ]
            }
          ]
        },
        {
          "type": "template",
          "key": "eventCategory",
          "value": "Videos"
        },
        {
          "type": "template",
          "key": "trackType",
          "value": "TRACK_EVENT"
        },
        {
          "type": "template",
          "key": "eventAction",
          "value": "Video Action"
        },
        {
          "type": "template",
          "key": "eventLabel",
          "value": "Video Name"
        },
        {
          "type": "template",
          "key": "trackingId",
          "value": value
        }
      ],
      "fingerprint": fingerPrint,
      "tagFiringOption": "oncePerEvent",
      "tagManagerUrl": tagManagerUrl
    }
  })
      .then(function(response) {
              // Handle the results here (response.result has the parsed body).
              console.log("Response", response);
            },
            function(err) { console.error("Execute error", err); });
}

// Create each trigger individually from the list retrieved from the getTriggers function
function createTriggers(containerIDs, workspaceIDs, path, containerID, workspaceID, triggerID, triggerName, fingerPrint, tagManagerUrl, value) {
  console.log(path);
  console.log(containerIDs);
  console.log(workspaceIDs);
  console.log(triggerID);
  console.log(triggerName);
  console.log(fingerPrint);
  console.log(tagManagerUrl);
  console.log(value);
  return gapi.client.tagmanager.accounts.containers.workspaces.triggers.create({
    "parent": `accounts/4701785906/containers/${containerIDs}/workspaces/${workspaceIDs}`,
    "resource": {
      "path": path,
      "accountId": "4701785906",
      "containerId": "11828399",
      "workspaceId": "11",
      "triggerId": triggerID,
      "name": triggerName,
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
              "value": value
            }
          ]
        }
      ],
      "fingerprint": fingerPrint,
      "tagManagerUrl": tagManagerUrl
    }
  })
      .then(function(response) {
              // Handle the results here (response.result has the parsed body).
              console.log("Create Triggers ", response);
            },
            function(err) { console.error("Execute error", err); });
}

// Create each variable individually from the list retrieved from the getTriggers function
function createVariables(containerIDs, workspaceIDs, path, containerID, workspaceID, variableID, variableName, fingerPrint, tagManagerUrl, value) {
  console.log(path);
  console.log(containerIDs);
  console.log(workspaceIDs);
  console.log(variableID);
  console.log(variableName);
  console.log(fingerPrint);
  console.log(tagManagerUrl);
  console.log(value);
  return gapi.client.tagmanager.accounts.containers.workspaces.variables.create({
    "parent": `accounts/4701785906/containers/${containerIDs}/workspaces/${workspaceIDs}`,
    "resource": {
      "path": path,
      "accountId": "4701785906",
      "containerId": "11828399",
      "workspaceId": "11",
      "variableId": variableID,
      "name": variableName,
      "type": "jsm",
      "parameter": [
        {
          "type": "template",
          "key": "javascript",
          "value": value
        }
      ],
      "fingerprint": fingerPrint,
      "tagManagerUrl": tagManagerUrl,
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
            let i = 0;
            function loopContainers() {
              setTimeout(function () {
                let getContainerID = getContainers[i].containerId;
                let workspaceID = getWorkspaceID(getContainerID);
                console.log("Container ID in main function " + getContainerID);;
                i++;
                if (i < getContainers.length) {
                  loopContainers();
                }
              }, 20000)
            }           
            loopContainers();
/*          for (let i=0; i < getContainers.length; i +=1) {
               let getContainerID = getContainers[i].containerId;
               let workspaceID = getWorkspaceID(getContainerID);
               //console.log("Workspace ID in main function" + workspaceID);
               console.log("Container ID in main function " + getContainerID);;
               //createFolders(getContainerID, workspaceID);
            } */
            },
            function(err) { console.error("Execute error", err); });
}
