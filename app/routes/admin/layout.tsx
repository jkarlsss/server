import { Outlet, redirect } from "react-router";

import { getExistingUser, logoutUser, storeUserData } from "../../appwrite/auth";
import { account } from "../../appwrite/client";
import { AdminSidebar } from "../../components/admin-sidebar";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";

export async function clientLoader() {
  try {

    const user = await account.get();

    if (!user.$id) return redirect("/sign-in");

    const existingUser = await getExistingUser(user.$id);

    if (existingUser?.status === "user") return redirect("/user");

    return existingUser?.$id ? existingUser : await storeUserData();
  } catch (error) {
    console.log("clientLoader", error);
    return redirect("/sign-in");
  }
}

export function HydrateFallback() {
  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-2xl">Loading Game...</h1>
    </div>
  );
}

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="w-full h-full bg-yellow-50 pt-5">
        <SidebarTrigger className="md:hidden" />
        <Outlet />
      </main>
    </SidebarProvider>
  );
};

export default AdminLayout;
