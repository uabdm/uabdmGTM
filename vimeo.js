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
      apiKey: 'AIzaSyARKcDFN5GiFWl629IghB2LG4yjQu4_4KM',
      discoveryDocs: ["https://content.googleapis.com/discovery/v1/apis/tagmanager/v2/rest"],
      clientId: '145141337049-10q40jpgsup2t8vq08r4830l5dqkslfg.apps.googleusercontent.com',
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

// Get Workspace IDs of destination containers. Make sure the client is loaded and sign-in is complete before calling this method.
function getWorkspaceID(containerID) {
  return gapi.client.tagmanager.accounts.containers.workspaces.list({
        "parent": "accounts/4485174692/containers/" + containerID
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
    "parent": "accounts/4702107503/containers/12087321/workspaces/7"
  })
      .then(function(response) {
              // Handle the results here (response.result has the parsed body).
              let tags = response.result.tag;
              let i = 0;
              loopTags();
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
                  let type = tags[i].type;

                  /*
                  console.log("Tag Number " + i);
                  console.log(path);
                  console.log(containerID);
                  console.log(workspaceID);
                  console.log(tagID);
                  console.log(tagName);
                  console.log(fingerPrint);
                  console.log(tagManagerUrl);
                  console.log(type);
                  */

                  console.log("Container IDs passed through to GetTags function is " + containerIDs);
                  console.log("Workspace IDs passed through to GetTags function is " + workspaceIDs);

                  if (i === 0) {
                    //console.log("Running createCustomTag function...");
                    createCustomTag(containerIDs, workspaceIDs, path, containerID, workspaceID, tagID, tagName, fingerPrint, tagManagerUrl, type);
                  }
                  if (i === 1) {
                    //console.log("Running createEventTag function...");
                    createEventTag(containerIDs, workspaceIDs, path, containerID, workspaceID, tagID, tagName, fingerPrint, tagManagerUrl, type);
                  }

                  i++;
                  if (i < tags.length) {
                    loopTags();
                  }
                }, 60000)
            }
            },
            function(err) { console.error("Execute error", err); });
}

// Get a list of every trigger from the source container
function getTriggers(containerIDs, workspaceIDs) {
  return gapi.client.tagmanager.accounts.containers.workspaces.triggers.list({
    "parent": "accounts/4702107503/containers/12087321/workspaces/7"
  })
      .then(function(response) {
              // Handle the results here (response.result has the parsed body).
              let triggers = response.result.trigger;
              let i = 0;
              loopTriggers();
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
            },
            function(err) { console.error("Execute error", err); });
}

// Get a list of every variable from the source container
function getVariables(containerIDs, workspaceIDs) {
  return gapi.client.tagmanager.accounts.containers.workspaces.variables.list({
    "parent": "accounts/4702107503/containers/12087321/workspaces/7"
  })
      .then(function(response) {
              // Handle the results here (response.result has the parsed body).
              console.log("Response ", response);
              // Handle the results here (response.result has the parsed body).
              let variables = response.result.variable;
              let i = 0;
              loopVariables();
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
            },
            function(err) { console.error("Execute error", err); });
}

