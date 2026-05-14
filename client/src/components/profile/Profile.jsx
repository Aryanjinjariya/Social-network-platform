import PropTypes from 'prop-types'
import { Fragment, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { getProfileById } from '../../actions/profile'
import Spinner from '../layout/Spinner'
import ProfileAbout from './ProfileAbout'
import ProfileEducation from './ProfileEducation'
import ProfileExperience from './ProfileExperience'
import ProfileGithub from './ProfileGithub'
import ProfileTop from './ProfileTop'

const Profile = ({ getProfileById, profile: { profile, loading }, auth }) => {
	const { id } = useParams()
	useEffect(() => {
		getProfileById(id)
	}, [id])
	return (
		<Fragment>
			{profile === null || loading ? (
				<Spinner />
			) : (
				<Fragment>
					<Link to='/profiles' className='btn btn-light'>
						Back To Profiles
					</Link>
					{auth.isAuthenticated &&
						auth.loading === false &&
						auth.user._id === profile.user._id && (
							<Link to='/edit-profile' className='btn btn-dark'>
								Edit Profile
							</Link>
						)}
					<div className='profile-grid my-1'>
						{/* ProfileTop */}
						<ProfileTop profile={profile} />
						{/* ProfileAbout */}
						<ProfileAbout profile={profile} />

						<div className='profile-exp bg-white p-2'>
							<h2 className='text-primary'>Experience</h2>
							{profile.experience.length > 0 ? (
								profile.experience.map(exp => (
									<ProfileExperience key={exp._id} experience={exp} />
								))
							) : (
								<h4>No experience credentials</h4>
							)}
						</div>

						<div className='profile-edu bg-white p-2'>
							<h2 className='text-primary'>Education</h2>
							{profile.education.length > 0 ? (
								profile.education.map(edu => (
									<ProfileEducation key={edu._id} education={edu} />
								))
							) : (
								<h4>No education credentials</h4>
							)}
						</div>
						<div className='profile-github'>
							{profile.githubusername && (
								<ProfileGithub username={profile.githubusername} />
							)}
						</div>
					</div>
				</Fragment>
			)}
		</Fragment>
	)
}

Profile.propTypes = {
	getProfileById: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
	profile: state.profile,
	auth: state.auth
})

export default connect(mapStateToProps, { getProfileById })(Profile)
