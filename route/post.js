const express = require('express')
const auth = require('../middleware/auth')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const Post = require('../models/Post')
const Profile = require('../models/profile')

//@routes POST api/post
//desc Create Post
//access Private
router.post(
	'/',
	[auth, [check('text', 'Text is required').not().isEmpty()]],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}
		try {
			const user = await User.findById(req.user.id).select('-password')
			const newPost = new Post({
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id
			})
			const post = await newPost.save()
			res.json(post)
		} catch (err) {
			console.error(err.message)
			res.status(500).send('server error')
		}
	}
)

//@routes GET api/post
//desc Get All Posts
//access Private
router.get('/', auth, async (req, res) => {
	try {
		const Posts = await Post.find().sort({ date: -1 })
		res.json(Posts)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('server error')
	}
})

//@routes GET api/post/:id
//desc Get Posts by Id
//access Private
router.get('/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)
		if (!post) {
			return res.status(404).json({ msd: 'Post not found' })
		}
		res.json(post)
	} catch (err) {
		console.error(err.message)
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msd: 'Post not found' })
		}
		res.status(500).send('server error')
	}
})

//@routes Delete api/post/:id
//desc Delete Post
//access Private
router.delete('/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)
		if (!post) {
			return res.status(404).json({ msg: 'Post not found' })
		}
		// Check if the user is authorized to delete the post
		if (post.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'User not authorized' })
		}
		// If the user is authorized, delete the post
		await Post.deleteOne({ _id: req.params.id })
		res.json({ msg: 'Post removed' })
	} catch (err) {
		console.error(err.message)
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post not found' })
		}
		res.status(500).send('Server error')
	}
})

//@routes Put api/post/like/:id
//desc Like Post
//access Private
router.put('/like/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)

		// Check if post alread Liked
		if (
			post.likes.filter(like => like.user.toString() == req.user.id).length > 0
		) {
			return res.status(400).json({ msg: 'Post already Liked' })
		}
		post.likes.unshift({ user: req.user.id })
		await post.save()
		res.json(post.likes)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('server error')
	}
})

//@routes Put api/post/unlike/:id
//desc Unlike Post
//access Private
router.put('/unlike/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)

		// Check if post alread Liked
		if (
			post.likes.filter(like => like.user.toString() == req.user.id).length ===
			0
		) {
			return res.status(400).json({ msg: 'Post has not yet been Like' })
		}
		// Get Remove Index
		const removeIndex = post.likes
			.map(like => like.user.toString())
			.indexOf(req.user.id)
		post.likes.splice(removeIndex, 1)

		await post.save()
		res.json(post.likes)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('server error')
	}
})

//@route   POST api/post/comment/:id
//@desc    Add comment to a post
//@access  Private

router.post(
	'/comment/:id',
	[auth, [check('text', 'Text is required').not().isEmpty()]],
	async (req, res) => {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		try {
			// 🔹 Get user
			const user = await User.findById(req.user.id).select('-password')

			// 🔹 Get post
			const post = await Post.findById(req.params.id)

			// ❗ FIX 1: Check if post exists
			if (!post) {
				return res.status(404).json({ msg: 'Post not found' })
			}

			// 🔹 Create comment
			const newComment = {
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id
			}

			// 🔹 Add comment to beginning
			post.comments.unshift(newComment)

			await post.save()

			// 🔹 Return updated comments
			res.json(post.comments)
		} catch (err) {
			console.error(err.message)
			res.status(500).send('Server error')
		}
	}
)

//@routes Delete api/post/comment/:id/comment_id
//desc Delete Comment
//access Private

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)

		// Pull out the comment
		const comment = post.comments.find(
			comment => comment.id === req.params.comment_id
		)

		// Make sure the comment exists
		if (!comment) {
			return res.status(404).json({ msg: 'Comment does not exist' })
		}

		// Check if the user is authorized to delete the comment
		if (comment.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'User not authorized' })
		}

		// Get the index of the comment to remove
		const removeIndex = post.comments.findIndex(
			comment => comment.id === req.params.comment_id
		)
		post.comments.splice(removeIndex, 1)

		// Save the updated post
		await post.save()

		res.json(post.comments)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Server error')
	}
})

module.exports = router
