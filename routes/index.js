const router = require('express-promise-router')()
const { protectRoute } = require('../middleware/auth-handler')

// const Story = require('../models/Story')

// @desc    Login/Landing page
// @route   GET /
router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/dashboard')
    } else {
        res.render('login', {
            layout: 'login'
        })
    }
})

// @desc    Dashboard
// @route   GET /dashboard
router.get('/dashboard', protectRoute, async (req, res) => {
    try {
        // const stories = await Story.find({ user: req.user.id }).lean()

        res.render('dashboard', {
            name: req.user.firstName,
            // stories
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports = router
