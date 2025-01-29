import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Pizza, LogOut } from "lucide-react";
import { pizzaFlavors as initialPizzaFlavors, type PizzaFlavor } from "@/data/pizzaData";

const STORAGE_KEY = "pizzaFlavorsAvailability";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [flavors, setFlavors] = useState<PizzaFlavor[]>(() => {
    const savedAvailability = localStorage.getItem(STORAGE_KEY);
    if (savedAvailability) {
      const availabilityMap = JSON.parse(savedAvailability);
      return initialPizzaFlavors.map(flavor => ({
        ...flavor,
        available: availabilityMap[flavor.id] ?? true
      }));
    }
    return initialPizzaFlavors.map(flavor => ({
      ...flavor,
      available: true
    }));
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const toggleAvailability = (id: string) => {
    setFlavors(prevFlavors => {
      const newFlavors = prevFlavors.map(flavor => {
        if (flavor.id === id) {
          const newAvailability = !flavor.available;
          toast({
            title: `${flavor.name} ${newAvailability ? "disponível" : "indisponível"}`,
            description: `O sabor foi marcado como ${newAvailability ? "disponível" : "indisponível"}.`,
          });
          return { ...flavor, available: newAvailability };
        }
        return flavor;
      });

      // Salvar o estado de disponibilidade no localStorage
      const availabilityMap = newFlavors.reduce((acc, flavor) => ({
        ...acc,
        [flavor.id]: flavor.available
      }), {});
      localStorage.setItem(STORAGE_KEY, JSON.stringify(availabilityMap));

      return newFlavors;
    });
  };

  const categories = Array.from(new Set(flavors.map(flavor => flavor.category)));

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Pizza className="h-8 w-8 text-pizza-600" />
            <h1 className="text-2xl font-bold text-gray-900">Gerenciar Sabores</h1>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>

        {categories.map(category => (
          <div key={category} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 capitalize">{category}s</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {flavors
                .filter(flavor => flavor.category === category)
                .map(flavor => (
                  <Card key={flavor.id} className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{flavor.name}</h3>
                          <p className="text-sm text-gray-600">{flavor.description}</p>
                          <p className="text-sm font-medium text-primary">R$ {flavor.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <Button
                        variant={flavor.available ? "destructive" : "default"}
                        onClick={() => toggleAvailability(flavor.id)}
                        className={flavor.available ? "bg-pizza-600 hover:bg-pizza-700" : ""}
                      >
                        {flavor.available ? "Marcar Indisponível" : "Marcar Disponível"}
                      </Button>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;