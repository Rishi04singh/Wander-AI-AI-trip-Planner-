"use client";
import React, { useContext, useEffect, useState } from "react";
import Header from "./_components/Header";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { LanguageProvider } from "@/context/LanguageContext";

function Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const createUser = useMutation(api.user.CreateNewUser);
  const [userDetail, setUserDetail] = useState<any>();

  useEffect(() => {
    const syncUser = async () => {
      if (user) {
        const result = await createUser({
          email: user.primaryEmailAddress?.emailAddress || "",
          name: user.fullName || "",
          imageUrl: user.imageUrl || "",
        });

        setUserDetail(result);
      }
    };

    syncUser();
  }, [user, createUser]);

  return (
    <LanguageProvider>
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        <div>
          <Header />
          {children}
        </div>
      </UserDetailContext.Provider>
    </LanguageProvider>
  );
}

export default Provider;

export const useUserDetail = () => {
  return useContext(UserDetailContext);
};
