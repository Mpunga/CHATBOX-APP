import React, { useState } from "react"
import { auth, database } from "../base"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { ref, set } from "firebase/database"
import "./Auth.css"

export default function Auth({ onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nom, setNom] = useState("")
  const [prenom, setPrenom] = useState("")
  const [telephone, setTelephone] = useState("")
  const [adresse, setAdresse] = useState("")
  const [isRegister, setIsRegister] = useState(false)
  const [errorMsg, setErrorMsg] = useState([])

  const validate = () => {
    const errors = []
    if (!email.trim()) errors.push("Veuillez saisir votre email")
    if (!password.trim()) errors.push("Veuillez saisir votre mot de passe")
    if (isRegister) {
      if (!nom.trim()) errors.push("Veuillez saisir votre nom")
      if (!prenom.trim()) errors.push("Veuillez saisir votre prénom")
      if (!telephone.trim()) errors.push("Veuillez saisir votre numéro de téléphone")
      if (!adresse.trim()) errors.push("Veuillez saisir votre adresse")
    }
    return errors
  }

  const getErrorMessage = (error) => {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "Cette adresse email est déjà utilisée."
      case "auth/invalid-email":
        return "L’adresse email n’est pas valide."
      case "auth/weak-password":
        return "Le mot de passe doit contenir au moins 6 caractères."
      case "auth/user-not-found":
        return "Aucun compte trouvé avec cet email."
      case "auth/wrong-password":
        return "Mot de passe incorrect."
      default:
        return "Une erreur est survenue. Veuillez réessayer."
    }
  }

  const submit = async () => {
    const validationErrors = validate()
    if (validationErrors.length > 0) {
      setErrorMsg(validationErrors)
      return
    }

    try {
      let res
      if (isRegister) {
        res = await createUserWithEmailAndPassword(auth, email, password)
        await set(ref(database, `users/${res.user.uid}`), {
          nom,
          prenom,
          telephone,
          adresse,
          email
        })
      } else {
        res = await signInWithEmailAndPassword(auth, email, password)
      }

      setErrorMsg([])
      onLogin(res.user)
    } catch (e) {
      setErrorMsg([getErrorMessage(e)])
    }
  }

  return (
    <div className="auth-container">
      <div className={`auth-box ${isRegister ? "register" : "login"}`}>
        <h2>{isRegister ? "Créer un compte" : "Connexion"}</h2>

        {isRegister && (
          <div className="input-group">
            <input
              type="text"
              placeholder="Nom"
              value={nom}
              onChange={e => setNom(e.target.value)}
            />
            <input
              type="text"
              placeholder="Prénom"
              value={prenom}
              onChange={e => setPrenom(e.target.value)}
            />
            <input
              type="text"
              placeholder="Téléphone"
              value={telephone}
              onChange={e => setTelephone(e.target.value)}
            />
            <input
              type="text"
              placeholder="Adresse"
              value={adresse}
              onChange={e => setAdresse(e.target.value)}
            />
          </div>
        )}

        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") submit() }}
          />
        </div>

        {errorMsg && errorMsg.map((err, index) => (
          <p key={index} className="error animate-error">{err}</p>
        ))}

        <button type="button" onClick={submit} className="btn">
          {isRegister ? "S'inscrire" : "Se connecter"}
        </button>

        <p
          className="toggle-link"
          onClick={() => {
            setIsRegister(!isRegister)
            setErrorMsg([])
          }}
        >
          {isRegister ? "Déjà un compte ?" : "Créer un compte"}
        </p>
      </div>
    </div>
  )
}
