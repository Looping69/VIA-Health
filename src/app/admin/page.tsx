import { redirect } from "next/navigation";

// This is a simple redirect page to ensure /admin route doesn't 404
export default function AdminPage() {
  redirect("/admin/users");
}
