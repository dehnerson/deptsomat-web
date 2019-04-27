import React, { Component } from "react";
import PropTypes from 'prop-types';
import { db } from './fb';
import Modal from 'react-bootstrap/lib/Modal';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

class Dept extends Component {
  static propTypes = {
    deptId: PropTypes.string,
    onCloseModal: PropTypes.func.isRequired
  }

  state = {
    dept: null,
    creationTime: null,
    donor: null,
    amount: null,
    purpose: null,
    recipients: []
  }

  render() {
    return (
        <Modal show={this.props.deptId != null} onHide={this.props.onCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Dept</Modal.Title>
          </Modal.Header>

          <Modal.Body>
                <div>
                  <p>{this.state.creationTime}</p>
                  <p>{this.state.donor}</p>
                  <p>{this.state.amount}</p>
                  <p>{this.state.purpose}</p>
                  <ListGroup>
                    {this.state.recipients.map((each) => (
                      <ListGroupItem key={each.uid}>{each.name}</ListGroupItem>
                    ))}
                  </ListGroup>
                </div>
          </Modal.Body>

          <Modal.Footer>
          </Modal.Footer>
        </Modal>
    )
  }

  componentDidMount() {
    this.subscribeData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.deptId !== prevProps.deptId) {
      this.unsubscribeData();
      this.setState({dept: null});

      this.subscribeData();
    }
  }

  componentWillUnmount() {
    this.unsubscribeData();
  }

  subscribeData = () => {
    if(this.props.deptId) {
      const me = this;
      this.refDept = db.ref('depts/' + this.props.deptId);

      this.refDept.on('value', (deptSnap) => {
        const dept = deptSnap.val();

        me.setState({creationTime: me.getCreationTime(deptSnap.key), amount: dept.amount, purpose: dept.purpose, recipients: []});

        db.ref('users/' + me.getUidDonor(deptSnap)).once('value').then((donorSnap) => {
          const donorVal = donorSnap.val();

          me.setState({donor: donorVal.firstName + donorVal.lastName});
        });

        for(const recipientUid in dept.uidsRecipient) {
          db.ref('users/' + recipientUid).once('value').then((recipientSnap) => {
            const recipientVal = recipientSnap.val();

            me.setState((prevState) => {
              return {recipients: prevState.recipients.concat({uid: recipientSnap.key, name: recipientVal.firstName + recipientVal.lastName})}
            });
          });
        }
      });
    }
  }

  getUidDonor = (deptSnap) => {
    if(deptSnap.child('uidDonor').exists()) {
      return deptSnap.child('uidDonor').val();
    }
    return deptSnap.key.split('__')[0];
  }

  getCreationTime = (deptKey) => {
    const date = new Date();
    date.setTime(deptKey.split('__')[1]);
    return date.toLocaleString();
  }

  unsubscribeData = () => {
    if(this.refDept) {
      this.refDept.off();
    }
  }
}

export default Dept;
