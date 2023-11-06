import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import UserDto from '../dto/userDto.js';
import tokenService from '../services/tokenService.js';

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.API_URL}/api/auth/callback/google` // Это URL для обратного вызова после авторизации на Google
    }, async (accessToken, refreshToken, profile, done) => {
        // Проверка пользователя в базе данных
        let user = await User.findOne({ google_id: profile.id });

        if (!user) {
            // Если пользователь не найден, создаем нового
            user = new User({
                google_id: profile.id,
                login: profile.displayName,
                email: profile.emails[0].value,
                full_name: profile.displayName
                // Здесь вы можете добавить больше полей, если требуется
            });
            await user.save();

        }
        else if (user) {
            return done(new Error("User already exists!"), false);
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        done(null, { userDto, tokens });
    })
);
