import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserMenuProps = {
  name?: string;
  email?: string;
  avatarUrl?: string;
};

const getInitials = (name?: string) => {
  if (!name) return "AL";
  const parts = name.trim().split(/\s+/);
  const initials = (parts[0]?.[0] || "") + (parts[parts.length - 1]?.[0] || "");
  return initials.toUpperCase();
};

export default function UserMenu({ name = "Aluno", email = "aluno@exemplo.com", avatarUrl }: UserMenuProps) {
  return (
    <div className="w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start gap-3 px-2 hover:bg-neutral-900">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-sm font-medium truncate">{name}</span>
              <span className="text-xs text-neutral-400 truncate">{email}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Perfil</DropdownMenuItem>
          <DropdownMenuItem>Configurações</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Sair</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}