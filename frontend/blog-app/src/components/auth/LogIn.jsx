import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AUTH_IMG from '../../assets/logo.png'
import { UserContext } from '../../context/userContext'
import { API_PATHS } from '../../utils/apiPath'
import axiosInstance from '../../utils/axiosInstance'
import { validateEmail } from '../../utils/helper'
import Input from '../Inputs/Input'

const LogIn = ({ setCurrentPage }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const { updateUser, setOpenAuthForm } = useContext(UserContext)
    const navigate = useNavigate()

    const handleLogin = async e => {
        e.preventDefault()

        if (!validateEmail(email)) {
            setError('Please enter a valid email address')
            return
        }

        if (!password) {
            setError('Please enter a password')
            return
        }

        setError('')

        // login api call
        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
                email,
                password,
            })

            const { token, role } = response.data

            if (token) {
                localStorage.setItem('token', token)
                updateUser(response.data)

                if (role === 'admin') {
                    setOpenAuthForm(false)
                    navigate('/admin/dashboard')
                }
                setOpenAuthForm(false)
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message)
            } else {
                setError('Something Went Wrong. Please try again.')
            }
        }
    }
    return (
        <div className="flex items-center">
            <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
                <h3 className="text-lg font-semibold text-black">Welcome Back</h3>
                <p className="text-xs text-slate-700 mt-[2px] mb-6">Please enter your details to log in</p>

                <form onSubmit={handleLogin}>
                    {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

                    <Input value={email} onChange={({ target }) => setEmail(target.value)} label="Email Address" placeholder="john@example.com" type="email" />
                    <Input value={password} onChange={({ target }) => setPassword(target.value)} label="Password" placeholder="Min 4 characters" type="password" />

                    <button type="submit" className="btn-primary">
                        LOGIN
                    </button>

                    <p className="text-[13px] text-slate-800 mt-3">
                        Don't have an account?{' '}
                        <button
                            type="button"
                            className="font-bold text-primary underline cursor-pointer"
                            onClick={() => {
                                setCurrentPage('signup')
                            }}
                        >
                            SignUp
                        </button>
                    </p>
                </form>
            </div>

            <div className="hidden md:block">
                <img src={AUTH_IMG} alt="Login" className="h-[400px]" />
            </div>
        </div>
    )
}

export default LogIn
