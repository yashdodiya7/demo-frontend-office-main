"use server"

import { RegisterSchema } from "@/schemas/RegisterSchema";
import { redirect } from "next/navigation";
import * as z from "zod";


export const registerAction = async (values: z.infer<typeof RegisterSchema>) => {
    // const validatedFields = RegisterSchema.safeParse(values);

    // console.log(values)

    const { name, email, password, password2 } = values;

    // console.log(validatedFields);

    // if (!validatedFields.success) {
    //     return { error: "Invalid Fields" }
    // }

    // return { success: "Email sent!" }

    const response = await fetch('http://127.0.0.1:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, password2, name }),
    })

    if (response.ok) {
        redirect("/profile")
        // return { success: "registration success" }
    } else {
        // Handle errors
        const errorData = await response.json();
        if (errorData.email) {
            return { error: errorData.email[0] }
        }
        if (errorData.password) {
            return { error: errorData.password[0] }
        }
        return { error: "Something went wrong!" };
    }
}