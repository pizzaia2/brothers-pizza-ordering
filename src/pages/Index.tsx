import { Link } from "react-router-dom";
import { Pizza } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="relative h-[80vh] flex items-center justify-center bg-gradient-to-b from-primary-light to-primary">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative text-center text-white z-10 px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">Brother's Pizzaria</h1>
            <p className="text-xl md:text-2xl mb-8">As melhores pizzas da região</p>
            <Link to="/order" className="button-primary text-lg">
              FAZER PEDIDO
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="bg-primary text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Horário de Funcionamento</h3>
              <p>Segunda a Domingo</p>
              <p>18:00 - 23:00</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contato</h3>
              <p>(75) 98851-0206</p>
              <p>brotherspizzaria@email.com</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Endereço</h3>
              <p>Rua Principal, 123</p>
              <p>Centro, Cidade - BA</p>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-white/20">
            <p>&copy; 2024 Brother's Pizzaria. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;