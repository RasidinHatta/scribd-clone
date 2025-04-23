import { RegisterSchema } from "@/lib/schemas";
import { executeAction } from "@/lib/executeAction";
import db from "@/prisma/prisma";

const signUp = async (formData: FormData) => {
  return executeAction({
    actionFn: async () => {
      const email = formData.get("email");
      const name = formData.get("name");
      const password = formData.get("password");
      const passwordConfirmation = formData.get("passwordConfirmation");

      const validatedData = RegisterSchema.parse({
        email,
        name,
        password,
        passwordConfirmation,
      });

      // Optionally: Check if passwords match
      if (validatedData.password !== validatedData.passwordConfirmation) {
        throw new Error("Passwords do not match");
      }

      await db.user.create({
        data: {
          email: validatedData.email.toLowerCase(),
          name: validatedData.name,
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
