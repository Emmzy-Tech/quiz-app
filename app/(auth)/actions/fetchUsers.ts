"use server"
import {prisma} from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export const fetchUsers = async () => {
  try {
    const clerkUser = await currentUser()
    let mongoUser = null
    mongoUser = await prisma.user.findUnique({
      where: {
        clerkUserId: clerkUser?.id
      }
    })

    if (!mongoUser) {
      let username = clerkUser?.username
      if (!username) {
        username = clerkUser?.firstName + " " + clerkUser?.lastName
      }
      const newUser: any = {
        clerkUserId: clerkUser?.id,
        username,
        email: clerkUser?.emailAddresses[0].emailAddress,
        profilePic: clerkUser?.imageUrl
      }
      mongoUser = await prisma.user.create({
        data: newUser
      })
    }

    const quizResults = await prisma.quizResult.findMany({
      where: {
        userId: mongoUser.id
      }
    })

    return {
      data: {
        user: mongoUser,
        quizResults
      }
    }
  } catch (error) {
    console.log(error)
  }
}
// "use server";
// import { prisma } from "@/lib/prisma";
// import { getAuth } from "@clerk/nextjs/server";

// export const fetchUsers = async () => {
//   try {
//     const { userId } = getAuth();
    
//     if (!userId) {
//       throw new Error("No user found");
//     }

//     // Fetch user from Clerk
//     const clerkUser = await clerkClient.users.getUser(userId);
//     let mongoUser = await prisma.user.findUnique({
//       where: { clerkUserId: clerkUser.id || undefined },
//     });

//     // Create a new user in MongoDB if none exists
//     if (!mongoUser) {
//       let username = clerkUser.username || `${clerkUser.firstName} ${clerkUser.lastName}`;
//       const newUser: any = {
//         clerkUserId: clerkUser.id,
//         username,
//         email: clerkUser.emailAddresses[0].emailAddress,
//         profilePic: clerkUser.imageUrl,
//       };
//       mongoUser = await prisma.user.create({
//         data: newUser,
//       });
//     }

//     // Fetch quiz results for the user
//     const quizResults = await prisma.quizResult.findMany({
//       where: { userId: mongoUser.id },
//     });

//     return {
//       data: {
//         user: mongoUser,
//         quizResults,
//       },
//     };
//   } catch (error) {
//     console.error("Error in fetchUsers:", error);
//     throw new Error(`Failed to fetch users: ${error.message}`);
//   }
// };