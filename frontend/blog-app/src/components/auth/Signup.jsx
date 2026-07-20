import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AUTH_IMG from '../../assets/logo.png'
import { UserContext } from '../../context/userContext'
import { API_PATHS } from '../../utils/apiPath'
import axiosInstance from '../../utils/axiosInstance'
import { validateEmail } from '../../utils/helper'
import uploadImage from '../../utils/uploadImage'
import Input from '../Inputs/Input'
import ProfilePhotoSector from '../Inputs/ProfilePhotoSector'

const SignUp = ({ setCurrentPage }) => {
	const [profilePic, setProfilePic] = useState(null)
	const [fullname, setFullname] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [adminAccessToken, setAdminAccessToken] = useState('')

	const [error, setError] = useState(null)

	const { updateUser, setOpenAuthForm } = useContext(UserContext)
	const navigate = useNavigate()

	const handleSignUp = async e => {
		e.preventDefault()

		let profileImageUrl = ''

		if (!fullname) {
			setError('Please Enter Fullname Field')
			return
		}

		if (!validateEmail(email)) {
			setError('Please Enter a valid Email Address')
			return
		}

		setError('')

		try {
			// upload image is present
			if (profilePic) {
				const imageUploadRes = await uploadImage(profilePic)
				profileImageUrl = imageUploadRes.imageUrl || ''
			}

			const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
				name: fullname,
				email,
				password,
				profileImageUrl,
				adminAccessToken,
			})

			const { token, role } = response.data

			if (token) {
				localStorage.setItem('token', token)
				updateUser(response.data)

				if (role === 'admin') {
					setOpenAuthForm(false)
					navigate('/admin/dashboard')
				}
				navigate('/')
				setOpenAuthForm(false)
			}
		} catch (error) {
			if (error.response && error.response.data.message) {
				setError(error.response.data.message)
			} else {
				setError('Something Went Wrong. Please Try Again Later')
			}
		}
	}

	return (
		<div className="flex items-center h-auto md:h-[520px]">
			<div className="w-[90vw] md:w-[43vw] p-7 flex-col justify-center">
				<h3 className="text-lg font-semibold text-black">Create An Account</h3>
				<p className="text-xs text-slate-700 mt-[5px] mb-6">Join Us Today by Entering Your Details Below</p>

				<form onSubmit={handleSignUp}>
					<ProfilePhotoSector image={profilePic} setImage={setProfilePic} />

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6">
						<Input value={fullname} onChange={({ target }) => setFullname(target.value)} label="Full Name" placeholder="John" type="text" />
						<Input value={email} onChange={({ target }) => setEmail(target.value)} label="Email Address" placeholder="john@example.com" type="text" />
						<Input value={password} onChange={({ target }) => setPassword(target.value)} label="Password" placeholder="Min 4 Characters" type="password" />
						<Input value={adminAccessToken} onChange={({ target }) => setAdminAccessToken(target.value)} label="Admin Invite Token" placeholder="6 digit code" type="number" />
					</div>

					{error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

					<button type="submit" className="btn-primary">
						SIGN UP
					</button>
					<p className="text-[13px] text-slate-700 mt-3">
						Already Have An Account?{' '}
						<button type="button" className="font-bold text-primary underline cursor-pointer" onClick={() => setCurrentPage('login')}>
							LogIn
						</button>
					</p>
				</form>
			</div>

			<div className="hidden md:block">
				<img src={AUTH_IMG} alt="Login" className="" />
			</div>
		</div>
	)
}

export default SignUp
