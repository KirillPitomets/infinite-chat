"use server"

import type {User} from "@/prisma/generated/client"

import {prisma} from "@/lib/prisma"

export async function createUser() {
  try {
    const user: User = await prisma.user.create({
      data: {
        email: "apelsinka220405@gmail.com",
        name: "Username",
        password: "password",
        tag: "@yaKirusha"
      }
    })

    if (!user) {
      console.log(user)
      throw new Error("no user")
    }
    return user
  } catch (err) {
    console.log(err)
  }
}
