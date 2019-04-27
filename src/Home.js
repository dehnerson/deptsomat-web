import React, { Component } from "react";
import PropTypes from 'prop-types';
import { auth } from './fb';
import Balance from './Balance';
import Friends from './Friends';
import {Link} from 'react-router-dom';
import { Navbar, Nav, NavItem, FormGroup, FormControl } from 'react-bootstrap';

class Home extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired
  }

  state = {
    activeNavKey: 1
  }

  render() {
    return (
      <div>
        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to='/'>Schuldomat</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
            <Navbar.Form pullLeft>
              <FormGroup>
                <FormControl type="text" placeholder="Search" />
              </FormGroup>
            </Navbar.Form>
            <Nav pullRight>
              <NavItem onClick={this.handleLogoutClick}>Sign out</NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className='body'>
        <Nav bsStyle="pills" stacked activeKey={this.state.activeNavKey} onSelect={this.handleNavClick}>
        <NavItem eventKey={1}>Schuldenüberblick</NavItem>
        <NavItem eventKey={2} disabled title="Item">Meine Einträge</NavItem>
        <NavItem eventKey={3}>Freunde</NavItem>
        </Nav>

          <main>
            {(() => {
              switch(this.state.activeNavKey) {
                case 1:
                  return <Balance currentUser={this.props.currentUser}/>;
                case 3:
                  return <Friends currentUser={this.props.currentUser}/>;
                default:
                  return null;
              }
            })()}
          </main>
        </div>
      </div>
    )
  }

  handleNavClick = (navKey) => {
    if(this.state.activeNavKey !== navKey) {
      this.setState({activeNavKey: navKey});
    }
  }

  handleLogoutClick = (event) => {
    event.preventDefault();
    auth.signOut();
  }
}

export default Home;
