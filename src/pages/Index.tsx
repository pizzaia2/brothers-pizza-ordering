import { Link } from "react-router-dom";
import { Pizza, Home, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AdminPanel from "@/components/AdminPanel";

// Define the pizza flavors type
interface PizzaFlavor {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  available?: boolean;
}

// Initial pizza flavors data
const initialPizzaFlavors: PizzaFlavor[] = [
  // Tradicionais
  { id: "alho", name: "Alho", description: "Molho de tomate, muçarela, orégano, alho e azeitona", category: "tradicional", price: 35, available: true },
  { id: "bacalhau", name: "Bacalhau", description: "Molho de tomate, muçarela, orégano, azeitona e bacalhau", category: "tradicional", price: 35, available: true },
  { id: "bacalhau_teriyaki", name: "Bacalhau Teriyaki", description: "Molho de tomate, muçarela, orégano, bacalhau, cream cheese, cebolinha e molho teriyaki", category: "tradicional", price: 38, available: true },
  { id: "mussarela", name: "Mussarela", description: "Molho de tomate, muçarela e orégano", category: "tradicional", price: 35, available: true },
  { id: "calabresa", name: "Calabresa", description: "Molho de tomate, muçarela, orégano, cebola e calabresa", category: "tradicional", price: 35, available: true },
  { id: "portuguesa", name: "Portuguesa", description: "Molho de tomate, muçarela, orégano, presunto, ovo, tomate, pimentão, cebola e azeitona", category: "tradicional", price: 38, available: true },
  // Especiais
  { id: "atum", name: "Atum", description: "Molho de tomate, muçarela, orégano, atum e cebola", category: "especial", price: 42, available: true },
  { id: "atum_catupiry", name: "Atum Catupiry", description: "Molho de tomate, muçarela, orégano, atum e catupiry", category: "especial", price: 45, available: true },
  { id: "frango_catupiry", name: "Frango com Catupiry", description: "Molho de tomate, muçarela, orégano, frango e catupiry", category: "especial", price: 42, available: true },
  { id: "quatro_queijos", name: "Quatro Queijos", description: "Molho de tomate, muçarela, orégano, parmesão, catupiry e gorgonzola", category: "especial", price: 45, available: true },
  // Doces
  { id: "brigadeiro", name: "Brigadeiro", description: "Muçarela, brigadeiro e granulado", category: "doce", price: 40, available: true },
  { id: "brigadeiro_morango", name: "Brigadeiro com Morango", description: "Muçarela, brigadeiro, morango e granulado", category: "doce", price: 40, available: true },
  { id: "chocolate", name: "Chocolate", description: "Muçarela e chocolate ao leite", category: "doce", price: 40, available: true },
  { id: "romeu_julieta", name: "Romeu e Julieta", description: "Muçarela e goiabada", category: "doce", price: 40, available: true },
  { id: "queijo_coalho_goiabada", name: "Queijo Coalho com Goiabada", description: "Muçarela e goiabada", category: "doce", price: 42, available: true },
];

const Index = () => {
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [pizzaFlavors, setPizzaFlavors] = useState<PizzaFlavor[]>(initialPizzaFlavors);

  const handleUpdateFlavor = (flavorId: string, available: boolean) => {
    setPizzaFlavors(prevFlavors =>
      prevFlavors.map(flavor =>
        flavor.id === flavorId ? { ...flavor, available } : flavor
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white py-4 px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:text-secondary transition-colors">
          <Home className="w-5 h-5" />
          <span className="font-quicksand">Página inicial</span>
        </Link>
        <h2 className="font-quicksand font-bold text-xl">Brother's Pizzaria</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsAdminPanelOpen(true)}
          className="text-white hover:text-secondary"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </header>

      <main className="flex-grow">
        <div 
          className="relative h-[80vh] flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative text-center text-white z-10 px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-quicksand">Brother's Pizzaria</h1>
            <p className="text-xl md:text-2xl mb-8 font-quicksand">Fatias que unem</p>
            <Link 
              to="/order" 
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full text-lg font-bold hover:bg-primary-light hover:text-white transition-all duration-300"
            >
              <Pizza className="w-6 h-6" />
              FAZER PEDIDO
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-bold mb-4 font-quicksand">Horário de Funcionamento</h3>
              <p className="text-lg">Segunda a Domingo</p>
              <p className="text-lg">18:00 - 23:00</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4 font-quicksand">Contato</h3>
              <p className="text-lg">(75) 98851-0206</p>
              <p className="text-lg">brotherspizzaria@email.com</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4 font-quicksand">Endereço</h3>
              <p className="text-lg">Rua Principal, 123</p>
              <p className="text-lg">Centro, Cidade - BA</p>
            </div>
          </div>
          <div className="text-center mt-12 pt-8 border-t border-white/20">
            <p className="text-lg">&copy; 2024 Brother's Pizzaria. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        flavors={pizzaFlavors}
        onUpdateFlavor={handleUpdateFlavor}
      />
    </div>
  );
};

export default Index;