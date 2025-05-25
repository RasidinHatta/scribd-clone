import { RoleName } from "@/lib/generated/prisma";
import db from "./prisma";

async function seedRoles() {
  await db.role.create({
    data: {
      name: RoleName.ADMIN,
      description: "Administrator with full access",
      createDocument: true,
      updateDocument: true,
      deleteDocument: true,
      readDocument: true,
      createComment: true,
      deleteComment: true,
      readComment: true,
    },
  });

  await db.role.create({
    data: {
      name: RoleName.USER,
      description: "Authenticated user with standard permissions",
      createDocument: true,
      updateDocument: true,
      readDocument: true,
      createComment: true,
      deleteComment: true,
      readComment: true,
    },
  });

  await db.role.create({
    data: {
      name: RoleName.PUBLICUSER,
      description: "Guest user with limited read access",
      readDocument: true,
      readComment: true,
    },
  });
}

seedRoles().finally(() => db.$disconnect());
