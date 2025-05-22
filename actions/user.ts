import { auth } from "@/auth";
import db from "@/prisma/prisma";

export const twoFactorOption = async (enable: boolean) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    await db.user.update({
      where: { id: session.user.id },
      data: { twoFactorEnabled: enable },
    });

    return { success: `Two-Factor Authentication ${enable ? "enabled" : "disabled"}` };
  } catch (error) {
    console.error("2FA toggle error:", error);
    return { error: "Something went wrong while updating 2FA preference" };
  }
};

