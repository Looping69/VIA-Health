"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { createClient } from "../../../../supabase/client";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Plus, Search, Shield, ArrowLeft } from "lucide-react";
import AdminPanel from "@/components/admin/admin-panel";

type User = {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  role?: string;
};

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    password: "",
    role: "user",
  });

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data: authUsers, error: authError } =
        await supabase.auth.admin.listUsers();

      if (authError) {
        console.error("Error fetching auth users:", authError);
        return;
      }

      const { data: profileUsers, error: profileError } = await supabase
        .from("users")
        .select("*");

      if (profileError) {
        console.error("Error fetching profile users:", profileError);
        return;
      }

      // Combine auth and profile data
      const combinedUsers = authUsers?.users.map((authUser) => {
        const profileUser = profileUsers?.find(
          (profile) => profile.id === authUser.id,
        );
        return {
          id: authUser.id,
          email: authUser.email || "",
          full_name: profileUser?.full_name || "",
          created_at: authUser.created_at,
          role: profileUser?.role || "user",
        };
      });

      setUsers(combinedUsers || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setFormData({
      email: user.email,
      full_name: user.full_name,
      password: "", // Don't set password when editing
      role: user.role || "user",
    });
    setIsEditDialogOpen(true);
  };

  const handleCreateUser = async () => {
    try {
      // Create user in auth
      const { data, error } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true,
      });

      if (error) {
        console.error("Error creating user:", error);
        return;
      }

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase.from("users").insert({
          id: data.user.id,
          email: formData.email,
          full_name: formData.full_name,
          role: formData.role,
          user_id: data.user.id,
          token_identifier: data.user.id,
          created_at: new Date().toISOString(),
        });

        if (profileError) {
          console.error("Error creating user profile:", profileError);
        }
      }

      setIsCreateDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error in user creation:", error);
    }
  };

  const handleUpdateUser = async () => {
    if (!currentUser) return;

    try {
      // Update user in auth if email changed
      if (formData.email !== currentUser.email) {
        const { error } = await supabase.auth.admin.updateUserById(
          currentUser.id,
          {
            email: formData.email,
          },
        );

        if (error) {
          console.error("Error updating user email:", error);
          return;
        }
      }

      // Update password if provided
      if (formData.password) {
        const { error } = await supabase.auth.admin.updateUserById(
          currentUser.id,
          {
            password: formData.password,
          },
        );

        if (error) {
          console.error("Error updating user password:", error);
          return;
        }
      }

      // Update user profile
      const { error: profileError } = await supabase
        .from("users")
        .update({
          email: formData.email,
          full_name: formData.full_name,
          role: formData.role,
        })
        .eq("id", currentUser.id);

      if (profileError) {
        console.error("Error updating user profile:", profileError);
        return;
      }

      setIsEditDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error in user update:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      // Delete user profile first (due to foreign key constraints)
      const { error: profileError } = await supabase
        .from("users")
        .delete()
        .eq("id", userId);

      if (profileError) {
        console.error("Error deleting user profile:", profileError);
        return;
      }

      // Delete user from auth
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) {
        console.error("Error deleting user:", error);
        return;
      }

      fetchUsers();
    } catch (error) {
      console.error("Error in user deletion:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold flex items-center">
            <Shield className="h-6 w-6 mr-2 text-red-600" />
            User Management
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={() => {
                setFormData({
                  email: "",
                  full_name: "",
                  password: "",
                  role: "user",
                });
                setIsCreateDialogOpen(true);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.full_name || "--"}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${user.role === "admin" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}
                          >
                            {user.role || "user"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">
                Password (leave blank to keep current)
              </Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <select
                id="edit-role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateUser}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>Add a new user to the system.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-email">Email</Label>
              <Input
                id="create-email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-name">Full Name</Label>
              <Input
                id="create-name"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-password">Password</Label>
              <Input
                id="create-password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-role">Role</Label>
              <select
                id="create-role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateUser}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AdminPanel />
    </div>
  );
}
