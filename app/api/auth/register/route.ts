import { NextRequest, NextResponse } from "next/server"
import { addUser, findUserByEmail } from "@/lib/user-store"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      )
    }

    // Create new user
    const newUser = addUser({ name, email, password })

    console.log("User registered successfully:", { id: newUser.id, name, email })

    return NextResponse.json(
      { 
        message: "Account created successfully", 
        userId: newUser.id,
        user: { id: newUser.id, name: newUser.name, email: newUser.email }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
