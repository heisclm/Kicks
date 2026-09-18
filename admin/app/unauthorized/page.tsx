import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { logout } from "../login/actions";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f4f8] dark:bg-[#0a0a0a] p-4 sm:p-8">
      <div className="w-full max-w-[400px] animate-fade-in-up">
        
        <Card className="p-8 text-center shadow-xl ring-1 ring-border/50">
          <div className="h-16 w-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={32} />
          </div>
          
          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">Access Denied</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Your account does not have KICKS Admin access. If you believe this is an error, please contact your system administrator.
          </p>

          <form action={logout}>
            <Button type="submit" className="w-full h-11">
              Return to Login
            </Button>
          </form>
        </Card>

      </div>
    </div>
  );
}
