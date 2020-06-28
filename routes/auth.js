const router = require('express-promise-router')()
const passport = require('passport')

// @desc    Auth with Google -- *** hitting this endpoint will re-direct you to Google OAuth Login page ***
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication. Redirect to Home
        res.redirect('/dashboard')
    }
)

// @desc    Logout user
// @route   /auth/logout
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router
