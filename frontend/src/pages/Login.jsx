// frontend/src/pages/Login.jsx

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, Crown, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios"; // Used for the initial non-authenticated login POST
import api from "@/api/api"; //  custom Axios instance for setting auth headers

const API_URL = "http://localhost:5000/api/auth/login";

export default function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("tenant");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      // 1. API Call: Send credentials to Express backend
      const res = await axios.post(API_URL, {
        email: email,
        password: password,
        role: selectedRole,
      });

      const { token, user } = res.data;

      // 2. Store token and user role in LocalStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", user.role);

      //  Set the Authorization header directly on the
      //    custom 'api' instance. This bypasses the timing conflict
      //    and guarantees the token is sent with dashboard requests.
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // 3. Display success message
      toast.success(`Successfully logged in as ${user.role}`);

      // 4. Navigate to appropriate dashboard
      if (user.role === "owner") {
        navigate("/owner/dashboard");
      } else {
        navigate("/tenant/dashboard");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Check your credentials.";
      toast.error(message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="bg-gradient-primary rounded-full h-16 w-16 mx-auto mb-4 flex items-center justify-center">
            <Building className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">
            PG Management Portal
          </h1>
          <p className="text-muted-foreground">Choose your role to continue</p>
        </div>
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            {/* Role Selection Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-muted p-1 rounded-lg">
              <Button
                type="button"
                variant={selectedRole === "owner" ? "default" : "ghost"}
                className={`flex items-center gap-2 ${
                  selectedRole === "owner"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }`}
                onClick={() => setSelectedRole("owner")}
              >
                <Crown className="h-4 w-4" />
                Owner
              </Button>
              <Button
                type="button"
                variant={selectedRole === "tenant" ? "default" : "ghost"}
                className={`flex items-center gap-2 ${
                  selectedRole === "tenant"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }`}
                onClick={() => setSelectedRole("tenant")}
              >
                <User className="h-4 w-4" />
                Tenant
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tenant@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading} // Use loading state
                className="w-full bg-gradient-primary text-white hover:opacity-90"
              >
                {isLoading
                  ? "Logging In..."
                  : `Login as ${selectedRole === "owner" ? "Owner" : "Tenant"}`}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Demo: Use any credentials to explore the portal
              </p>
              <Button
                variant="link"
                onClick={() => navigate("/signup")}
                className="text-primary hover:text-primary-glow"
              >
                Don't have an account? Sign up
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-muted-foreground"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}














// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Building, Crown, User } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// export default function Login() {
//   const navigate = useNavigate();
//   const [selectedRole, setSelectedRole] = useState("tenant");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = (e) => {
//     e.preventDefault();

//     // Dummy authentication - accepts any email/password
//     if (!email || !password) {
//       toast.error("Please fill in all fields");
//       return;
//     }

//     // Store dummy user data in localStorage
//     const userData = {
//       email,
//       role: selectedRole,
//       name: selectedRole === "owner" ? "John Owner" : "Jane Tenant",
//     };
//     localStorage.setItem("user", JSON.stringify(userData));

//     toast.success(`Successfully logged in as ${selectedRole}`);

//     // Navigate to appropriate dashboard
//     if (selectedRole === "owner") {
//       navigate("/owner/dashboard");
//     } else {
//       navigate("/tenant/dashboard");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* Logo */}
//         <div className="text-center mb-8">
//           <div className="bg-gradient-primary rounded-full h-16 w-16 mx-auto mb-4 flex items-center justify-center">
//             <Building className="h-8 w-8 text-white" />
//           </div>
//           <h1 className="text-2xl font-bold text-primary mb-2">
//             PG Management Portal
//           </h1>
//           <p className="text-muted-foreground">Choose your role to continue</p>
//         </div>

//         <Card className="shadow-lg">
//           <CardHeader className="pb-4">
//             {/* Role Selection Tabs */}
//             <div className="grid grid-cols-2 gap-2 bg-muted p-1 rounded-lg">
//               <Button
//                 type="button"
//                 variant={selectedRole === "owner" ? "default" : "ghost"}
//                 className={`flex items-center gap-2 ${
//                   selectedRole === "owner"
//                     ? "bg-primary text-primary-foreground"
//                     : ""
//                 }`}
//                 onClick={() => setSelectedRole("owner")}
//               >
//                 <Crown className="h-4 w-4" />
//                 Owner
//               </Button>
//               <Button
//                 type="button"
//                 variant={selectedRole === "tenant" ? "default" : "ghost"}
//                 className={`flex items-center gap-2 ${
//                   selectedRole === "tenant"
//                     ? "bg-primary text-primary-foreground"
//                     : ""
//                 }`}
//                 onClick={() => setSelectedRole("tenant")}
//               >
//                 <User className="h-4 w-4" />
//                 Tenant
//               </Button>
//             </div>
//           </CardHeader>

//           <CardContent>
//             <form onSubmit={handleLogin} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="tenant@email.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <Input
//                   id="password"
//                   type="password"
//                   placeholder="Enter your password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//               </div>

//               <Button
//                 type="submit"
//                 className="w-full bg-gradient-primary text-white hover:opacity-90"
//               >
//                 Login as {selectedRole === "owner" ? "Owner" : "Tenant"}
//               </Button>
//             </form>

//             <div className="mt-6 text-center">
//               <p className="text-sm text-muted-foreground mb-2">
//                 Demo: Use any credentials to explore the portal
//               </p>
//               <Button
//                 variant="link"
//                 onClick={() => navigate("/signup")}
//                 className="text-primary hover:text-primary-glow"
//               >
//                 Don't have an account? Sign up
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         <div className="text-center mt-6">
//           <Button
//             variant="ghost"
//             onClick={() => navigate("/")}
//             className="text-muted-foreground"
//           >
//             ← Back to Home
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
