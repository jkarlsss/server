import { getAllUsers } from "../../appwrite/auth"
import { columns } from "../../components/columns"
import { DataTable } from "../../components/data-table"
import Header from "../../components/Header"
import type { Route } from "./+types/all-users"

export const loader = async () => {
  const { users, total } = await getAllUsers(10, 0);
  return { users, total };
}

const AllUsers = ({ loaderData }: Route.ComponentProps ) => {

  const {users} = loaderData;
  console.log(users);
  
  return (
    <main className="all-users wrapper">
      <Header 
        title="Manage Users"
        description="Track Activity users in real time"
      />
      <DataTable columns={columns} data={users} />
    </main>
  )
}

export default AllUsers