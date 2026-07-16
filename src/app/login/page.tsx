"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function LoginPage() {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    async function login() {
        const result = await signIn(
            "credentials",
            {
                email,
                password,
                redirect: false
            }
        );

        if (!result?.error) {
            router.push("/dashboard");
        }

    }


    return (

        <div>

            <h1>
                Login
            </h1>


            <input
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />


            <input
                placeholder="Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
            />


            <button onClick={login}>
                Login
            </button>


        </div>

    )

}