import React, { Component } from 'react';
import './Formulaire.css';

export default class Formulaire extends Component {

  state = {
    message: '',
    length: this.props.length
  }

  createMessage = () => {
    const { addMessage, pseudo, length } = this.props;

    if (!pseudo) return; // si pas de user, ne rien faire
    if (!this.state.message.trim()) return; // message vide

    const message = {
      pseudo,          // pseudo venant de Firebase
      message: this.state.message
    }

    addMessage(message);

    // Reset
    this.setState({ 
      message: '', 
      length 
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    this.createMessage();
  }

  handleChange = event => {
    const message = event.target.value;
    const length = this.props.length - message.length;

    this.setState({ message, length });
  }

  handleKeyDown = event => {
    if (event.key === 'Enter' && !event.shiftKey) { // Enter envoie
      event.preventDefault();
      this.createMessage();
    }
  }

  render() {
    return (
      <form className='form' onSubmit={this.handleSubmit}>
        <textarea
          value={this.state.message}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
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
        
        <button type='submit' className="send-btn">
          Envoyer 🚀
        </button> 
      </form>
    )
  }
}
