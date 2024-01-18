// // import { createContext, useState } from "react";

// // export const AuthContext = createContext(null);

// // const AuthProvider = ({ children }:{children:any}) => {
// //   const [user, setUser] = useState(null);

// //   const login = (userData:{}|any) => {

// //     setUser(userData);
// //   };

// //   const logout = () => {
// //     setUser(null);
// //   };

// //   return (
// //     <AuthContext.Provider value={{ user, login, logout }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };

// // export default AuthProvider;


// import { createContext, useState } from "react";

// export const AuthContext = createContext(null);


// export default function Context({children}:{children:any}){
//     const [ user, setUser ] = useState(null)
//     return (
//         <>
//         <AuthContext.Provider value={{user, setUser}}>
//             {children}
//         </AuthContext.Provider>
//         </>
//     )
// }

