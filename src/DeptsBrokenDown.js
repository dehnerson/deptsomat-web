import React, { Component } from "react";
import PropTypes from 'prop-types';
import { db } from './fb';
import Dept from './Dept';
import Modal from 'react-bootstrap/lib/Modal';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

class DeptsBrokenDown extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    userInvolved: PropTypes.object.isRequired,
    onCloseModal: PropTypes.func.isRequired
  }

  state = {
    deptsBrokenDown: [],
    clickedDeptId: null
  }

  render() {
    return (
      <Modal show={this.props.userInvolved != null} onHide={this.props.onCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>DeptsBrokenDown</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div>
            <ListGroup>
              {this.state.deptsBrokenDown.map((each) => (
                <ListGroupItem key={each.deptKey} onClick={(e) => this.handleDeptsBrokenDownClick(e, each.deptKey)}
                  header={each.amount}>{each.purpose}</ListGroupItem>
              ))}
            </ListGroup>

            {this.state.clickedDeptId && (
              <Dept deptId={this.state.clickedDeptId} onCloseModal={this.closeDeptModal}/>
            )}
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
    if (this.props.userInvolved !== prevProps.userInvolved) {
      this.unsubscribeData();
      this.setState({deptsBrokenDown: []});

      this.subscribeData();
    }
  }

  componentWillUnmount() {
    this.unsubscribeData();
  }

  subscribeData = () => {
    const me = this;
    this.refDeptsBrokenDown = db.ref('deptsBrokenDown/' + this.props.currentUser.uid + '/' + this.props.userInvolved.uid);

    this.refDeptsBrokenDown.on('value', (deptsBrokenDownSnap) => {
      const values = [];

      deptsBrokenDownSnap.forEach((deptBrokenDownSnap) => {
        values.push({deptKey: deptBrokenDownSnap.key, amount: deptBrokenDownSnap.child('amount').val(), purpose: deptBrokenDownSnap.child('purpose').val()});
      });

      me.setState({deptsBrokenDown: values});
    });
  }

  unsubscribeData = () => {
    if(this.refDeptsBrokenDown) {
      this.refDeptsBrokenDown.off();
    }
  }

  handleDeptsBrokenDownClick = (event, deptId) => {
    event.preventDefault();
    this.setState({clickedDeptId: deptId});
  }

  closeDeptModal = () => {
    this.setState({clickedDeptId: null});
  }
}

export default DeptsBrokenDown;
