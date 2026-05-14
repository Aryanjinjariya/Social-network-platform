const express = require('express')
const request = require('request')
const axios = require('axios')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/User')
const Profile = require('../models/profile')
const { check, validationResult } = require('express-validator')
//@routes GET api/profile/me
//desc Get current user profile
//access private
router.get('/me', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id }).populate(
			'user',
			['name', 'avatar']
		)
		if (!profile) {
			return res.status(400).json({ msg: 'There is no profile for this user' })
		}
		res.json(profile)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('server error')
	}
})

//@routes Post api/profile
//desc create or update user profile
//access private

router.post(
	'/',
	[
		auth,
		[
			check('status', 'status  is reqyired').not().isEmpty(),
			check('skills', 'skills is required').not().isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}
		const {
			company,
			website,
			location,
			bio,
			skills,
			status,
			linkedin,
			instagram,
			youtube,
			twitter,
			facebook,
			githubusername
		} = req.body
		//build profile object
		const profileFields = {}
		profileFields.user = req.user.id
		if (company) profileFields.company = company
		if (website) profileFields.website = website
		if (location) profileFields.location = location
		if (status) profileFields.status = status
		if (bio) profileFields.bio = bio
		if (githubusername) profileFields.githubusername = githubusername
		if (skills) {
			profileFields.skills = skills.split(',').map(skills => skills.trim())
		}
		//build social object
		profileFields.socials = {}
		if (youtube) profileFields.socials.youtube = youtube
		if (instagram) profileFields.socials.instagram = instagram
		if (facebook) profileFields.socials.facebook = facebook
		if (linkedin) profileFields.socials.linkedin = linkedin
		if (twitter) profileFields.socials.twitter = twitter

		let profile = await Profile.findOne({ user: req.user.id })
		try {
			if (profile) {
				//update
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true }
				)
				return res.json(profile)
			}
			//create
			profile = new Profile(profileFields)
			await profile.save()
			res.json(profile)
		} catch (err) {
			console.error(err.message)
			res.status(500).send('Server Error')
		}
	}
)

//@routes Get api/profile
//desc Get all profile
//access public

router.get('/', async (req, res) => {
	try {
		const profile = await Profile.find().populate('user', ['name', 'avatar'])
		res.json(profile)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('server error')
	}
})
//@routes Get api/profile/user/:user_id
//desc Get profile by user_id
//access public

router.get('/user/:user_id', async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.params.user_id
		}).populate('user', ['name', 'avatar'])

		if (!profile) {
			return res.status(400).json({ msg: 'profile not found' })
		}
		res.json(profile)
	} catch (err) {
		console.error(err.message)
		if (err.kind == 'ObjectId') {
			return res.status(400).json({ msg: 'profile not found' })
		}
		res.status(500).send('server error')
	}
})
//@routes Delete api/profile
//desc Delete Profile,user& post
//access private

router.delete('/', auth, async (req, res) => {
	try {
		//Profile delete posts
		await Profile.deleteMany({ user: req.user.id })

		// Delete user
		await User.findOneAndDelete({ _id: req.user.id })

		// Delete profile
		await Profile.findOneAndDelete({ user: req.user.id })

		res.json({ msg: 'User Deleted' })
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Server Error')
	}
})

/*const mongoose = require('mongoose')
router.delete('/', auth, async (req, res) => {
	let session
	try {
		// Start a session
		session = await mongoose.startSession()
		session.startTransaction()

		//@todo delete posts (if necessary)

		// Delete Profile
		await Profile.findOneAndDelete({ user: req.user_id }).session(session)

		// Delete User
		await User.findOneAndDelete({ _id: req.user.id }).session(session)

		// Commit the transaction
		await session.commitTransaction()
		session.endSession()

		res.json({ msg: 'User Deleted' })
	} catch (err) {
		// If an error occurs during the deletion process, abort the transaction and handle the error
		if (session) {
			await session.abortTransaction()
			session.endSession()
		}
		console.error(err.message)
		res.status(500).send('Server Error')
	}
})*/

//@routes Put api/profile/experience
//desc Add experience
//access private

router.put(
	'/experience',
	[
		auth,
		[
			check('title', 'title is required').not().isEmpty(),
			check('company', 'company is required').not().isEmpty(),
			check('from', 'from date is required').not().isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}
		const { title, company, location, from, to, current, description } =
			req.body
		const newEXP = { title, company, location, from, to, current, description }
		try {
			const profile = await Profile.findOne({ user: req.user.id })
			profile.experience.unshift(newEXP)
			await profile.save()
			res.json(profile)
		} catch (err) {
			console.error(err.message)
			res.status(500).send('server error')
		}
	}
)
//@routes Delete api/profile/experience/:exp_id
//desc Delete experience
//access private
router.delete('/experience/:exp_id', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id })
		// Get Remove Index
		const removeIndex = profile.experience
			.map(item => item.id)
			.indexOf(req.params.exp_id)
		profile.experience.splice(removeIndex, 1)
		await profile.save()

		res.json(profile)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('server error')
	}
})

//@routes Put api/profile/education
//desc Add education
//access private

router.put(
	'/education',
	[
		auth,
		[
			check('school', 'school is required').not().isEmpty(),
			check('degree', 'degree is required').not().isEmpty(),
			check('fieldofstudy', 'fieldofstudy is required').not().isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}
		const { school, degree, fieldofstudy, from, to, current, description } =
			req.body
		const newEDU = {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description
		}
		try {
			const profile = await Profile.findOne({ user: req.user.id })
			profile.education.unshift(newEDU)
			await profile.save()
			res.json(profile)
		} catch (err) {
			console.error(err.message)
			res.status(500).send('server error')
		}
	}
)
//@routes Delete api/profile/education/:edu_id
//desc Delete education
//access private
router.delete('/education/:edu_id', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id })
		// Get Remove Index
		const removeIndex = profile.education
			.map(item => item.id)
			.indexOf(req.params.exp_id)
		profile.education.splice(removeIndex, 1)
		await profile.save()

		res.json(profile)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('server error')
	}
})

// @route   GET api/profile/github/:username
// @desc    Get GitHub repos
// @access  Public

router.get('/github/:username', async (req, res) => {
	try {
		const token = process.env.GITHUB_TOKEN

		const response = await axios.get(
			`https://api.github.com/users/${req.params.username}/repos`,
			{
				params: {
					per_page: 5,
					sort: 'created:asc'
				},
				headers: {
					Accept: 'application/vnd.github.v3+json',
					Authorization: `Bearer ${token}`
				}
			}
		)

		res.json(response.data)
	} catch (err) {
		console.error('🔥 GitHub ERROR:', err.response?.data || err.message)

		res.status(err.response?.status || 500).json({
			msg: err.response?.data?.message || 'Server Error'
		})
	}
})
module.exports = router
