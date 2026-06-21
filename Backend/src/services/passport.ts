import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { env } from "../config/env";

passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((obj: any, done) => done(null, obj));

if (env.googleClientId && env.googleClientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.googleClientId,
        clientSecret: env.googleClientSecret,
        callbackURL: `${env.clientUrl}/api/v1/auth/google/callback`,
      },
      (_accessToken: string, _refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
        done(null, {
          provider: "google",
          providerId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value,
          avatar: profile.photos?.[0]?.value,
        });
      }
    )
  );
}

if (env.githubClientId && env.githubClientSecret) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: env.githubClientId,
        clientSecret: env.githubClientSecret,
        callbackURL: `${env.clientUrl}/api/v1/auth/github/callback`,
        scope: ["user:email"],
      },
      (_accessToken: string, _refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
        done(null, {
          provider: "github",
          providerId: profile.id,
          name: profile.displayName || profile.username,
          email: profile.emails?.[0]?.value,
          avatar: profile.photos?.[0]?.value,
        });
      }
    )
  );
}

export default passport;
