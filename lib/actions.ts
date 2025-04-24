"use server"

import db from "@/prisma/prisma";

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id
      }
    })
    return user
  } catch (error) {
    console.log(error)
    return null
  }
}

export const getAccountByUserId = async (userId: string) => {
  try {
    const account = await db.account.findFirst({
      where: {
        userId
      }
    })
    return account
  } catch (error) {
    console.log(error)
    return null
  }
}
