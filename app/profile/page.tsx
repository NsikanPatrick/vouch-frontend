'use client';

import Link from "next/link";
import { ProtectedRoute } from "@/components/page/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef, useEffect } from "react";
import { Camera, Loader2 } from "lucide-react";

function ProfileContent() {
    const { user, updateUser } = useAuth(); //  updateUser has to be available
    const [name, setName] = useState(user?.name || "");
    const [profilePicture, setProfilePicture] = useState<string | null>(user?.profilePicture || null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Update local state when user data changes
    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setProfilePicture(user.profilePicture || null);
        }
    }, [user]);

    // Get user initials for avatar fallback
    const getInitials = () => {
        if (!user?.name) return "U";
        return user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    // Handle file selection
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            setMessage({ type: 'error', text: 'Please select a valid image file (JPEG, PNG, or WebP)' });
            return;
        }

        if (file.size > 3 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'File size must be less than 3MB' });
            return;
        }

        setSelectedFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setProfilePicture(reader.result as string);
        };
        reader.readAsDataURL(file);

        setMessage(null);
    };

    // Handle form submission with file upload
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const accessToken = localStorage.getItem('accessToken');

            const formData = new FormData();
            formData.append('name', name);
            if (selectedFile) {
                formData.append('profilePicture', selectedFile);
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: formData,
            });

            const data = await response.json();
            console.log('API Response:', data);

            if (response.ok) {
                // FIX: Update the user context with the new profile picture URL
                if (data.user) {
                    updateUser({
                        name: data.user.name,
                        profilePicture: data.user.profilePicture,
                    });
                    
                    // Also update local state
                    if (data.user.profilePicture) {
                        setProfilePicture(data.user.profilePicture);
                    }
                }
                
                setMessage({ type: 'success', text: 'Your profile has been updated successfully!' });
                setSelectedFile(null);
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
            }
        } catch (error) {
            console.error('Profile update error:', error);
            setMessage({ type: 'error', text: 'An error occurred while updating your profile' });
        } finally {
            setIsLoading(false);
        }
    };

    // Remove profile picture
    const handleRemoveProfilePicture = async () => {
        if (!confirm('Are you sure you want to remove your profile picture?')) return;

        setIsLoading(true);
        setMessage(null);

        try {
            const accessToken = localStorage.getItem('accessToken');
            const formData = new FormData();
            formData.append('name', name);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                // Update the user context to remove profile picture
                updateUser({ profilePicture: null });
                setProfilePicture(null);
                setMessage({ type: 'success', text: 'Profile picture removed successfully!' });
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to remove profile picture' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b">
                <div className="container mx-auto flex h-16 items-center px-4">
                    <Link href="/dashboard" className="text-xl font-bold">
                        ← Back to Dashboard
                    </Link>
                </div>
            </header>

            <main className="container mx-auto flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Edit Profile</CardTitle>
                        <CardDescription>Update your account information and profile picture</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            {/* Profile Picture Section */}
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage
                                            src={profilePicture || undefined}
                                            alt={user?.name}
                                            onError={() => {
                                                setProfilePicture(null);
                                            }}
                                        />
                                        <AvatarFallback className="text-2xl">
                                            {getInitials()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-0 right-0 rounded-full bg-primary p-1.5 text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                                        disabled={isLoading}
                                    >
                                        <Camera className="h-4 w-4" />
                                    </button>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    disabled={isLoading}
                                />
                                {profilePicture && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleRemoveProfilePicture}
                                        disabled={isLoading}
                                        className="text-xs text-muted-foreground hover:text-destructive"
                                    >
                                        Remove photo
                                    </Button>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    JPG, PNG or WebP (Max 3MB)
                                </p>
                            </div>

                            {/* Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Email Field (Read-only) */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={user?.email || ""}
                                    disabled
                                    className="bg-muted"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Email cannot be changed
                                </p>
                            </div>

                            {message && (
                                <div className={`rounded-md p-3 text-sm ${message.type === 'success'
                                        ? 'bg-green-500/10 text-green-600'
                                        : 'bg-red-500/10 text-red-600'
                                    }`}>
                                    {message.text}
                                </div>
                            )}

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Profile'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}

export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <ProfileContent />
        </ProtectedRoute>
    );
}



// 'use client';

// import { ProtectedRoute } from "@/components/page/protected-route";
// import { useAuth } from "@/contexts/auth-context";
// import { Button } from "@/components/ui/button";
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useState, useRef, useEffect } from "react";
// import { Camera, Loader2 } from "lucide-react";

// function ProfileContent() {
//     const { user, refreshAuthToken, updateUser } = useAuth();
//     const [name, setName] = useState(user?.name || "");
//     const [profilePicture, setProfilePicture] = useState<string | null>(user?.profilePicture || null);
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
//     const fileInputRef = useRef<HTMLInputElement>(null);

//     // Update local state when user data changes
//     useEffect(() => {
//         if (user) {
//             setName(user.name || "");
//             setProfilePicture(user.profilePicture || null);
//         }
//     }, [user]);

//     // Get user initials for avatar fallback
//     const getInitials = () => {
//         if (!user?.name) return "U";
//         return user.name
//             .split(" ")
//             .map((n) => n[0])
//             .join("")
//             .toUpperCase()
//             .slice(0, 2);
//     };

//     // Handle file selection
//     const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         // Validate file type
//         const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
//         if (!allowedTypes.includes(file.type)) {
//             setMessage({ type: 'error', text: 'Please select a valid image file (JPEG, PNG, or WebP)' });
//             return;
//         }

//         // Validate file size (max 3MB)
//         if (file.size > 3 * 1024 * 1024) {
//             setMessage({ type: 'error', text: 'File size must be less than 3MB' });
//             return;
//         }

//         setSelectedFile(file);

//         // Preview the image
//         const reader = new FileReader();
//         reader.onloadend = () => {
//             setProfilePicture(reader.result as string);
//         };
//         reader.readAsDataURL(file);

//         setMessage(null);
//     };

//     // Handle form submission with file upload
//     const handleUpdateProfile = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsLoading(true);
//         setMessage(null);

//         try {
//             const accessToken = localStorage.getItem('accessToken');

//             // Create FormData for multipart/form-data upload
//             const formData = new FormData();
//             formData.append('name', name);
//             if (selectedFile) {
//                 formData.append('profilePicture', selectedFile);
//             }

//             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
//                 method: 'PATCH',
//                 headers: {
//                     'Authorization': `Bearer ${accessToken}`,
//                 },
//                 body: formData,
//             });

//             const data = await response.json();
//             console.log('API Response:', data);
//             console.log('Profile Picture URL:', data.user?.profilePicture);
//             console.log('Full user data:', data.user);

//             if (response.ok) {
//                 // Update local user data with the response
//                 const storedUser = localStorage.getItem('user');
//                 if (storedUser) {
//                     const userData = JSON.parse(storedUser);
//                     userData.name = data.user?.name || name;
//                     userData.profilePicture = data.user?.profilePicture || null;
//                     localStorage.setItem('user', JSON.stringify(userData));
//                 }

//                 // Update the profile picture URL from the response
//                 if (data.user?.profilePicture) {
//                     setProfilePicture(data.user.profilePicture);
//                 }

//                 setMessage({ type: 'success', text: 'Your profile has been updated successfully!' });
//                 setSelectedFile(null);

//                 // Refresh the auth context to update the user data
//                 if (updateUser) {
//                     updateUser(data.user);
//                 }
//             } else {
//                 setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
//             }
//         } catch (error) {
//             console.error('Profile update error:', error);
//             setMessage({ type: 'error', text: 'An error occurred while updating your profile' });
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Remove profile picture
//     const handleRemoveProfilePicture = async () => {
//         if (!confirm('Are you sure you want to remove your profile picture?')) return;

//         setIsLoading(true);
//         setMessage(null);

//         try {
//             const accessToken = localStorage.getItem('accessToken');

//             // First, update without picture - send only name
//             const formData = new FormData();
//             formData.append('name', name);

//             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
//                 method: 'PATCH',
//                 headers: {
//                     'Authorization': `Bearer ${accessToken}`,
//                 },
//                 body: formData,
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 // Update local storage
//                 const storedUser = localStorage.getItem('user');
//                 if (storedUser) {
//                     const userData = JSON.parse(storedUser);
//                     userData.profilePicture = null;
//                     localStorage.setItem('user', JSON.stringify(userData));
//                 }

//                 setProfilePicture(null);
//                 setMessage({ type: 'success', text: 'Profile picture removed successfully!' });

//                 if (updateUser) {
//                     updateUser({ ...user, profilePicture: null });
//                 }
//             } else {
//                 setMessage({ type: 'error', text: data.message || 'Failed to remove profile picture' });
//             }
//         } catch (error) {
//             setMessage({ type: 'error', text: 'An error occurred' });
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-background">
//             <header className="border-b">
//                 <div className="container mx-auto flex h-16 items-center px-4">
//                     <a href="/dashboard" className="text-xl font-bold">
//                         ← Back to Dashboard
//                     </a>
//                 </div>
//             </header>

//             <main className="container mx-auto flex items-center justify-center p-4">
//                 <Card className="w-full max-w-md">
//                     <CardHeader>
//                         <CardTitle>Edit Profile</CardTitle>
//                         <CardDescription>Update your account information and profile picture</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                         <form onSubmit={handleUpdateProfile} className="space-y-6">
//                             {/* Profile Picture Section */}
//                             <div className="flex flex-col items-center space-y-4">
//                                 <div className="relative">
//                                     <Avatar className="h-24 w-24">
//                                         <AvatarImage
//                                             src={profilePicture || undefined}
//                                             alt={user?.name}
//                                             onError={() => {
//                                                 // Handle broken image - fallback to initials
//                                                 setProfilePicture(null);
//                                             }}
//                                         />
//                                         <AvatarFallback className="text-2xl">
//                                             {getInitials()}
//                                         </AvatarFallback>
//                                     </Avatar>
//                                     <button
//                                         type="button"
//                                         onClick={() => fileInputRef.current?.click()}
//                                         className="absolute bottom-0 right-0 rounded-full bg-primary p-1.5 text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
//                                         disabled={isLoading}
//                                     >
//                                         <Camera className="h-4 w-4" />
//                                     </button>
//                                 </div>
//                                 <input
//                                     ref={fileInputRef}
//                                     type="file"
//                                     accept="image/jpeg,image/png,image/webp"
//                                     onChange={handleFileSelect}
//                                     className="hidden"
//                                     disabled={isLoading}
//                                 />
//                                 {profilePicture && (
//                                     <Button
//                                         type="button"
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={handleRemoveProfilePicture}
//                                         disabled={isLoading}
//                                         className="text-xs text-muted-foreground hover:text-destructive"
//                                     >
//                                         Remove photo
//                                     </Button>
//                                 )}
//                                 <p className="text-xs text-muted-foreground">
//                                     JPG, PNG or WebP (Max 3MB)
//                                 </p>
//                             </div>

//                             {/* Name Field */}
//                             <div className="space-y-2">
//                                 <Label htmlFor="name">Name</Label>
//                                 <Input
//                                     id="name"
//                                     type="text"
//                                     placeholder="Your full name"
//                                     value={name}
//                                     onChange={(e) => setName(e.target.value)}
//                                     required
//                                     disabled={isLoading}
//                                 />
//                             </div>

//                             {/* Email Field (Read-only) */}
//                             <div className="space-y-2">
//                                 <Label htmlFor="email">Email</Label>
//                                 <Input
//                                     id="email"
//                                     type="email"
//                                     value={user?.email || ""}
//                                     disabled
//                                     className="bg-muted"
//                                 />
//                                 <p className="text-xs text-muted-foreground">
//                                     Email cannot be changed
//                                 </p>
//                             </div>

//                             {/* Message Display */}
//                             {message && (
//                                 <div className={`rounded-md p-3 text-sm ${message.type === 'success'
//                                         ? 'bg-green-500/10 text-green-600'
//                                         : 'bg-red-500/10 text-red-600'
//                                     }`}>
//                                     {message.text}
//                                 </div>
//                             )}

//                             {/* Submit Button */}
//                             <Button type="submit" className="w-full" disabled={isLoading}>
//                                 {isLoading ? (
//                                     <>
//                                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                         Updating...
//                                     </>
//                                 ) : (
//                                     'Update Profile'
//                                 )}
//                             </Button>
//                         </form>
//                     </CardContent>
//                 </Card>
//             </main>
//         </div>
//     );
// }

// export default function ProfilePage() {
//     return (
//         <ProtectedRoute>
//             <ProfileContent />
//         </ProtectedRoute>
//     );
// }