import * as Msal from "msal";

// An authentication service that uses the MSAL.js library to sign in users with
// either an AAD or MSA account. This leverages the AAD v2 endpoint.
class MsalAuthService {
  constructor() {
    let redirectUri = window.location.origin;

    this.applicationConfig = {
      clientID: "36b1586d-b1da-45d2-9b32-899c3757b6f8"
    };

    this.app = new Msal.UserAgentApplication(
      this.applicationConfig.clientID,
      "",
      () => {
        // callback for login redirect
      },
      {
        redirectUri
      }
    );
  }

  isCallback = () => {
    return this.app.isCallback(window.location.hash);
  };

  login = () => {
    return this.app
      .loginPopup([this.applicationConfig.clientID])
      .then(idToken => {
        return this.app.getUser();
      });
  };

  logout = () => {
    this.app.logout();
  };

  getUser = () => {
    return Promise.resolve(this.app.getUser());
  };

  getToken = () => {
    return this.app
      .acquireTokenSilent([this.applicationConfig.clientID])
      .catch(error => {
        return this.app
          .acquireTokenPopup([this.applicationConfig.clientID])
          .then(accessToken => {
            return accessToken;
          })
          .catch(error => {
            console.error(error);
          });
      });
  };
}

export default MsalAuthService;