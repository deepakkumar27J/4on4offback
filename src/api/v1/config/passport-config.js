const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./../models/user.model');
const jwt = require('jsonwebtoken');


passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    // Create a new user if not found
                    user = new User({
                        googleId: profile.id,
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        startDate:Date.now()
                    });
                    await user.save();
                }

                const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
                    expiresIn: '1h',
                });

                done(null, { user, token });
            } catch (error) {
                done(error, null);
            }
        }
    )
);

// Serialize and deserialize user (required by Passport)
passport.serializeUser((data, done) => {
    done(null, data);
});
passport.deserializeUser((data, done) => {
    done(null, data);
});