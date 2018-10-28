import React, { Component } from "react";
import PropTypes from 'prop-types';
import { auth, db } from './fb';
import DeptsBrokenDown from './DeptsBrokenDown';

class Home extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired
  }

  state = {
    deptsSums: [],
    balanceTotal: null
  }

  render() {
    return (
      <div>
        <button onClick={this.handleLogout}>Sign Out</button>
        <h1>Home</h1>
        <p>{this.state.balanceTotal}</p>
        <ul>
          {this.state.deptsSums.map((each) => (
              <li key={each.userInvolved.uid}>{each.userInvolved.name}: {each.amount}</li>
          ))}
        </ul>
      </div>
    )
  }

  componentDidMount() {
    const me = this;

    db.ref('deptsBalanceTotal/' + this.props.currentUser.uid).on('value', (balanceTotalSnap) => {
      me.setState({balanceTotal: balanceTotalSnap.val()});
    });

    const refDeptsBalance = db.ref('deptsBalance/' + this.props.currentUser.uid);

    refDeptsBalance.on('child_added', (balanceSnap) => {
      if(balanceSnap.key.startsWith('_DYNAMIC_')) {
        const newDeptsSum = { userInvolved:{ uid:balanceSnap.key, name:'Backe' }, amount:balanceSnap.val() };

        me.setState((prevState) => {
          return {deptsSums: prevState.deptsSums.concat(newDeptsSum)}
        });
      }
      else {
        db.ref('users/' + balanceSnap.key).once('value', (userSnap) => {
          const user = userSnap.val();
          const newDeptsSum = { userInvolved:{ uid:userSnap.key, name:user.firstName + ' ' + user.lastName }, amount:balanceSnap.val() };

          me.setState((prevState) => {
            return {deptsSums: prevState.deptsSums.concat(newDeptsSum)}
          });
        });
      }
    });

    refDeptsBalance.on('child_changed', (balanceSnap) => {
      me.setState((prevState) => {
        const deptsSum = prevState.deptsSums.find((element) => {
          return element.userInvolved.uid === balanceSnap.key;
        });

        if(deptsSum) {
          deptsSum.amount = balanceSnap.val();
          return {deptsSums: prevState.deptsSums};
        }
      });
    });

    refDeptsBalance.on('child_removed', (balanceSnap) => {
      me.setState((prevState) => {
        const newDeptsSums = prevState.deptsSums.filter((each) => {
          return each.userInvolved.uid !== balanceSnap.key;
        });

        return {deptsSums: newDeptsSums};
      });
    });
  }

  handleLogout = (event) => {
    event.preventDefault();

    auth.signOut();
  }
}

export default Home;
