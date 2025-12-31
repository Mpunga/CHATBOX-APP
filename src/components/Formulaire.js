import React, { Component } from 'react'

export default class Formulaire extends Component {

  state = {
    message: '',
    length: this.props.length
  }

  createMessage = () => {
    const { addMessage, pseudo, length } = this.props

    if (!this.state.message.trim()) return

    const message = {
      pseudo: pseudo || "Invité",
      message: this.state.message
    }

    addMessage(message)

    // Reset
    this.setState({ 
      message: '', 
      length 
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    this.createMessage()
  }

  handleChange = event => {
    const message = event.target.value
    const length = this.props.length - message.length

    this.setState({ message, length })
  }

  handleKeyUp = event => {
    if(event.key === 'Enter') {
      this.createMessage()
    }
  }

  render() {
    return (
      <form className='form' onSubmit={this.handleSubmit}>
        <textarea
          value={this.state.message}
          onChange={this.handleChange}
          rows={1}
          placeholder="Tape ton message..."
          onInput={(e) => {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
  }}
/> 
        <div className='info'>
          { this.state.length }
        </div>
        
        <button type='submit'>
          Envoyer 🚀
        </button> 

      </form>
    )
  }
}
