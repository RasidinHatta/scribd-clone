import { schema } from "@/lib/schema";
import { executeAction } from "@/lib/executeAction";
import db from "@/prisma/prisma";

const signUp = async (formData: FormData) => {
  return executeAction({
    actionFn: async () => {
      const email = formData.get("email");
      const password = formData.get("password");
      const validatedData = schema.parse({ email, password });
      await db.user.create({
        data: {
          email: validatedData.email.toLocaleLowerCase(),
          password: validatedData.password,
        },
      });
    },
    successMessage: "Signed up successfully",
  });
};

export { signUp };

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
