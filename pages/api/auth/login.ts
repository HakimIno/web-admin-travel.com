import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

const secret = process.env.SECRET;

export default async function handler(req: any, res: any) {
    const { username, password } = req.body;

    if (username === "admin" && password === "1234") {
        const token = sign(
            {
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
                username: username,
            },
            secret as string
        );

        const serialized = serialize("OursiteJWT", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 30,
            path: "/",
        });

        res.setHeader("Set-Cookie", serialized);

        res.status(200).json({ message: "Success!" });
    } else {
        res.status(401).json({ message: "Invalid credentials!" });
    }
}
