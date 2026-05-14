import dayjs from 'dayjs'
import PropTypes from 'prop-types'

const ProfileEducation = ({ education }) => {
	if (!education) return null

	return (
		<div>
			<h3 className='dark-text'>{education.school}</h3>

			<p>
				{dayjs(education.from).format('YYYY-MM-DD')} -{' '}
				{!education.to ? 'Now' : dayjs(education.to).format('YYYY-MM-DD')}
			</p>

			<p>
				<strong>Degree:</strong> {education.degree}
			</p>

			<p>
				<strong>Field of Study:</strong> {education.fieldofstudy}
			</p>

			<p>
				<strong>Description:</strong> {education.description}
			</p>
		</div>
	)
}

ProfileEducation.propTypes = {
	education: PropTypes.object
}

export default ProfileEducation
