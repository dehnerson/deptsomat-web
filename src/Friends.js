import React, { Component } from "react";
import PropTypes from 'prop-types';
import { db } from './fb';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

class Friends extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired
  }

  state = {
    friends: []
  }

  render() {
    return (
      <div>
        <ListGroup>
          {this.state.friends.map((each) => (
            <ListGroupItem key={each.uid} header={each.name}>{each.email}</ListGroupItem>
          ))}
        </ListGroup>
      </div>
    )
  }

  componentDidMount() {
    this.subscribeData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentUser !== prevProps.currentUser) {
      this.unsubscribeData();
      this.setState({friends: []});

      this.subscribeData();
    }
  }

  componentWillUnmount() {
    this.unsubscribeData();
  }

  subscribeData = () => {
    const me = this;
    this.refFriends = db.ref('friends/' + this.props.currentUser.uid);

    // this.refFriends.on('value', (friendUidsSnap) => {
    //   friendUidsSnap.forEach((friendUidSnap) => {
    //     db.ref('users/' + friendUidSnap.key).once('value').then((friendSnap) => {
    //       const friendVal = friendSnap.val();
    //       const newFriend = {uid: friendSnap.key, name: friendVal.firstName + friendVal.lastName, email: friendVal.email};
    //
    //       me.setState((prevState) => {
    //         return {friends: prevState.friends.concat(newFriend)}
    //       });
    //     });
    //   });
    // });

    this.refFriends.on('child_added', (friendSnap) => {
        const friendVal = friendSnap.val();
        const newFriend = {uid: friendSnap.key, name: friendVal.name, email: friendVal.email};

        me.setState((prevState) => {
          return {friends: prevState.friends.concat(newFriend)}
        });
    });

    this.refFriends.on('child_changed', (friendSnap) => {
      me.setState((prevState) => {
        const friend = prevState.deptsSums.find((element) => {
          return element.uid === friendSnap.key;
        });

        if(friend) {
          friend.name = friendSnap.child('name').val();
          friend.email = friendSnap.child('email').val();
          return {friends: prevState.friends};
        }
      });
    });

    this.refFriends.on('child_removed', (friendSnap) => {
      me.setState((prevState) => {
        const newFriends = prevState.friends.filter((each) => {
          return each.uid !== friendSnap.key;
        });

        return {friends: newFriends};
      });
    });
  }

  unsubscribeData = () => {
    if(this.refFriends) {
      this.refFriends.off();
    }
  }
}

export default Friends;
