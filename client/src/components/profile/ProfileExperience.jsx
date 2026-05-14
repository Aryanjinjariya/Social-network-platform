import dayjs from 'dayjs'
import PropTypes from 'prop-types'

const ProfileExperience = ({ experience }) => {
	if (!experience) return null

	return (
		<div>
			<h3 className='dark-text'>{experience.company}</h3>

			<p>
				{dayjs(experience.from).format('YYYY-MM-DD')} -{' '}
				{!experience.to ? 'Now' : dayjs(experience.to).format('YYYY-MM-DD')}
			</p>

			<p>
				<strong>Position:</strong> {experience.title}
			</p>

			<p>
				<strong>Location:</strong> {experience.location}
			</p>

			<p>
				<strong>Description:</strong> {experience.description}
			</p>
		</div>
	)
}

ProfileExperience.propTypes = {
	experience: PropTypes.object
}

export default ProfileExperience
