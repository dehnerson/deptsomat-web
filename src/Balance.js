import React, { Component } from "react";
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import { db } from './fb';
import DeptsBrokenDown from './DeptsBrokenDown';
import { Button, ListGroup, ListGroupItem, Badge } from 'react-bootstrap';

class Balance extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired
  }

  state = {
    deptsSums: [],
    balanceTotal: null,
    nrOfDeptsTotal: null,
    focusedUserInvolved: null
  }

  render() {
    return (
      <div>
        {this.state.balanceTotal && (
          <div>
            <h3>Dein Guthaben: {this.state.balanceTotal}</h3>
            <Badge>{this.state.nrOfDeptsTotal} Einträge</Badge>
          </div>
        )}

        <ListGroup>
          {this.state.deptsSums.map((each) => (
            <ListGroupItem key={each.userInvolved.uid} onClick={(e) => this.handleDeptsSumClick(e, each.userInvolved)}
              header={each.amount}>{each.userInvolved.name}</ListGroupItem>
          ))}
        </ListGroup>

        {this.state.focusedUserInvolved && (
          <DeptsBrokenDown currentUser={this.props.currentUser} userInvolved={this.state.focusedUserInvolved} onCloseModal={this.closeDeptsBrokenDownModal}/>
        )}

        <Button><Link to='/addDept'>+</Link></Button>
      </div>
    )
  }

  componentDidMount() {
    const me = this;

    this.refDeptsBalanceTotal = db.ref('deptsBalanceTotal/' + this.props.currentUser.uid);

    this.refDeptsBalanceTotal.on('value', (balanceTotalSnap) => {
      me.setState({balanceTotal: balanceTotalSnap.child('amount').val(),
                    nrOfDeptsTotal: balanceTotalSnap.child('nrOfDepts').val()});
    });

    this.refDeptsBalance = db.ref('deptsBalance/' + this.props.currentUser.uid);

    this.refDeptsBalance.on('child_added', (balanceSnap) => {
      const newDeptsSum = { userInvolved:{ uid:balanceSnap.key, name:balanceSnap.child('name').val() }, amount:balanceSnap.child('amount').val() };

      me.setState((prevState) => {
        return {deptsSums: prevState.deptsSums.concat(newDeptsSum)}
      });
    });

    this.refDeptsBalance.on('child_changed', (balanceSnap) => {
      me.setState((prevState) => {
        const deptsSum = prevState.deptsSums.find((element) => {
          return element.userInvolved.uid === balanceSnap.key;
        });

        if(deptsSum) {
          deptsSum.amount = balanceSnap.child('amount').val();
          deptsSum.userInvolved.name = balanceSnap.child('name').val();
          return {deptsSums: prevState.deptsSums};
        }
      });
    });

    this.refDeptsBalance.on('child_removed', (balanceSnap) => {
      me.setState((prevState) => {
        const newDeptsSums = prevState.deptsSums.filter((each) => {
          return each.userInvolved.uid !== balanceSnap.key;
        });

        return {deptsSums: newDeptsSums};
      });
    });
  }

  componentWillUnmount() {
    if(this.refDeptsBalance) {
      this.refDeptsBalance.off();
    }

    if(this.refDeptsBalanceTotal) {
      this.refDeptsBalanceTotal.off();
    }
  }

  handleDeptsSumClick = (event, userInvolved) => {
    event.preventDefault();
    this.setState({focusedUserInvolved: userInvolved});
  }

  closeDeptsBrokenDownModal = () => {
    this.setState({focusedUserInvolved: null});
  }
}

export default Balance;
