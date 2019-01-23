import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { observer } from 'mobx-react'
import { observe, observable, action } from 'mobx'
import Table from '../../../components/Table'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
// import DialogContentText from '@material-ui/core/DialogContentText'
import MenuItem from '@material-ui/core/MenuItem'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import axios from 'axios'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import IconButton from '@material-ui/core/IconButton'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

import styles from './css/membership.module.scss'
import { user, snackbar, overlayLoading } from '../../../services/stores'

const ROWS = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'role', numeric: false, disablePadding: false, label: 'Role' },
]

const ROWS_PER_PAGE = 5

@observer
class Membership extends Component {
  @observable users = []
  @observable page = 0
  @observable order = 'asc'
  @observable orderBy = ''
  //dialog edit
  @observable isEditModalActive = false
  @observable title = ''
  @observable id = -1
  @observable name = ''
  @observable email = ''
  @observable role = 'admin'
  @observable age = ''
  @observable phone = ''
  @observable gender = ''
  @observable isFetchingUser = false
  @observable search = ''
  @observable filter = 'all'
  @observable isNew = false
  @observable shouldShowPassword = false
  @observable password = ''
  @observable selected = []
  @observable isDeleteDialogActive = false

  componentDidMount() {
    if (user.isLoggedIn) this.fetchUsers()
    this.userDisposer = observe(user, 'data', () => {
      console.log('berubah?')
      if (user.isLoggedIn) this.fetchUsers()
    })
  }

  componentWillUnmount() {
    if (this.userDisposer) this.userDisposer()
  }

  async fetchUsers() {
    let users = await user.getUsers()
    if (!users) return

    console.log('hasil', users)
    this.users = users
  }

  onRequestSort = id => {
    const orderBy = id
    let order = 'desc'

    if (this.orderBy === id && this.order === 'desc') {
      order = 'asc'
    }

    // this.setState({ order, orderBy })
    this.order = order
    this.orderBy = orderBy

    console.log('will be sorted by', this.orderBy, this.order)
  }

  @action
  async getUserById(id) {
    try {
      this.isFetchingUser = true
      let { data: { data } } = await axios.get(`/api/users/${id}`)
      this.isFetchingUser = false
      for (let loc in data) this[loc] = data[loc]
      return data
    } catch (err) {
      this.isFetchingUser = false
      snackbar.show('There is an error occured')
      console.log('Error fetching user with id', id)
    }
  }

  renderContent() {
    return (
      <div className={styles.container} >
        <Table 
          rows={ROWS} 
          data={this.users.slice()} 
          // data={
          //   [
          //     {
          //       id: 1,
          //       name: 'yahya',
          //       email: 'yahya@yahya.com',
          //       role: 'admin'
          //     },
          //     {
          //       id: 2,
          //       name: 'yahya',
          //       email: 'yahya@yahya.com',
          //       role: 'admin'
          //     },
          //   ]
          // }
          order={this.order}
          orderBy={this.orderBy}
          page={this.page}
          title="Membership"
          onRequestSort={this.onRequestSort}
          rowsPerPage={ROWS_PER_PAGE}
          onRowClick={async id => {
            this.isNew = false
            this.isEditModalActive = true
            await this.getUserById(id)
            console.log('edit modal actived for', id)
            //fetch detail of n.id
          }}
          onDelete={selected => {
            this.selected = selected
            this.isDeleteDialogActive = true
          }}
        />
      </div>
    )
  }

  handleChange(name, value) {
    this[name] = value
  }

