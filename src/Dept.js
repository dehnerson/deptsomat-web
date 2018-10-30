import React, { Component } from "react";
import PropTypes from 'prop-types';
import { db } from './fb';
import Modal from 'react-bootstrap/lib/Modal';

class Dept extends Component {
  static propTypes = {
    deptId: PropTypes.string,
    onCloseModal: PropTypes.func.isRequired
  }

  state = {
    dept: null
  }

  render() {
    return (
        <Modal show={this.props.deptId != null} onHide={this.onHide}>
          <Modal.Header closeButton>
            <Modal.Title>Modal title</Modal.Title>
          </Modal.Header>

          <Modal.Body>
              {this.state.dept && (
                <div>
                  <h1>Dept</h1>
                  <p>{this.state.dept.amount}</p>
                  <p>{this.state.dept.purpose}</p>
                </div>
              )}
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

        me.setState({dept: dept});
      });
    }
  }

  unsubscribeData = () => {
    if(this.refDept) {
      this.refDept.off();
    }
  }

  onHide = () => {
    this.props.onCloseModal();
  }
}

export default Dept;
