import React, { Component, createRef } from 'react';
import { auth, database } from './base';
import { onValue, push, ref } from 'firebase/database';
import { signOut } from "firebase/auth";
import Message from './components/Message';
import Formulaire from './components/Formulaire';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css';
import './animations.css';
import { onAuthStateChanged } from "firebase/auth";
import Auth from "./components/Auth"

class App extends Component {
  state = {
    messages: {},
    user: null,
    typing: false
  }

  messagesRef = createRef();

  componentDidMount() {
    // Écoute l'état de connexion Firebase
    onAuthStateChanged(auth, (user) => {
      this.setState({ user });
    });

    // Écoute des messages
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
    const user = this.state.user;
    if (!message.message || !user) return;

    this.setState({ typing: true });
    setTimeout(() => this.setState({ typing: false }), 500);

    const messagesRefDB = ref(database, "messages");
    push(messagesRefDB, {
      message: message.message,
      pseudo: user.email.split("@")[0],
      uid: user.uid,
      timestamp: Date.now(),
      emoji: this.randomEmoji()
    });
  }

  randomEmoji = () => {
    const emojis = ["🔥","✨","💬","💡","🎉","💖","😎","🤖","🌟"];
    return emojis[Math.floor(Math.random() * emojis.length)];
  }

  handleLogout = async () => {
    await signOut(auth);
    this.setState({ user: null });
  }

  render() {
    const { user, messages, typing } = this.state;

    if (!user) {
      return <Auth onLogin={user => this.setState({ user })} />
    }

    const allMessages = Object.entries(messages)
      .sort((a, b) => a[1].timestamp - b[1].timestamp)
      .slice(-10);

    return (
      <div className='box'>
        {/* Header avec pseudo et bouton déconnexion */}
        <div className="header">
          <div className="user-info">
            <span className="user-badge">👤 {user.email.split("@")[0]}</span>
            <button className="logout-btn" onClick={this.handleLogout}>Se déconnecter</button>
          </div>
        </div>

        {/* Messages */}
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
  uid={msg.uid}
  currentUid={user.uid}
  isUser={(pseudo, uid) => uid === user.uid}
                  />
                </div>
              </CSSTransition>
            ))}
          </TransitionGroup>

          {typing && (
            <div className="typing-indicator">...</div>
          )}
        </div>

        {/* Formulaire */}
        <Formulaire
          length={140}
          pseudo={user.email.split("@")[0]}
          addMessage={this.addMessage}
        />
      </div>
    );
  }
}

export default App;
