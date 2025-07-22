

'use client';

import FetchAllProjects from "@/modules/project/FetchAllProjects";
import MyWorkedProject from "@/modules/project/MyWorkedProject";
import { useLoggedinUser } from "@/hooks/useLoggedinUser";

export default function Page() {
  const { currentUser, loading } = useLoggedinUser();
  console.log(currentUser)
  return (
    <div className="px-4 lg:px-6">
      {currentUser?.position === "CPC" ? <FetchAllProjects /> : <MyWorkedProject employeeId={currentUser?.employeeID} />}
    </div>
  );
}


