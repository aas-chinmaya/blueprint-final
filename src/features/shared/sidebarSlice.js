





// // store/sidebarSlice.js
// import { createSlice } from "@reduxjs/toolkit";
// import { fullNav } from "@/constants/sidebarNavList";

// const initialState = {
//   navItems: [], // default empty, will be set based on role
// };

// const sidebarSlice = createSlice({
//   name: "sidebar",
//   initialState,
//   reducers: {
//     setSidebarByRole: (state, action) => {
//       const role = action.payload?.toLowerCase();

//       state.navItems = fullNav
//         .filter(item => item.roles.includes(role))
//         .map(item => {
//           if (item.items) {
//             const filteredItems = item.items.filter(sub => sub.roles.includes(role));
//             return { ...item, items: filteredItems };
//           }
//           return item;
//         });
//     },
//     clearSidebar: (state) => {
//       state.navItems = [];
//     }
//   }
// });

// export const { setSidebarByRole, clearSidebar } = sidebarSlice.actions;
// export default sidebarSlice.reducer;




// store/sidebarSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fullNav } from "@/constants/sidebarNavList";

const initialState = {
  navItems: [],
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setSidebarByRole: (state, action) => {
      const role = action.payload?.toLowerCase();

      state.navItems = fullNav
        .filter(item => item.roles.includes(role))
        .map(item => {
          if (item.items) {
            const filteredItems = item.items.filter(sub => sub.roles.includes(role));
            return { ...item, items: filteredItems };
          }
          return item;
        });
    },
    clearSidebar: (state) => {
      state.navItems = [];
    },
  },
});

export const { setSidebarByRole, clearSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;
