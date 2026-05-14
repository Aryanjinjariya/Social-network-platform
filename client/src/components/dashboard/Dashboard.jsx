import PropTypes from 'prop-types'
import { Fragment, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { deleteAccount, getCurrentProfile } from '../../actions/profile'
import Spinner from '../layout/Spinner'
import DashboardActions from './DashboardActions'
import Education from './Education'
import Experiences from './Experiences'

const Dashboard = ({
	getCurrentProfile,
	deleteAccount,
	isAuthenticated,
	auth: { user },
	profile: { profile, profileLoading }
}) => {
	useEffect(() => {
		if (isAuthenticated && !profile && !profileLoading) {
			getCurrentProfile()
		}
	}, [isAuthenticated, profile, profileLoading, getCurrentProfile])

	return profileLoading && profile === null ? (
		<Spinner />
	) : (
		<Fragment>
			<h1 className='large text-primary'>Dashboard</h1>
			<p className='lead'>
				<i className='fas fa-user'></i> Welcome {user && user.name}
			</p>
			{profile !== null ? (
				<Fragment>
					<DashboardActions />
					<Experiences experience={profile.experience} />
					<Education education={profile.education} />
					<div className='my-2'>
						<button className='btn btn-danger' onClick={() => deleteAccount()}>
							<i className='fas fa-trash'></i> Delete My Account
						</button>
					</div>
				</Fragment>
			) : (
				!profileLoading && (
					<Fragment>
						<p>You have not yet set up a profile, please add some info</p>
						<Link to='/create-profile' className='btn btn-primary my-1'>
							Create Profile
						</Link>
					</Fragment>
				)
			)}
		</Fragment>
	)
}

Dashboard.propTypes = {
	getCurrentProfile: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool.isRequired,
	profile: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated,
	profile: state.profile,
	auth: state.auth
})

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
	Dashboard
)
