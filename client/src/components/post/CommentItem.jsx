import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { deleteComment } from '../../actions/post'

const CommentItem = ({
	auth,
	postId,
	deleteComment,
	comment: { _id, text, name, avatar, user, date }
}) => (
	<div className='comments'>
		<div className='post bg-white p-1 my-1'>
			<div>
				<Link to={`/profile/${user}`}>
					<img className='round-img' src={avatar} alt='' />
					<h4>{name}</h4>
				</Link>
			</div>

			<div>
				<p className='my-1'>{text}</p>

				<p className='post-date'>
					Posted on {dayjs(date).format('MM/DD/YYYY')}
				</p>

				{!auth.loading && auth.user && user === auth.user._id && (
					<button
						onClick={() => deleteComment(postId, _id)} // ✅ FIX
						type='button'
						className='btn btn-danger'
					>
						<i className='fas fa-times' />
					</button>
				)}
			</div>
		</div>
	</div>
)

CommentItem.propTypes = {
	auth: PropTypes.object.isRequired,
	postId: PropTypes.number.isRequired,
	comment: PropTypes.object.isRequired,
	deleteComment: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
	auth: state.auth
})

export default connect(mapStateToProps, { deleteComment })(CommentItem)
