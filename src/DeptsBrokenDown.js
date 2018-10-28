import React, { Component } from "react";
import PropTypes from 'prop-types';
import { auth, db } from './fb';

class DeptsBrokenDown extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    userInvolved: PropTypes.object.isRequired
  }

  state = {
    deptsBrokenDown: []
  }

  render() {
    return (
      <div>
        <h1>DeptsBrokenDown</h1>
        <ul>
          {this.state.deptsBrokenDown.map((each) => (
              <li key={each.userInvolved.uid}>{each.userInvolved.name}: {each.amount}</li>
          ))}
        </ul>
      </div>
    )
  }

  componentDidMount() {
    const me = this;

    const refDeptsBrokenDown = db.ref('deptsBrokenDown/' + this.props.currentUser.uid + '/' + this.props.userInvolved.uid);

    refDeptsBrokenDown.on('child_added', (deptBrokenDownSnap) => {
      const newDeptBrokenDown = {deptKey: deptBrokenDownSnap.key, amount:deptBrokenDownSnap.val()};

      me.setState((prevState) => {
        return {deptsBrokenDown: prevState.deptsBrokenDown.concat(newDeptBrokenDown)}
      });
    });

    refDeptsBrokenDown.on('child_changed', (deptBrokenDownSnap) => {
      me.setState((prevState) => {
        const deptsBrokenDown = prevState.deptsBrokenDown.find((element) => {
          return element.deptKey === deptBrokenDownSnap.key;
        });

        if(deptsBrokenDown) {
          deptsBrokenDown.amount = deptBrokenDownSnap.val();
          return {deptsBrokenDown: prevState.deptsBrokenDown};
        }
      });
    });

    refDeptsBrokenDown.on('child_removed', (deptBrokenDownSnap) => {
      me.setState((prevState) => {
        const newDeptsBrokenDown = prevState.deptsBrokenDown.filter((each) => {
          return each.deptKey !== deptBrokenDownSnap.key;
        });

        return {deptsBrokenDown: newDeptsBrokenDown};
      });
    });
  }
}

export default DeptsBrokenDown;
