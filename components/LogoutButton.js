import { logOut } from "@/lib/firebase";

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await logOut();
      alert("Signed out successfully");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}
