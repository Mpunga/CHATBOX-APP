import React, { Component, createRef } from 'react';
import { database } from './base';
import { onValue, push, ref } from 'firebase/database';
import Message from './components/Message';
import Formulaire from './components/Formulaire';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css';
import './animations.css';

class App extends Component {
  state = {
    messages: {},
    pseudo: this.props.match?.params?.pseudo || "Invité",
    typing: false
  }

  messagesRef = createRef();

  componentDidMount() {
    const messagesRefDB = ref(database, "messages");
    onValue(messagesRefDB, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        this.setState({ messages: data }, this.scrollToBottom);
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.messages !== this.state.messages) {
      this.scrollToBottom();
    }
  }

  scrollToBottom = () => {
    const refElement = this.messagesRef.current;
    if (refElement) {
      refElement.scrollTop = refElement.scrollHeight;
    }
  }

  addMessage = message => {
    if (!message.message || !message.pseudo) return;

    // Affiche typing indicator pour 0.5s
    this.setState({ typing: true });
    setTimeout(() => this.setState({ typing: false }), 500);

    const messagesRefDB = ref(database, "messages");
    push(messagesRefDB, {
      message: message.message,
      pseudo: message.pseudo,
      timestamp: Date.now(),
      emoji: this.randomEmoji()
    });
  }

  // Choisir un emoji aléatoire
  randomEmoji = () => {
    const emojis = ["🔥","✨","💬","💡","🎉","💖","😎","🤖","🌟"];
    return emojis[Math.floor(Math.random() * emojis.length)];
  }

  render() {
    const allMessages = Object.entries(this.state.messages)
      .sort((a, b) => a[1].timestamp - b[1].timestamp)
      .slice(-10);

    return (
      <div className='box'>
   <div className="messages" ref={this.messagesRef}>
  <TransitionGroup component={null}>
    {allMessages.map(([key, msg]) => (
      <CSSTransition
        key={key}
        timeout={300}
        classNames="message-animation"
      >
        <div className="message-wrapper">
          <Message
            pseudo={msg.pseudo}
            message={msg.message}
            emoji={msg.emoji}
            isUser={(pseudo) => pseudo === this.state.pseudo}
          />
        </div>
      </CSSTransition>
    ))}
  </TransitionGroup>

  {this.state.typing && (
    <div className="typing-indicator">...</div>
  )}
</div>


        <Formulaire
          length={140}
          pseudo={this.state.pseudo}
          addMessage={this.addMessage}
        />
      </div>
    );
  }
}

export default App;
