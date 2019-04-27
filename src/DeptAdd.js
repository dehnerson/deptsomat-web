import React, { Component } from "react";
import PropTypes from 'prop-types';
import { db } from './fb';
import { Grid, Form, FormGroup, FormControl, HelpBlock, ControlLabel, Checkbox, Button } from 'react-bootstrap';

class DeptAdd extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired
  }

  state = {
    amount: '',
    amountValidationState: null,
    isLoan: false,
    purpose: '',
    purposeValidationState: null,
    possibleRecipients: []
  }

  getValidationState = () => {
    const length = this.state.purpose.length;
    if (length > 10) return 'success';
    else if (length > 5) return 'warning';
    else if (length > 0) return 'error';
    return null;
  }

  handleChangeAmount = (e) => {
    this.setState({ amount: e.target.value });
    this.validateAmount(e.target.value);
  }

  handleChangeLoan = () => {
    this.setState((prevState) => {
        return {isLoan: !prevState.isLoan};
    });
  }

  handleChangePurpose = (e) => {
    this.setState({ purpose: e.target.value });
    this.validatePurpose(e.target.value);
  }

  handleChangePossibleRecipients = (uid) => {
    this.setState((prevState) => {
      const possibleRecipient = prevState.possibleRecipients.find((element) => {
        return element.uid === uid;
      });

      if(possibleRecipient) {
        possibleRecipient.checked = !possibleRecipient.checked;
        return {possibleRecipients: prevState.possibleRecipients};
      }
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const isAmountValid = this.validateAmount(this.state.amount);
    const isPurposeValid = this.validatePurpose(this.state.purpose);

    if(isAmountValid && isPurposeValid) {
      const uidsRecipient = {};
      this.state.possibleRecipients.forEach(each => {
        if(each.checked) {
          uidsRecipient[each.uid] = true;
        }
      });

      db.ref('depts/' + this.props.currentUser.uid + '__' + Date.now()).set({
        amount: this.state.amount,
        loan: this.state.isLoan,
        purpose: this.state.purpose,
        uidsRecipient: uidsRecipient
      });
    }
  }

  validateAmount = (amount) => {
    if(!amount) {
      this.setState({amountValidationState: 'error'});
      return false;
    }
    else {
      this.setState({amountValidationState: null});
      return true;
    }
  }

  validatePurpose = (purpose) => {
    if(!purpose) {
      this.setState({purposeValidationState: 'error'});
      return false;
    }
    else {
      this.setState({purposeValidationState: null});
      return true;
    }
  }

  render() {
    return (
      <Grid>
        <Form>
          <FormGroup controlId="inputAmount" validationState={this.state.amountValidationState} bsSize='large'>
            <ControlLabel>Amount</ControlLabel>
            <FormControl type="number" value={this.state.amount} placeholder="10.85" onChange={this.handleChangeAmount}/>
            <FormControl.Feedback />
            <HelpBlock>Wieviel hast Du entrichtet?</HelpBlock>
          </FormGroup>

          <Checkbox checked={this.state.isLoan} onChange={this.handleChangeLoan}>Loan</Checkbox>
          <HelpBlock>Hast Du keinen Beitrag zu dem entrichteten Betrag zu leisten?</HelpBlock>

          <FormGroup controlId="inputPurpose" validationState={this.state.purposeValidationState}>
            <ControlLabel>Purpose</ControlLabel>
            <FormControl type="text" value={this.state.purpose} placeholder='Reason' onChange={this.handleChangePurpose}/>
            <FormControl.Feedback />
            <HelpBlock>Aus welchem Grund hast Du den Betrag entrichtet?</HelpBlock>
          </FormGroup>

          <FormGroup>
            {this.state.possibleRecipients.map((each) => (
              <Checkbox key={each.uid} checked={each.checked} onChange={e => {this.handleChangePossibleRecipients(each.uid)}}>{each.name}</Checkbox>
            ))}
          </FormGroup>

          <Button type='submit' onClick={e => {this.handleSubmit(e)}}>Submit</Button>
        </Form>
      </Grid>
    )
  }

  componentDidMount() {
    this.subscribeData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentUser !== prevProps.currentUser) {
      this.unsubscribeData();
      // this.setState({deptsBrokenDown: []});

      this.subscribeData();
    }
  }

  componentWillUnmount() {
    this.unsubscribeData();
  }

  subscribeData = () => {
    const me = this;
    this.refPossibleRecipeints = db.ref('friends/' + this.props.currentUser.uid);

    this.refPossibleRecipeints.on('child_added', (friendUidSnap) => {
      db.ref('users/' + friendUidSnap.key).once('value').then((friendSnap) => {
        const newPossibleRecipient = {uid: friendSnap.key, name: friendSnap.child('firstName').val() + friendSnap.child('lastName').val()};

        me.setState((prevState) => {
          return {possibleRecipients: prevState.possibleRecipients.concat(newPossibleRecipient)}
        });
      });
    });
  }

  unsubscribeData = () => {
    if(this.refPossibleRecipeints) {
      this.refPossibleRecipeints.off();
    }
  }
}

export default DeptAdd;
