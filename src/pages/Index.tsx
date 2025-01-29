import { Link } from "react-router-dom";
import { Pizza } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="relative h-[80vh] flex items-center justify-center bg-gradient-to-b from-primary-light to-primary">
          <div className="absolute inset-0 bg-black/40" />
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
