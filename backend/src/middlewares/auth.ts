import passport from "passport";
import { Request } from "express";
import { Strategy as Jwtstrategy, ExtractJwt } from "passport-jwt";

export function init() {
    function extractor(req: Request): string | null {
        return req.cookies["auth-token"] ?? null;
    }

    passport.use(
        "jwt",
        new Jwtstrategy(
            {
                secretOrKey: process.env.PASSWORD_JWT_SECRET!,
                jwtFromRequest: ExtractJwt.fromExtractors([extractor])
            },
            async (token, done) => {
                try {
                    return done(null, { id: token.id });
                } catch (error) {
                    done(error);
                }
            }
        )
    );
}


export function authRequired() {
    return passport.authenticate("jwt", { session: false });
}
