import AuthComponent from "@/components/authComponent";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <AuthComponent />
      </div>
    </div>
  );
}
