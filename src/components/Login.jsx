import React, { useState } from 'react'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const auth = getAuth()

  const submit = async (e) => {
    e.preventDefault()
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-24 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="w-full p-2 border rounded" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div className="flex items-center justify-between">
          <button className="px-4 py-2 bg-teal-500 text-white rounded" type="submit">{isRegister ? 'Register' : 'Login'}</button>
          <button type="button" className="text-sm text-gray-600" onClick={()=>setIsRegister(!isRegister)}>{isRegister ? 'Have an account? Login' : "Don't have account? Register"}</button>
        </div>
      </form>
    </div>
  )
}
