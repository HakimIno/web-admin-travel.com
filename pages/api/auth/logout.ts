import { serialize } from "cookie";

export default async function handler(req: any, res: any) {
    const { cookies } = req;

    const jwt = cookies.OursiteJWT;

    if (!jwt) {
        return res.json({ message: "Bro you are already not logged in..." });
    } else {
        const serialized = serialize("OursiteJWT", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: -1,
            path: "/",
        });

        res.setHeader("Set-Cookie", serialized);

        res.status(200).json({ message: "Successfully logged out!" });
    }
}





