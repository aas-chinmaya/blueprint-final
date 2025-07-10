// import FetchAllProjects from "@/modules/project/FetchAllProjects";




// export default function Page() {
//   return (
//     <>
//       <div className="px-4 lg:px-6">
// <FetchAllProjects />
        
//       </div>
//     </>
//   );
// }


'use client';

import FetchAllProjects from "@/modules/project/FetchAllProjects";
import MyWorkedProject from "@/modules/project/MyWorkedProject";
import { useCurrentUser } from "@/hooks/useCurrentUser"; // Adjust path as needed

export default function Page() {
  const { currentUser, loading } = useCurrentUser();
  return (
    <div className="px-4 lg:px-6">
      {currentUser?.role === "cpc" ? <FetchAllProjects /> : <MyWorkedProject projectId={currentUser?.id} />}
    </div>
  );
}


