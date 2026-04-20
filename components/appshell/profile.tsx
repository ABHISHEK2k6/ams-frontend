"use client"

import { User, LogOut, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export function ProfileBtn() {
    const router = useRouter();
    const { user } = useAuth();

    const handleSignOut = async () => {
        await authClient.signOut()
        router.replace("/")
    }

    const handleProfileClick = () => {
        router.push("/dashboard/profile")
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <User className="h-4 w-4" />
                    <span className="sr-only">Profile menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="font-normal text-muted-foreground text-xs">
                    {user?.name || user?.email || "Account"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileClick}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                </DropdownMenuItem>
                {user?.role === "admin" && (
                    <DropdownMenuItem onClick={() => router.push("/dashboard/config")}>
                        <Settings2 className="mr-2 h-4 w-4" />
                        System Config
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}