// Create custom tag individually from the list retrieved from the getTags function
function createCustomTag(containerIDs, workspaceIDs, path, containerID, workspaceID, tagID, tagName, fingerPrint, tagManagerUrl, type) {
  console.log("Run createCustomTag function...");
  console.log(path);
  console.log(containerIDs);
  console.log(workspaceIDs);
  console.log(tagID);
  console.log(tagName);
  console.log(fingerPrint);
  console.log(tagManagerUrl);
  console.log(type);
  return gapi.client.tagmanager.accounts.containers.workspaces.tags.create({
    "parent": `accounts/4485174692/containers/${containerIDs}/workspaces/${workspaceIDs}`,
    "resource": {
      "path": path,
      "accountId": "4702107503",
      "containerId": "12087321",
      "workspaceId": "7",
      "tagId": tagID,
      "name": tagName,
      "type": type,
      "parameter": [
        {
          "type": "template",
          "key": "html",
          "value": "<script type=\"text/javascript\" id=\"gtm-vimeo-tracking\">\n;(function(document, window, config) {\n\n  'use strict';\n  // The API won't work on LT IE9, so we bail if we detect those UAs\n  if (navigator.userAgent.match(/MSIE [678]\\./gi)) return;\n\n  config = cleanConfig(config);\n\n  var handle = getHandler(config.syntax);\n\n  if (document.readyState !== 'loading') {\n\n    init();\n\n  } else {\n\n    document.addEventListener('DOMContentLoaded', init);\n\n  }\n\n\t// Watch for new iframes popping in\n\tdocument.addEventListener('load', init, true);\n\n  function init() {\n\n    var videos = filter_(selectAllTags_('iframe'), isVimeo);\n\n    if (!videos.length) return;\n\n    loadApi(function() {\n\n      forEach_(videos, listenTo);\n\n    });\n\n  }\n\n  function isVimeo(el) {\n\n    return el.src.indexOf('player.vimeo.com/video/') &gt; -1;\n\n  }\n\n  function loadApi(callback) {\n\n    if (isUndefined_(window.Vimeo)) {\n\n      loadScript('https://player.vimeo.com/api/player.js', callback);\n\n    } else {\n\n      callback();\n\n    }\n\n  }\n\n  function listenTo(el) {\n\n    if (el.__vimeoTracked) return;\n\n    el.__vimeoTracked = true;\n\n    var video = new Vimeo.Player(el);\n    var percentages = config._track.percentages;\n    var eventNameDict = {\n\t\t\t'Play': 'play',\n\t\t\t'Pause': 'pause',\n\t\t\t'Watch to End': 'ended'\n\t\t};\n    var cache = {};\n\n    video.getVideoTitle()\n      .then(function(title) {\n\n\t\t\t\tforEach_(['Play', 'Pause', 'Watch to End'], function(key) {\n\n\t\t\t\t\tif (config.events[key]) {\n\n\t\t\t\t\t\tvideo.on(eventNameDict[key], function() {\n\n\t\t\t\t\t\t\thandle(key, title);\n\n\t\t\t\t\t\t});\n\n\t\t\t\t\t}\n\n\t\t\t\t});\n\n\t\t\t\tif (percentages) {\n\n\t        video.on('timeupdate', function(evt) {\n\n\t          var percentage = evt.percent;\n\t          var key;\n\n\t          for (key in percentages) {\n\n\t            if (percentage &gt;= percentages[key] && !cache[key]) {\n\n\t              cache[key] = true;\n\t              handle(key, title);\n\n\t            }\n\n\t          }\n\n\t        });\n\n\t\t\t\t}\n\n      });\n\n  }\n\n  function cleanConfig(config) {\n\n    config = extend_({}, {\n      events: {\n        'Play': true,\n        'Pause': true,\n        'Watch to End': true\n      },\n      percentages: {\n        each: [],\n        every: []\n     }\n    }, config);\n\n    forEach_(['each', 'every'], function(setting) {\n\n      var vals = config.percentages[setting];\n\n      if (!isArray_(vals)) vals = [vals];\n\n      if (vals) config.percentages[setting] = map_(vals, Number);\n\n    });\n\n    var points = [].concat(config.percentages.each);\n\n    if (config.percentages.every) {\n\n      forEach_(config.percentages.every, function(val) {\n\n        var n = 100 / val;\n        var every = [];\n        var i;\n\n        for (i = 1; i &lt; n; i++) every.push(val * i);\n\n        points = points.concat(filter_(every, function(val) {\n\n          return val &gt; 0.0 && val &lt; 100.0;\n\n        }));\n\n      });\n\n    }\n\n    var percentages = reduce_(points, function(prev, curr) {\n\n      prev[curr + '%'] = curr / 100.0;\n      return prev;\n\n    }, {});\n\n    config._track = {\n      percentages: percentages\n    };\n\n    return config;\n\n  }\n\n  function getHandler(syntax) {\n\n    syntax = syntax || {};\n\n    var gtmGlobal = syntax.name || 'dataLayer';\n    var uaGlobal = syntax.name || window.GoogleAnalyticsObject || 'ga';\n    var clGlobal = '_gaq';\n    var dataLayer;\n\n    var handlers = {\n      'gtm': function(state, title) {\n\n        dataLayer.push({\n          event: 'vimeoTrack',\n          attributes: {\n            videoAction: state,\n            videoName: title\n          }\n        });\n\n      },\n      'cl': function(state, title) {\n\n        window[clGlobal].push(['_trackEvent', 'Videos', state, title]);\n\n      },\n      'ua': function(state, title) {\n\n        window[uaGlobal]('send', 'event', 'Videos', state, title);\n\n      }\n    };\n\n    switch(syntax.type) {\n\n      case 'gtm':\n\n        dataLayer = window[gtmGlobal] = window[gtmGlobal] || [];\n        break;\n\n      case 'ua':\n\n        window[uaGlobal] = window[uaGlobal] || function() {\n\n          (window[uaGlobal].q = window[uaGlobal].q || []).push(arguments);\n\n        };\n        window[uaGlobal].l = +new Date();\n        break;\n\n      case 'cl':\n\n        window[clGlobal] = window[clGlobal] || [];\n        break;\n\n      default:\n\n        if (!isUndefined_(window[gtmGlobal])) {\n\n          syntax.type = 'gtm';\n          dataLayer = window[gtmGlobal] = window[gtmGlobal] || [];\n\n        } else if (uaGlobal&& !isUndefined_(window[uaGlobal])) {\n\n          syntax.type = 'ua';\n\n        } else if (!isUndefined_(window[clGlobal]) && !isUndefined_(window[clGlobal].push)) {\n\n          syntax.type = 'cl';\n\n        }\n        break;\n    }\n\n    return handlers[syntax.type];\n\n  }\n\n  function extend_() {\n\n    var args = [].slice.call(arguments);\n    var dst = args.shift();\n    var src;\n    var key;\n    var i;\n\n    for (i = 0; i &lt; args.length; i++) {\n\n      src = args[i];\n\n      for (key in src) {\n\n        dst[key] = src[key];\n\n      }\n\n    }\n\n    return dst;\n\n  }\n\n  function isArray_(o) {\n\n    if (Array.isArray_) return Array.isArray_(o);\n\n    return Object.prototype.toString.call(o) === '[object Array]';\n\n  }\n\n  function forEach_(arr, fn) {\n\n    if (Array.prototype.forEach_) return arr.forEach.call(arr, fn);\n\n    var i;\n\n    for (i = 0; i &lt; arr.length; i++) {\n\n      fn.call(window, arr[i], i, arr);\n\n    }\n\n  }\n\n  function map_(arr, fn) {\n\n    if (Array.prototype.map_) return arr.map.call(arr, fn);\n\n    var newArr = [];\n\n    forEach_(arr, function(el, ind, arr) {\n\n      newArr.push(fn.call(window, el, ind, arr));\n\n    });\n\n    return newArr;\n\n  }\n\n\n  function filter_(arr, fn) {\n\n    if (Array.prototype.filter) return arr.filter.call(arr, fn);\n\n    var newArr = [];\n\n    forEach_(arr, function(el, ind, arr) {\n\n      if (fn.call(window, el, ind, arr)) newArr.push(el);\n\n    });\n\n    return newArr;\n\n  }\n\n  function reduce_(arr, fn, init) {\n\n    if (Array.prototype.reduce) return arr.reduce.call(arr, fn, init);\n\n    var result = init;\n    var el;\n    var i;\n\n    for (i = 0; i &lt; arr.length; i++) {\n\n      el = arr[i];\n      result = fn.call(window, result, el, arr, i);\n\n    }\n\n    return result;\n\n  }\n\n  function isUndefined_(thing) {\n\n    return typeof thing === 'undefined';\n\n  }\n\n  function selectAllTags_(tags) {\n\n    if (!isArray_(tags)) tags = [tags];\n\n    return [].slice.call(document.querySelectorAll(tags.join()));\n\n  }\n\n  function loadScript(src, callback) {\n\n    var f, s;\n\n    f = document.getElementsByTagName('script')[0];\n    s = document.createElement('script');\n    s.onload = callCallback;\n    s.src = src;\n    s.async = true;\n\n    f.parentNode.insertBefore(s, f);\n\n    function callCallback() {\n\n      if (callback) {\n\n        callback();\n        s.onload = null;\n\n      }\n\n    }\n\n  }\n\n})(document, window, {\n  'events': {\n    'Play': true,\n    'Pause': true,\n    'Watch to End': true\n  },\n  'percentages': {\n    'every': 25,\n    'each': [10, 90]\n  }\n});\n/*\n * Configuration Details\n *\n * @property events object\n * Defines which events emitted by YouTube API\n * will be turned into Google Analytics or GTM events\n *\n * @property percentages object\n * Object with configurations for percentage viewed events\n *\n *   @property each Array|Number|String\n *   Fires an event once each percentage ahs been reached\n *\n *   @property every Array|Number|String\n *   Fires an event for every n% viewed\n *\n * @property syntax object\n * Object with configurations for syntax\n *\n *   @property type ('gtm'|'cl'|'ua')\n *   Forces script to use GTM ('gtm'), Universal Analytics ('ul'), or\n *   Classic Analytics ('cl'); defaults to auto-detection\n *\n *   @property name string\n *   THIS IS USUALLY UNNECESSARY! Optionally instantiate command queue for syntax\n *   in question. Useful if the tracking library and tracked events can fire\n *   before GTM or Google Analytics can be loaded. Be careful with this setting\n *   if you're new to GA/GTM. GTM or Universal Analytics Only!\n */\n/*\n * v1.0.2\n * Created by the Google Analytics consultants at http://www.lunametrics.com\n * Written by @notdanwilkerson\n * Documentation: https://github.com/lunametrics/vimeo-google-analytics/\n * Licensed under the MIT License\n */\n</script>;"
        },
        {
          "type": "boolean",
          "key": "supportDocumentWrite",
          "value": "false"
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

// Create event tag individually from the list retrieved from the getTags function
function createEventTag(containerIDs, workspaceIDs, path, containerID, workspaceID, tagID, tagName, fingerPrint, tagManagerUrl, type) {
  console.log("Run createEventTag function...");
  console.log(path);
  console.log(containerIDs);
  console.log(workspaceIDs);
  console.log(tagID);
  console.log(tagName);
  console.log(fingerPrint);
  console.log(tagManagerUrl);
  console.log(type);
  return gapi.client.tagmanager.accounts.containers.workspaces.tags.create({
    "parent": `accounts/4485174692/containers/${containerIDs}/workspaces/${workspaceIDs}`,
    "resource": {
      "path": path,
      "accountId": "4702107503",
      "containerId": "12087321",
      "workspaceId": "7",
      "tagId": tagID,
      "name": tagName,
      "type": type,
      "parameter": [
        {
          "type": "boolean",
          "key": "nonInteraction",
          "value": "false"
        },
        {
          "type": "template",
          "key": "useDebugVersion",
          "value": "{{Debug Mode}}"
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
          "value": "{{DLV - Video Action}}"
        },
        {
          "type": "template",
          "key": "eventLabel",
          "value": "{{DLV - Video Name}}"
        },
        {
          "type": "boolean",
          "key": "overrideGaSettings",
          "value": "true"
        },
        {
          "type": "boolean",
          "key": "setTrackerName",
          "value": "false"
        },
        {
          "type": "boolean",
          "key": "doubleClick",
          "value": "false"
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
          "type": "boolean",
          "key": "enableLinkId",
          "value": "false"
        },
        {
          "type": "boolean",
          "key": "enableEcommerce",
          "value": "false"
        },
        {
          "type": "template",
          "key": "trackingId",
          "value": "UA-12345678-9"
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
    "parent": `accounts/4485174692/containers/${containerIDs}/workspaces/${workspaceIDs}`,
    "resource": {
      "path": path,
      "accountId": "4702107503",
      "containerId": "12087321",
      "workspaceId": "7",
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
    "parent": `accounts/4485174692/containers/${containerIDs}/workspaces/${workspaceIDs}`,
    "resource": {
      "path": path,
      "accountId": "4702107503",
      "containerId": "12087321",
      "workspaceId": "7",
      "variableId": variableID,
      "name": variableName,
      "type": "v",
      "parameter": [
          {
            "type": "boolean",
            "key": "setDefaultValue",
            "value": "false"
          },
          {
            "type": "integer",
            "key": "dataLayerVersion",
            "value": "2"
          },
          {
            "type": "template",
            "key": "name",
            "value": value
          }
        ],
      "fingerprint": fingerPrint,
      "tagManagerUrl": tagManagerUrl
    }
  })
      .then(function(response) {
              // Handle the results here (response.result has the parsed body).
              console.log("Create variables ", response);
            },
            function(err) { console.error("Execute error", err); });
}

//  Get Container IDs of desination containers. Make sure the client is loaded and sign-in is complete before calling this method.
function execute() {
  return gapi.client.tagmanager.accounts.containers.list({
    "parent": "/accounts/4485174692"
  })
      .then(function(response) {
            // Handle the results here (response.result has the parsed body).
            console.log("Response", response);
            const getContainers = response.result.container;
            console.log(getContainers);
            let i = 0;
            loopContainers();
            function loopContainers() {
              setTimeout(function () {
                let getContainerID = getContainers[i].containerId;
                let workspaceID = getWorkspaceID(getContainerID);
                console.log("Container ID in main function " + getContainerID);;
                i++;
                if (i < getContainers.length) {
                  loopContainers();
                }
              }, 60000)
            }
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
