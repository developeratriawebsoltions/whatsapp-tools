import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { connectDB } from "@/app/lib/db";
import User from "@/app/models/user";

export async function POST(req: Request) {

    try{
      await connectDB();

      const { email, password, name } = await req.json();
      if (!email || !password || !name) {
        return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
        );
      }

    const existingUser = await User.findOne({email});

    if (existingUser){
        return NextResponse.json(
            { error: "User already exists" },
            { status: 409 }
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({name, email, password: hashedPassword});
    await newUser.save();

    const token = jwt.sign(
        { userId: newUser._id },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
    );

    return NextResponse.json({ token });

return NextResponse.json({success: true, 
    token,
    user: {
        id: newUser._id, 
        name: newUser.name, 
        email: newUser.email
    }
}, {status: 201}
)    

    } catch (error) {
        return NextResponse.json(
            { error: "An error occurred while processing the request." },
            { status: 500 }
        );
    }
}