import React, { Component } from "react";
import { Persona, ActionButton } from "office-ui-fabric-react";
import initials from "initials";
import authService from "../services/auth.service";

/**
 * This component is responsible for:
 * 1. Fetching the user's profile image via a call to /api/user/image
 * 2. Rendering the user's persona with their image or initials as well as full name
 * 3. Opening a context menu when the persona is clicked that allows the user to sign out
 */
class UserTile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: props.user.name,
      userFirstName: props.user.given_name,
      userInitials: initials(props.user.name),
      userObjectId: props.user.oid
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.oid !== this.state.userObjectId) {
      this.setState({
        userName: nextProps.user.given_name,
        userInitials: initials(nextProps.user.profile.name),
        userObjectId: nextProps.user.oid,
        userImage: null
      });
    }
  }

  componentDidMount() {
    this.loadUserImage();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.userImage === null) {
      this.loadUserImage();
    }
  }

  loadUserImage() {
    authService
      .fetch("/api/user/image")
      .then(result => {
        if (result.status !== 200) {
          return new Promise((resolve, reject) => {
            // TODO: Figure out how to reliably log fetch errors
            // result.json().then(json => reject(JSON.stringify(json)));
            reject(`Failed to fetch image; error code: ${result.status}`);
          });
        } else {
          return result.blob();
        }
      })
      .then(blob => {
        const reader = new FileReader();
        reader.onload = () => {
          this.setState({ userImage: reader.result });
        };
        reader.readAsDataURL(blob);
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return (
      <ActionButton
        className="UserTile-button"
        split={false}
        onRenderMenuIcon={() => false}
        menuProps={{
          shouldFocusOnMount: true,
          useTargetWidth: true,
          items: [
            {
              key: "logout",
              name: "Logout",
              onClick: this.props.onLogout
            }
          ]
        }}
      >
        <span className="ms-Persona-primaryText primaryText-54">
          {this.state.userFirstName}
        </span>
        <Persona
          imageUrl={this.state.userImage}
          primaryText={this.state.userName}
          imageShouldFadeIn={true}
          hidePersonaDetails={true}
        />
      </ActionButton>
    );
  }
}

export default UserTile;
