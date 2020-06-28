const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User')

module.exports = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.CALLBACK_URL           // ex) http://www.example.com/auth/google/callback
                // callbackURL: '/auth/google/callback'
            },
            async (accessToken, refreshToken, profile, done) => {

                console.log(`accessToken = ${accessToken}`)
                console.log(`refreshToken = ${refreshToken}`)

                console.log('----------  google profile  -------------')
                console.log(profile)

                /*
accessToken = ya29.a0AfH6SMB12xY8FRh-2t0NMREzoE-PLn-X1gT8BpKPg_wH3nr4L0E...
refreshToken = undefined

{
  id: '108064432194431854617',
  displayName: 'ChrisRo Dev',
  name: { familyName: 'Dev', givenName: 'ChrisRo' },
  photos: [
    {
      value: 'https://lh3.googleusercontent.com/-sNVF8il7apk/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmQNEyHXU9JHUNl0HAYzNrn5Ms1qw/photo.jpg'
    }
  ],
  provider: 'google',
  _raw: '{\n' +
    '  "sub": "108064432194431854617",\n' +
    '  "name": "ChrisRo Dev",\n' +
    '  "given_name": "ChrisRo",\n' +
    '  "family_name": "Dev",\n' +
    '  "picture": "https://lh3.googleusercontent.com/-sNVF8il7apk/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmQNEyHXU9JHUNl0HAYzNrn5Ms1qw/photo.jpg",\n' +
    '  "locale": "en"\n' +
    '}',
  _json: {
    sub: '108064432194431854617',
    name: 'ChrisRo Dev',
    given_name: 'ChrisRo',
    family_name: 'Dev',
    picture: 'https://lh3.googleusercontent.com/-sNVF8il7apk/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmQNEyHXU9JHUNl0HAYzNrn5Ms1qw/photo.jpg',
    locale: 'en'
  }
}
                */

                const newUser = {
                    googleId: profile.id,
                    displayName: profile.displayName,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    image: profile.photos[0].value,
                }

                try {
                    let user = await User.findOne({ googleId: profile.id })
                    if (!user) {
                        user = await User.create(newUser)
                    }
                    done(null, user)
                } catch (err) {
                    console.error(err)
                }
            }
        )
    )

    // below serializeUser & deserializeUser are required to persist user into session
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
    })
}