  renderEditUser() {
    if (this.isFetchingUser) return <CircularProgress className={styles.loading} />

    return (
      <form className={styles.edit} >
        <TextField
          label="Name"
          fullWidth
          margin="dense"
          variant="outlined"
          onChange={e => this.handleChange('name', e.target.value)}
          value={this.name}
          type="text"
        />
        <TextField
          label="Email"
          fullWidth
          margin="dense"
          variant="outlined"
          onChange={e => this.handleChange('email', e.target.value)}
          value={this.email}
          type="email"
        />
        <TextField
          className={styles.password}
          variant="outlined"
          type={this.shouldShowPassword ? 'text' : 'password'}
          label="Password"
          value={this.password}
          onChange={e => this.handleChange('password', e.target.value)}
          margin="dense"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={() => this.shouldShowPassword = !this.shouldShowPassword}
                >
                  {this.shouldShowPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          label="Role"
          value={this.role}
          onChange={e => this.handleChange('role', e.target.value)}
          margin="normal"
          variant="outlined"
          fullWidth
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="customer">Customer</MenuItem>
          <MenuItem value="doctor">Doctor</MenuItem>
        </TextField>
        {
          this.role !== 'admin'
            ? (
              <React.Fragment>
              <TextField
                label="Gender"
                fullWidth
                margin="dense"
                variant="outlined"
                onChange={e => this.handleChange('gender', e.target.value)}
                value={this.gender}
                type="text"
              />
              <TextField
                label="Age"
                fullWidth
                margin="dense"
                variant="outlined"
                onChange={e => this.handleChange('age', e.target.value)}
                value={this.age}
                type="text"
              />
              <TextField
                label="Phone"
                fullWidth
                margin="dense"
                variant="outlined"
                onChange={e => this.handleChange('phone', e.target.value)}
                value={this.phone}
                type="phone"
              />
              </React.Fragment>
            )
            : ''
        }
      </form>
    )
  }

  reset() {
    this.name = ''
    this.email = ''
    this.password = ''
    this.role = 'admin'
    this.gender = ''
    this.age = ''
    this.phone = ''
    this.shouldShowPassword = false
    this.search = ''
    this.filter = 'all'
  }

  onSearchChange = search => {
    this.search = search
    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      //fetch
      console.log('fetch with search query', search)
    }, 1000)
  }

  onSave = async () => {
    overlayLoading.show()
    let {
      name,
      email,
      password,
      role,
      age,
      gender,
      phone,
      isNew,
      id,
    } = this

    try {
      let body = {
        name,
        email,
        role,
        age,
        gender,
        phone,
      }

      if (password.length > 0) body.password = password
      let { data } = await axios[
          isNew 
            ? 'post' 
            : 'patch'
        ](
          `/api/users${!isNew ? `/${id}` : ''}`, 
          body
        )

      console.log(data)
      snackbar.show('New user was created')
      await this.fetchUsers()
    } catch (err) {
      snackbar.show('There is an error occured. Adding a new user was failed')
      console.log('ERROR WHILE ADDING NEW USER', err)
    }
    overlayLoading.hide()
    this.isEditModalActive = false
  }

  onDelete = async () => {
    console.log('To be deleted: ', this.selected.slice())
  }

  render() {
    if (!user.isLoggedIn) return <CircularProgress className={styles.loading} />

    return (
      <div className={styles.container} >
        <div className={styles.add} >
          <Fab 
            onClick={() => {
              this.reset()
              this.isNew = true
              this.isEditModalActive = true
            }}
            color="primary" aria-label="Add" 
            className={styles.fab}>
            <AddIcon />
          </Fab>
        </div>
        <div className={styles.filter} >
          <TextField
            select
            label="Filter"
            value={this.filter}
            onChange={e => this.handleChange('filter', e.target.value)}
            variant="outlined"
            style={{width: 150, marginRight: 20}}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="customer">Customer</MenuItem>
            <MenuItem value="doctor">Doctor</MenuItem>
          </TextField>
          <TextField
            id="outlined-adornment-password"
            variant="outlined"
            type="text"
            label="Search Name"
            value={this.search}
            onChange={e => this.onSearchChange(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    // onClick={this.handleClickShowPassword}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        {
          user.isFetchingUsers
            ? <CircularProgress className={styles.loading} />
            : this.renderContent()
        }
        <Dialog
          open={this.isEditModalActive}
          onClose={() => this.isEditModalActive = false}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="md"
        >
          <DialogTitle 
            id="alert-dialog-title">
            {this.isNew ? 'Create New' : 'Edit'} User
          </DialogTitle>
          <DialogContent>
            {this.renderEditUser()}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.isEditModalActive = false} color="primary">
              Close
            </Button>
            <Button onClick={this.onSave} color="primary" autoFocus>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.isDeleteDialogActive}
          onClose={() => this.isDeleteDialogActive = false}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            Delete User
          </DialogTitle>
          <DialogContent>
            Are you sure you want to delete {this.selected.length} users?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.isDeleteDialogActive = false} color="primary">
              Cancel
            </Button>
            <Button onClick={this.onDelete} color="primary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default Membership