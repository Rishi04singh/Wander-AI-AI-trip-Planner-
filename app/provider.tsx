"use client";
import React, { use, useContext, useEffect, useState } from "react";
import Header from "./_components/Header";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { UserDetailContext } from "@/context/UserDetailContext";

function Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const createUser = useMutation(api.user.CreateNewUser);
  const [userDetail , setUserDetail]=useState<any>();

useEffect(() => {
  const syncUser = async () => {
    if (user) {
      // 1. Assign the result of the mutation to 'result'
      const result = await createUser({
        email: user.primaryEmailAddress?.emailAddress || "",
        name: user.fullName || "",
        imageUrl: user.imageUrl || "",
      });

      // 2. Now 'result' is defined and can be used here
      setUserDetail(result);
    }
  };

  syncUser();
}, [user, createUser]);

  return (
    <UserDetailContext.Provider value={{userDetail , setUserDetail}}>
    <div>
      <Header />
      {children}
    </div>
    </UserDetailContext.Provider>
  );
}

export default Provider;

export const useUserDetail = () => {
  return useContext(UserDetailContext);
}