import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { X, Check } from "lucide-react";

interface PizzaFlavor {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  available?: boolean;
}

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  flavors: PizzaFlavor[];
  onUpdateFlavor: (flavorId: string, available: boolean) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  flavors,
  onUpdateFlavor,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "Cliente" && password === "lk020629") {
      setIsLoggedIn(true);
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao painel de controle",
      });
    } else {
      toast({
        title: "Erro no login",
        description: "Usuário ou senha incorretos",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Painel de Controle</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        {!isLoggedIn ? (
          <Card>
            <CardHeader>
              <CardTitle>Login Administrativo</CardTitle>
              <CardDescription>
                Entre com suas credenciais para acessar o painel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Usuário</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Entrar
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Gerenciar Sabores</h3>
              <Button variant="outline" onClick={handleLogout}>
                Sair
              </Button>
            </div>
            
            {["tradicional", "especial", "doce"].map((category) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="capitalize">{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {flavors
                      .filter((flavor) => flavor.category === category)
                      .map((flavor) => (
                        <div
                          key={flavor.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium">{flavor.name}</h4>
                            <p className="text-sm text-gray-600">
                              {flavor.description}
                            </p>
                          </div>
                          <Button
                            variant={flavor.available ? "outline" : "destructive"}
                            onClick={() => onUpdateFlavor(flavor.id, !flavor.available)}
                            className="min-w-[120px]"
                          >
                            {flavor.available ? (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Disponível
                              </>
                            ) : (
                              <>
                                <X className="w-4 h-4 mr-2" />
                                Indisponível
                              </>
                            )}
                          </Button>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;