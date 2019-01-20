import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import styles from './css/dashboard.module.scss'

//WRAPPER
import Wrapper from './Wrapper'

//ROUTERS
import Membership from './Membership'

const ROUTER = [
  {
    title: 'Membership',
    path: '/dashboard/membership',
    icon: 'account-group',
    Component: Membership
  },
  {
    title: 'Reservation',
    path: '/dashboard/reservation',
    icon: 'calendar-text',
    Component: () => 'a'
  },
  {
    title: 'Training',
    path: '/dashboard/training',
    icon: 'video',
    Component: () => 'a'
  },
  {
    title: 'News',
    path: '/dashboard/news',
    icon: 'newspaper',
    Component: () => 'a'
  },
]

@observer
class Dashboard extends Component {
  @observable anchorElement = null
  @observable activeAnim = false
  @observable selected = -1

  componentDidMount() {
    setTimeout(() => this.activeAnim = true, 100)

    for (let i in ROUTER) 
      if (window.location.pathname.indexOf(ROUTER[i].path) !== -1) this.selected = i
  }

  @action
  closeMenu = () => {
    this.anchorElement = null
  }

  render() {
    return (
      <div className={styles.container} >
        <div 
          className={styles.top} 
          style={{animationName: this.activeAnim ? styles.topDown : ''}} 
        >
          <Avatar
            onClick={e => this.anchorElement = e.currentTarget}
          >
            <AccountCircle />
          </Avatar>
          <Menu
            id="simple-menu"
            anchorEl={this.anchorElement}
            open={!!this.anchorElement}
            onClose={this.closeMenu}
          >
            <MenuItem onClick={this.closeMenu}>Logout</MenuItem>
          </Menu>
        </div>

        <div 
          className={styles.nav} 
          style={{animationName: this.activeAnim ? styles.leftRight : ''}} 
        >
          <List component="nav">
            {ROUTER.map((d, i) => {
              return (
                <ListItem selected={this.selected == i} key={i} button onClick={() => {
                  this.selected = i
                  this.props.history.push(d.path)
                }}>
                  <ListItemIcon>
                    <span className={`mdi mdi-${d.icon} ${styles.icon}`} />
                  </ListItemIcon>
                  <ListItemText primary={d.title} />
                </ListItem>
              )
            })}
          </List>
        </div>
        
        <div className={styles.shadow} />

        <div className={styles.wrapper}>
          {ROUTER.map((d, i) => 
            <Route path={d.path} key={i} render={props => <Wrapper {...props}>
              <d.Component {...props} />
            </Wrapper>} />
          )}
        </div>
      </div>
    )
  }
}

export default Dashboard