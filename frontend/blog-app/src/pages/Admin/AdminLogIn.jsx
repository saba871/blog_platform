import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/Layouts/DashboardLayout'

import LogIn from '../../components/auth/LogIn'
import SignUp from '../../components/auth/Signup'

const AdminLogIn = () => {
	const [currentPage, setCurrentPage] = useState('login')
	return (
		<>
			<div className="bg-white py-5 border-b border-gray-50">
				<div className="container mx-auto">
					<Link to={'/'} className="flex items-center pl-6 font-bold">
						Post<span className="text-blue-600 ml-1">Book</span>
					</Link>
				</div>
			</div>

			<div className="min-h-[calc(100vh-67px)] flex items-center justify-center">
				<div className="bg-white rounded-2xl overflow-hidden shadow-2xl shadow-gray-200/60">
					{currentPage === 'login' ? (
						<LogIn setCurrentPage={setCurrentPage} />
					) : (
						<SignUp setCurrentPage={setCurrentPage} />
					)}
				</div>
			</div>
		</>
	)
}

export default AdminLogIn
