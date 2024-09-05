"use client";

import { usePathname } from "next/navigation";
import { fetchUsers } from "@/app/(auth)/actions/fetchUsers";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPublicRoute = ["sign-in", "sign-up"].includes(
    pathname.split("/")[1]
  );

  const getNavbar = () => {
    if (isPublicRoute) return null;
    return <Navbar />;
  };

  const getFooter = () => {
    if (isPublicRoute) return null;
    return <Footer />;
  };

  const getContent = () => {
    if (isPublicRoute) return null;
    return <>{children}</>;
  };

  const getCurrentUser = async () => {
    try {
      const response: any = await fetchUsers();
      if (response.error)
        throw new Error(response.error.message);
    } catch (error) {
      console.log(error);
    } finally {
      return;
    }
  };
  // const getCurrentUser = async () => {
  //   try {
  //     const response: any = await fetchUsers();
  
  //     // Check if response is null or undefined
  //     if (!response || !response.data) {
  //       throw new Error("Failed to fetch user data");
  //     }
  
  //     // Access the user and quiz results
  //     const { user, quizResults } = response.data;
  
  //     // Do something with the user and quizResults
  //     console.log("User: ", user);
  //     console.log("Quiz Results: ", quizResults);
  
  //   } catch (error) {
  //     console.error("Error fetching user:", error);
  //   }
  // };

  useEffect(() => {
    if (!isPublicRoute) getCurrentUser();
  }, []);

  return (
    <div className="min-h-screen bg-secondary flex flexCol justify-between">
      {getNavbar()}
      {getContent()}
      {getFooter()}
    </div>
  );
}

export default LayoutProvider;
