import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'
import { observable, toJS } from 'mobx'
import { observer } from 'mobx-react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import ChevronRight from '@material-ui/icons/ChevronRight'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import IconButton from '@material-ui/core/IconButton'
import Add from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'

import styles from './css/categories.module.scss'
import { overlayLoading, snackbar } from '../../../services/stores';

@observer
class Category extends Component {
  @observable categories = []
  @observable isLoading = false
  @observable category = null
  @observable name = ''
  @observable isEditDialogOpened = false
  @observable isDeleteDialogOpened = false
  @observable isNew = false
  @observable supCategoryId = -1

  componentDidMount() {
    this.fetchCategories()
  }

  reset() {
    this.category = null
    this.name = ''
  }

  async fetchCategories(withoutLoading) {
    try {
      if (!withoutLoading) this.isLoading = true
      let {
        data: {
          data: categories
        }
      } = await axios.get('/api/categories')
  
      this.categories = categories.map((d, i) => ({
        ...d, 
        isOpened: i < this.categories.length ? this.categories[i].isOpened : false
      }))
      if (!withoutLoading) this.isLoading = false
    } catch (err) {
      if (!withoutLoading) this.isLoading = false
      console.log('ERROR WHILE FETCHING CATEGORIES', err)
    }
  }

  async addCategory() {
    try {
      overlayLoading.show()
      await axios.post('/api/categories', {
        name: this.category.name
      })
  
      overlayLoading.hide()
      this.isEditDialogOpened = false
      snackbar.show(`Category ${this.category.name} added`)
    } catch (err) {
      this.isEditDialogOpened = false
      overlayLoading.hide()
      console.log('ERROR WHILE FETCHING CATEGORIES', err)
    }
  }

  async addSubCategory() {
    try {
      overlayLoading.show()
      await axios.post(`/api/categories/${this.supCategoryId}/subcategories`, {
        name: this.category.name
      })
  
      overlayLoading.hide()
      this.isEditDialogOpened = false
      snackbar.show(`Sub category ${this.category.name} added`)
    } catch (err) {
      this.isLoading = false
      this.isEditDialogOpened = false
      console.log('ERROR WHILE FETCHING CATEGORIES', err)
    }
  }

  renderList() {
    return this.categories.map((c, i) => (
      <React.Fragment key={i} >
        <ListItem button onClick={() => {
          c.isOpened = !c.isOpened
        }}>
          {/* <ListItemIcon>
            <InboxIcon />
          </ListItemIcon> */}
          <ListItemText primary={c.name} />
          <IconButton
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              this.reset()
              this.isNew = false
              this.category = toJS(c)
              this.isEditDialogOpened = true
            }}
            className={styles['list-btn']} 
            aria-label="Delete">
            <Edit />
          </IconButton>
          <IconButton 
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              this.reset()
              this.category = toJS(c)
              this.isDeleteDialogOpened = true
            }}
            className={styles['list-btn']} 
            aria-label="Delete">
            <Delete />
          </IconButton>
          {this.isOpened ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse className={styles.sub} in={c.isOpened} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {c.sub_categories && c.sub_categories.map((sub, i) => (
              <ListItem key={i} button className={styles.nested}>
                <ListItemIcon>
                  <ChevronRight />
                </ListItemIcon>
                <ListItemText inset primary={sub.name} />
                <IconButton
                  onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    this.reset()
                    this.category = toJS(c)
                    this.isNew = false
                    this.isDeleteDialogOpened = true
                  }}
                  className={styles['list-btn']} 
                  aria-label="Delete">
                  <Edit />
                </IconButton>
                <IconButton 
                  onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    this.reset()
                    this.category = toJS(c)
                    this.isDeleteDialogOpened = true
                  }}
                  className={styles['list-btn']} 
                  aria-label="Delete">
                  <Delete />
                </IconButton>
              </ListItem>
            ))}
            <Button 
              fullWidth 
              variant="contained" 
              color="secondary" 
              className={styles.button}
              onClick={() => {
                this.category = { name: '' }
                this.isNew = true
                this.supCategoryId = c.id
                this.isEditDialogOpened = true
              }}
            >
              <Add className={styles.rightIcon} />
              Add Sub Category
            </Button>
          </List>
        </Collapse>
      </React.Fragment>
    ))
  }

  onSave = async () => {
    if (this.supCategoryId === -1)
      await this.addCategory()
    else 
      await this.addSubCategory()

    this.fetchCategories(true)
  }

  onDelete = () => {
    
  }

  renderEditCategory() {
    if (!this.category) return

    return (
      <TextField
        label="Name"
        fullWidth
        margin="dense"
        variant="outlined"
        onChange={e => this.category.name = e.target.value}
        value={this.category.name}
        type="text"
      />
    )
  }

  render() {
    if (this.isLoading) return <CircularProgress className={styles.loading} />

    return (
      <div className={styles.container} >
        <List component="nav">
          {this.renderList()}
        </List>

        <Button 
          fullWidth 
          variant="contained" 
          color="primary" 
          className={styles.button}
          onClick={() => {
            this.category = { name: '' }
            this.isNew = true
            this.supCategoryId = -1
            this.isEditDialogOpened = true
          }}
        >
          <Add className={styles.rightIcon} />
          Add Category
        </Button>
        <Dialog
          open={this.isEditDialogOpened}
          onClose={() => this.isEditDialogOpened = false}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="md"
        >
          <DialogTitle 
            id="alert-dialog-title">
            {this.isNew ? 'Create New' : 'Edit'} Category
          </DialogTitle>
          <DialogContent>
            {this.renderEditCategory()}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.isEditDialogOpened = false} color="secondary">
              Close
            </Button>
            <Button onClick={this.onSave} color="primary" autoFocus>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.isDeleteDialogOpened}
          onClose={() => this.isDeleteDialogOpened = false}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            Delete Category
          </DialogTitle>
          <DialogContent>
            Are you sure you want to delete category {this.category && this.category.name}?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.isDeleteDialogOpened = false} color="primary">
              Cancel
            </Button>
            <Button onClick={this.onDelete} color="secondary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default Category