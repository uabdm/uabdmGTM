<html>
  <head>
    <script type="text/javascript">

    // Your Client ID can be retrieved from your project in the Google
    // Developer Console, https://console.developers.google.com
    var CLIENT_ID = 659636898517-r6pov4qopv2pm7vshf0tpuf4ooeqnq7j.apps.googleusercontent.com;
    var SCOPES = [
      'https://www.googleapis.com/auth/tagmanager.manage.accounts',
      'https://www.googleapis.com/auth/tagmanager.edit.containers',
      'https://www.googleapis.com/auth/tagmanager.delete.containers',
      'https://www.googleapis.com/auth/tagmanager.edit.containerversions',
      'https://www.googleapis.com/auth/tagmanager.manage.users',
      'https://www.googleapis.com/auth/tagmanager.publish'
    ];

    // Parameter values used by the script
    ACCOUNT_PATH = TODO; // such as: 'accounts/4701785906';
    CONTAINER_NAME = 'Greetings';
    WORKSPACE_NAME = 'Example workspace';

    /**
     * Check if current user has authorization for this application.
     *
     * @param {bool} immediate Whether login should use the "immediate mode",
     *     which causes the security token to be refreshed behind the scenes
     *     with no UI.
     */
    function checkAuth(immediate) {
      var authorizeCheckPromise = new Promise((resolve) => {
        gapi.auth.authorize(
          { client_id: CLIENT_ID, scope: SCOPES.join(' '), immediate: immediate },
          resolve);
      });
      authorizeCheckPromise
          .then(handleAuthResult)
          .then(loadTagManagerApi)
          .then(runTagManagerExample)
          .catch(() => {
            console.log('You must authorize any access to the api.');
          });
    }

    /**
     * Check if current user has authorization for this application.
     */
    function checkAuth() {
      checkAuth(true);
    }

    /**
     * Initiate auth flow in response to user clicking authorize button.
     *
     * @param {Event} event Button click event.
     * @return {boolean} Returns false.
     */
    function handleAuthClick(event) {
      checkAuth();
      return false;
    }

    /**
     * Handle response from authorization server.
     *
     * @param {Object} authResult Authorization result.
     * @return {Promise} A promise to call resolve if authorize or redirect to a
     *   login flow.
     */
    function handleAuthResult(authResult) {
      return new Promise((resolve, reject) => {
        var authorizeDiv = document.getElementById('authorize-div');
        if (authResult && !authResult.error) {
          // Hide auth UI, then load client library.
          authorizeDiv.style.display = 'none';
          resolve();
        } else {
          // Show auth UI, allowing the user to initiate authorization by
          // clicking authorize button.
          authorizeDiv.style.display = 'inline';
          reject();
        }
      });
    }

    /**
     * Load Tag Manager API client library.

     * @return {Promise} A promise to load the tag manager api library.
     */
    function loadTagManagerApi() {
      return new Promise((resolve, reject) => {
        console.log('Load Tag Manager api');
        gapi.client.load('tagmanager', 'v2', resolve);
      });
    }

    /**
     * Interacts with the tagmanager api v2 to create a container,
     * workspace, trigger, and tag.
     *
     * @return {Promise} A promise to run the tag manager example.
     */
    function runTagManagerExample() {
      return new Promise((resolve, reject) => {
        console.log('Running Tag Manager Example.');
        var trigger = null;
        var workspace = null;
        findContainer(ACCOUNT_PATH, CONTAINER_NAME)
            .then(createWorkspace)
            .then((createdWorkspace) => {
              workspace = createdWorkspace;
              return createHelloWorldTrigger(workspace);
            })
            .then((createdTrigger) => {
              trigger = createdTrigger;
              return createHelloWorldTag(workspace);
            })
            .then((createdTag) => {
              return updateHelloWorldTagWithTrigger(createdTag, trigger);
            })
            .catch(handleError);
        resolve();
      });
    }

    /**
     * Returns the greetings container if it exists.
     *
     * @param {string} accountPath The account which contains the Greetings
     *     container.
     * @param {string} containerName The name of the container to find.
     * @return {Promise} A promise to find the greetings container.
     */
    function findContainer(accountPath, containerName) {
      console.log('Finding container in account:' + accountPath);
      var request = gapi.client.tagmanager.accounts.containers.list({
        'parent': accountPath
      });
      return requestPromise(request)
          .then((response) => {
            var containers = response.container || [];
            var container = containers.find(
                (container) => container.name === containerName);
            return container || Promise.reject(
                'Unable to find ' + containerName +' container.');
          });
    }

    /**
     * Creates a workspace in the Greetings container.
     *
     * @param {Object} container The container to create a new workspace.
     * @return {Promise} A promise to create a workspace.
     */
    function createWorkspace(container) {
      console.log('Creating workspace in container:' + container.path);
      var request = gapi.client.tagmanager.accounts.containers.workspaces.create(
        { 'parent': container.path },
        { name: WORKSPACE_NAME, description: 'my workspace created via api' });
      return requestPromise(request);
    }

    /**
     * Creates a page view trigger.
     *
     * @param {Object} workspace The workspace to create the trigger in.
     * @return {Promise} A promise to create a page view trigger.
     */
    function createHelloWorldTrigger(workspace) {
      console.log('Creating hello world trigger in workspace');
      var helloWorldTrigger =
          { 'name': 'Hello World Trigger', 'type': 'PAGEVIEW' };
      var request =
        gapi.client.tagmanager.accounts.containers.workspaces.triggers.create(
          { 'parent': workspace.path }, helloWorldTrigger);
      return requestPromise(request);
    }

    /**
    * Creates a universal analytics tag.
    *
    * @param {Object} workspace The workspace to create the tag
    * @return {Promise} A promise to create a hello world tag.
    */
    function createHelloWorldTag(workspace) {
      console.log('Creating hello world tag');
      var helloWorldTag = {
        'name': 'Universal Analytics Hello World',
        'type': 'ua',
        'parameter':
        [{ 'key': 'trackingId', 'type': 'template', 'value': 'UA-1234-5' }],
      };
      var request =
        gapi.client.tagmanager.accounts.containers.workspaces.tags.create(
          { 'parent': workspace.path }, helloWorldTag);
      return requestPromise(request);
    }

    /**
     * Updates a tag to fire on a particular trigger.
     *
     * @param {Object} tag The tag to update.
     * @param {Object} trigger The trigger which causes the tag to fire.
     * @return {Promise} A promise to update a tag to fire on a particular
     *    trigger.
     */
    function updateHelloWorldTagWithTrigger(tag, trigger) {
      console.log('Update hello world tag with trigger');
      tag['firingTriggerId'] = [trigger.triggerId];
      var request =
        gapi.client.tagmanager.accounts.containers.workspaces.tags.update(
          { 'path': tag.path }, tag);
      return requestPromise(request);
    }

    /**
     * Logs an error message to the console.
     *
     * @param {string|Object} error The error to log to the console.
     */
    function handleError(error) {
      console.log('Error when interacting with GTM API');
      console.log(error);
    }

    /**
     * Wraps an API request into a promise.
     *
     * @param {Object} request the API request.
     * @return {Promise} A promise to execute the api request.
     */
    function requestPromise(request) {
      return new Promise((resolve, reject) => {
        request.execute((response) => {
          if (response.code) {
            reject(response);
          }
          resolve(response);
        });
      });
    }
    </script>

    <script src="https://apis.google.com/js/client.js?onload=checkAuth">
    </script>
  </head>
  <body>
    <div id="authorize-div" style="display: none">
      <span>Authorize access to Tag Manager API</span>
      <!--Button for the user to click to initiate auth sequence -->
      <button id="authorize-button" onclick="handleAuthClick(event)">
        Authorize
      </button>
    </div>
    <pre id="output"></pre>
  </body>
</html>
