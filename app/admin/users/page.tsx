"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Mail,
  Shield,
  ShieldCheck,
  Calendar,
  Eye,
  EyeOff,
  X,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  Crown,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminLayout } from "@/components/admin/admin-layout";
import { cn } from "@/lib/utils";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
  createdAt: string;
  updatedAt: string;
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "editor" as "admin" | "editor",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check admin access
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/admin/blogs");
    }
  }, [status, session, router]);

  // Fetch users
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchUsers();
    }
  }, [status, session]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setFormError(data.error || "Failed to create user");
        return;
      }

      setFormSuccess("User created successfully!");
      setUsers([data.user, ...users]);
      setTimeout(() => {
        setShowAddModal(false);
        resetForm();
      }, 1500);
    } catch (error) {
      setFormError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setFormError("");
    setFormSuccess("");
    setIsSubmitting(true);

    try {
      const updateData: Record<string, string> = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch(`/api/admin/users/${selectedUser._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        setFormError(data.error || "Failed to update user");
        return;
      }

      setFormSuccess("User updated successfully!");
      setUsers(users.map((u) => (u._id === selectedUser._id ? data.user : u)));
      setTimeout(() => {
        setShowEditModal(false);
        resetForm();
      }, 1500);
    } catch (error) {
      setFormError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/admin/users/${selectedUser._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers(users.filter((u) => u._id !== selectedUser._id));
        setShowDeleteDialog(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setFormError("");
    setFormSuccess("");
    setShowEditModal(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "editor",
    });
    setFormError("");
    setFormSuccess("");
    setShowPassword(false);
    setSelectedUser(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const adminCount = users.filter((u) => u.role === "admin").length;
  const editorCount = users.filter((u) => u.role === "editor").length;

  if (status === "loading" || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-[#ecb41a]/30 border-t-[#ecb41a] rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  if (session?.user?.role !== "admin") {
    return null;
  }

  return (
    <AdminLayout>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1
              className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ecb41a] to-[#f5d060] flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              User Management
            </h1>
            <p className="text-white/50 mt-2">
              Manage admin and editor access to your website
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="bg-gradient-to-r from-[#ecb41a] to-[#f5d060] hover:from-[#005a9a] hover:to-[#ecb41a] text-white shadow-lg shadow-[#ecb41a]/25 transition-all duration-300 hover:shadow-[#ecb41a]/40"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card className="bg-white/[0.03] border-white/10 backdrop-blur-sm hover:bg-white/[0.05] transition-all duration-300 group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#ecb41a]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50">Total Users</p>
                <p
                  className="text-3xl font-bold text-white mt-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {users.length}
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ecb41a]/20 to-[#f5d060]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-[#ecb41a]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.03] border-white/10 backdrop-blur-sm hover:bg-white/[0.05] transition-all duration-300 group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#d4a017]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50">Administrators</p>
                <p
                  className="text-3xl font-bold text-white mt-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {adminCount}
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d4a017]/20 to-[#d4a017]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Crown className="w-7 h-7 text-[#d4a017]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.03] border-white/10 backdrop-blur-sm hover:bg-white/[0.05] transition-all duration-300 group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50">Editors</p>
                <p
                  className="text-3xl font-bold text-white mt-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {editorCount}
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#10b981]/20 to-[#10b981]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Edit2 className="w-7 h-7 text-[#10b981]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white/[0.03] border-white/10 backdrop-blur-sm mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#ecb41a]/50"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/10">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
                <SelectItem value="editor">Editors</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="bg-white/[0.03] border-white/10 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#ecb41a]" />
            All Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Users className="w-10 h-10 text-white/30" />
              </div>
              <p className="text-white/50 text-lg">No users found</p>
              <p className="text-white/30 text-sm mt-1">
                {searchQuery || roleFilter !== "all"
                  ? "Try adjusting your search or filter"
                  : "Add your first user to get started"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredUsers.map((user, index) => (
                <div
                  key={user._id}
                  className={cn(
                    "flex items-center gap-4 p-5 hover:bg-white/[0.02] transition-all duration-300 group",
                    index === 0 && "pt-5"
                  )}
                >
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="h-12 w-12 border-2 border-white/10 group-hover:border-[#ecb41a]/50 transition-colors">
                      <AvatarFallback
                        className={cn(
                          "text-white font-semibold",
                          user.role === "admin"
                            ? "bg-gradient-to-br from-[#d4a017] to-[#e67e00]"
                            : "bg-gradient-to-br from-[#ecb41a] to-[#f5d060]"
                        )}
                      >
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    {user.role === "admin" && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#d4a017] flex items-center justify-center border-2 border-[#0a0a0a]">
                        <Crown className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white truncate">
                        {user.name}
                      </h3>
                      <Badge
                        className={cn(
                          "text-xs shrink-0",
                          user.role === "admin"
                            ? "bg-[#d4a017]/20 text-[#d4a017] border-[#d4a017]/30"
                            : "bg-[#ecb41a]/20 text-[#ecb41a] border-[#ecb41a]/30"
                        )}
                      >
                        {user.role === "admin" ? (
                          <ShieldCheck className="w-3 h-3 mr-1" />
                        ) : (
                          <Shield className="w-3 h-3 mr-1" />
                        )}
                        {user.role}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/50">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Joined {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditModal(user)}
                      className="h-9 w-9 text-white/50 hover:text-white hover:bg-[#ecb41a]/20"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(user)}
                      disabled={user._id === session?.user?.id}
                      className="h-9 w-9 text-white/50 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Permissions Info */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card className="bg-gradient-to-br from-[#d4a017]/10 to-transparent border-[#d4a017]/20 backdrop-blur-sm">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#d4a017]/20 flex items-center justify-center shrink-0">
                <Crown className="w-6 h-6 text-[#d4a017]" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Administrator Access
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  Full access to Dashboard, Blogs, Services, and User
                  Management. Can add, edit, and remove any user.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#ecb41a]/10 to-transparent border-[#ecb41a]/20 backdrop-blur-sm">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#ecb41a]/20 flex items-center justify-center shrink-0">
                <Edit2 className="w-6 h-6 text-[#ecb41a]" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Editor Access</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  Access to Blogs and Services only. Cannot view Dashboard or
                  manage other users.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add User Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#ecb41a]" />
              Add New User
            </DialogTitle>
            <DialogDescription className="text-white/50">
              Create a new user account with admin or editor access.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddUser} className="space-y-4">
            {formError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                <CheckCircle className="w-4 h-4 shrink-0" />
                {formSuccess}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/70">
                Full Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="John Doe"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/70">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="john@example.com"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/70">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Minimum 8 characters"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 pr-10"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-white/70">
                Role
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value: "admin" | "editor") =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select a role">
                    <span className="flex items-center gap-2">
                      {formData.role === "admin" ? (
                        <>
                          <ShieldCheck className="w-4 h-4 text-[#d4a017]" />
                          <span>Administrator</span>
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 text-[#ecb41a]" />
                          <span>Editor</span>
                        </>
                      )}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10">
                  <SelectItem value="editor" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">
                    <span className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#ecb41a]" />
                      <span>Editor</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="admin" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#d4a017]" />
                      <span>Administrator</span>
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="flex-1 bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-[#ecb41a] to-[#f5d060] hover:from-[#005a9a] hover:to-[#ecb41a] text-white"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create User
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-[#ecb41a]" />
              Edit User
            </DialogTitle>
            <DialogDescription className="text-white/50">
              Update user information and access level.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditUser} className="space-y-4">
            {formError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                <CheckCircle className="w-4 h-4 shrink-0" />
                {formSuccess}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-white/70">
                Full Name
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email" className="text-white/70">
                Email Address
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-password" className="text-white/70">
                New Password{" "}
                <span className="text-white/30">(leave blank to keep current)</span>
              </Label>
              <div className="relative">
                <Input
                  id="edit-password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter new password"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 pr-10"
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role" className="text-white/70">
                Role
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value: "admin" | "editor") =>
                  setFormData({ ...formData, role: value })
                }
                disabled={selectedUser?._id === session?.user?.id}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white disabled:opacity-50">
                  <SelectValue placeholder="Select a role">
                    <span className="flex items-center gap-2">
                      {formData.role === "admin" ? (
                        <>
                          <ShieldCheck className="w-4 h-4 text-[#d4a017]" />
                          <span>Administrator</span>
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 text-[#ecb41a]" />
                          <span>Editor</span>
                        </>
                      )}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10">
                  <SelectItem value="editor" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">
                    <span className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#ecb41a]" />
                      <span>Editor</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="admin" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#d4a017]" />
                      <span>Administrator</span>
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
              {selectedUser?._id === session?.user?.id && (
                <p className="text-xs text-white/40">
                  You cannot change your own role
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
                className="flex-1 bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-[#ecb41a] to-[#f5d060] hover:from-[#005a9a] hover:to-[#ecb41a] text-white"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[#1a1a1a] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Delete User
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              Are you sure you want to delete{" "}
              <span className="text-white font-medium">
                {selectedUser?.name}
              </span>
              ? This action cannot be undone and will permanently remove their
              account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/5">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
