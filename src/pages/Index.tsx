import { Link } from "react-router-dom";
import { Pizza, Home } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white py-4 px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:text-secondary transition-colors">
          <Home className="w-5 h-5" />
          <span className="font-quicksand">Página inicial</span>
        </Link>
        <h2 className="font-quicksand font-bold text-xl">Brother's Pizzaria</h2>
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
    </div>
  );
};

export default Index;