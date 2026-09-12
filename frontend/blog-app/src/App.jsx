import { Toaster } from 'react-hot-toast';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import UserProvider from './context/userContext';
import AdminLogIn from './pages/Admin/AdminLogIn';
import BlogPostEditor from './pages/Admin/BlogPostEditor';
import BlogPosts from './pages/Admin/BlogPosts';
import Comments from './pages/Admin/Comments';
import Dashboard from './pages/Admin/Dashboard';
import BlogLandingPage from './pages/Blog/BlogLandingPage';
import BlogPostView from './pages/Blog/BlogPostView';
import PostByTags from './pages/Blog/PostByTags';
import SearchPosts from './pages/Blog/SearchPosts';
import PriveRoute from './routes/PrivateRoute';

const App = () => {
	return (
		<UserProvider>
			<div>
				<Router>
					<Routes>
						{/* default route */}
						<Route path="/" element={<BlogLandingPage />} />
						<Route path="/:slug" element={<BlogPostView />} />
						<Route path="/tag/:tagName" element={<PostByTags />} />
						<Route path="/search" element={<SearchPosts />} />

						{/* admin routes */}
						<Route element={<PriveRoute allowedRoles={['admin']} />}>
							<Route path="/admin/dashboard" element={<Dashboard />} />
							<Route path="/admin/posts" element={<BlogPosts />} />
							<Route path="/admin/create" element={<BlogPostEditor />} />
							<Route path="/admin/edit/:postSlug" element={<BlogPostEditor isEdit={true} />} />
							<Route path="/admin/comments" element={<Comments />} />
						</Route>

						<Route path="/admin-login" element={<AdminLogIn />} />
					</Routes>
				</Router>

				<Toaster
					toastOptions={{
						className: '',
						style: { fontSize: '13px' },
					}}
				/>
			</div>
		</UserProvider>
	);
};

export default App;
