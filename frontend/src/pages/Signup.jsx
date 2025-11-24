// frontend/src/pages/signup.jsx

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, Crown, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from 'axios'; // 💡 IMPORTED AXIOS for API calls

// The full URL for your backend registration endpoint
const REGISTER_URL = 'http://localhost:5000/api/auth/register'; 


export default function Signup() {
 const navigate = useNavigate();
 const [selectedRole, setSelectedRole] = useState("tenant");
 const [formData, setFormData] = useState({
   name: "",
   email: "",
   password: "",
   confirmPassword: "",
 });
  const [isLoading, setIsLoading] = useState(false); // 💡 ADDED LOADING STATE

 const handleInputChange = (e) => {
   setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
   }));
 };

 const handleSignup = async (e) => { // 💡 MADE FUNCTION ASYNC
   e.preventDefault();
    setIsLoading(true);

    // 1. Frontend Validation
   if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
   ) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
   }

   if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
   }

   if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setIsLoading(false);
      return;
   }

    // 2. Prepare Data for API (Do NOT include confirmPassword for the backend)
    const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: selectedRole,
    };
    
    // 3. API Call to Register User
    try {
        await axios.post(REGISTER_URL, registrationData);

        // 4. SUCCESS: Notify user and redirect to Login
        toast.success("Account created successfully! You can now log in.");
        // We redirect to /login immediately upon successful registration
        navigate("/login"); 

    } catch (err) {
        // 5. ERROR HANDLING
        // Backend returns error message like 'User already exists'
        const message = err.response?.data?.message || "Registration failed. Try again.";
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
         Join PG Portal
       </h1>
       <p className="text-muted-foreground">
         Create your account to get started
       </p>
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
         <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
             id="name"
             name="name"
             type="text"
             placeholder="Enter your full name"
             value={formData.name}
             onChange={handleInputChange}
             required
            />
            </div>

            <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
             id="email"
             name="email"
             type="email"
             placeholder="your.email@example.com"
             value={formData.email}
             onChange={handleInputChange}
             required
            />
            </div>

            <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
             id="password"
             name="password"
             type="password"
             placeholder="Create a strong password"
             value={formData.password}
             onChange={handleInputChange}
             required
            />
            </div>

            <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
             id="confirmPassword"
             name="confirmPassword"
             type="password"
             placeholder="Confirm your password"
             value={formData.confirmPassword}
             onChange={handleInputChange}
             required
            />
            </div>

            <Button
            type="submit"
                disabled={isLoading}
            className="w-full bg-gradient-primary text-white hover:opacity-90"
            >
            {isLoading ? "Creating Account..." : `Sign up as ${selectedRole === "owner" ? "Owner" : "Tenant"}`}
            </Button>
         </form>

         <div className="mt-6 text-center">
            <Button
            variant="link"
            onClick={() => navigate("/login")}
            className="text-primary hover:text-primary-glow"
            >
            Already have an account? Login
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

// export default function Signup() {
//   const navigate = useNavigate();
//   const [selectedRole, setSelectedRole] = useState("tenant");
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const handleInputChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSignup = (e) => {
//     e.preventDefault();

//     if (
//       !formData.name ||
//       !formData.email ||
//       !formData.password ||
//       !formData.confirmPassword
//     ) {
//       toast.error("Please fill in all fields");
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     if (formData.password.length < 6) {
//       toast.error("Password must be at least 6 characters");
//       return;
//     }

//     // Store dummy user data in localStorage
//     const userData = {
//       name: formData.name,
//       email: formData.email,
//       role: selectedRole,
//     };
//     localStorage.setItem("user", JSON.stringify(userData));

//     toast.success(`Account created successfully as ${selectedRole}`);

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
//             Join PG Portal
//           </h1>
//           <p className="text-muted-foreground">
//             Create your account to get started
//           </p>
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
//             <form onSubmit={handleSignup} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Full Name</Label>
//                 <Input
//                   id="name"
//                   name="name"
//                   type="text"
//                   placeholder="Enter your full name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   placeholder="your.email@example.com"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <Input
//                   id="password"
//                   name="password"
//                   type="password"
//                   placeholder="Create a strong password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="confirmPassword">Confirm Password</Label>
//                 <Input
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   type="password"
//                   placeholder="Confirm your password"
//                   value={formData.confirmPassword}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>

//               <Button
//                 type="submit"
//                 className="w-full bg-gradient-primary text-white hover:opacity-90"
//               >
//                 Sign up as {selectedRole === "owner" ? "Owner" : "Tenant"}
//               </Button>
//             </form>

//             <div className="mt-6 text-center">
//               <Button
//                 variant="link"
//                 onClick={() => navigate("/login")}
//                 className="text-primary hover:text-primary-glow"
//               >
//                 Already have an account? Login
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
