import { useState, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pizza, Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PizzaSize {
  id: string;
  name: string;
  slices: number;
  maxFlavors: number;
}

interface PizzaFlavor {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
}

const pizzaSizes: PizzaSize[] = [
  { id: "media", name: "Média", slices: 6, maxFlavors: 2 },
  { id: "grande", name: "Grande", slices: 8, maxFlavors: 3 },
  { id: "familia", name: "Família", slices: 12, maxFlavors: 4 },
];

const pizzaFlavors: PizzaFlavor[] = [
  { id: "alho", name: "Alho", description: "Molho de tomate, muçarela, orégano, alho e azeitona", category: "tradicional", price: 35 },
  { id: "bacalhau", name: "Bacalhau", description: "Molho de tomate, muçarela, orégano, azeitona e bacalhau", category: "tradicional", price: 35 },
  { id: "bacalhau_teriyaki", name: "Bacalhau Teriyaki", description: "Molho de tomate, muçarela, orégano, bacalhau, cream cheese, cebolinha e molho teriyaki", category: "tradicional", price: 38 },
  { id: "mussarela", name: "Mussarela", description: "Molho de tomate, muçarela e orégano", category: "tradicional", price: 35 },
  { id: "calabresa", name: "Calabresa", description: "Molho de tomate, muçarela, orégano, cebola e calabresa", category: "tradicional", price: 35 },
  { id: "portuguesa", name: "Portuguesa", description: "Molho de tomate, muçarela, orégano, presunto, ovo, tomate, pimentão, cebola e azeitona", category: "tradicional", price: 38 },
  { id: "atum", name: "Atum", description: "Molho de tomate, muçarela, orégano, atum e cebola", category: "especial", price: 42 },
  { id: "atum_catupiry", name: "Atum Catupiry", description: "Molho de tomate, muçarela, orégano, atum e catupiry", category: "especial", price: 45 },
  { id: "frango_catupiry", name: "Frango com Catupiry", description: "Molho de tomate, muçarela, orégano, frango e catupiry", category: "especial", price: 42 },
  { id: "quatro_queijos", name: "Quatro Queijos", description: "Molho de tomate, muçarela, orégano, parmesão, catupiry e gorgonzola", category: "especial", price: 45 },
  { id: "brigadeiro", name: "Brigadeiro", description: "Muçarela, brigadeiro e granulado", category: "doce", price: 40 },
  { id: "brigadeiro_morango", name: "Brigadeiro com Morango", description: "Muçarela, brigadeiro, morango e granulado", category: "doce", price: 40 },
  { id: "chocolate", name: "Chocolate", description: "Muçarela e chocolate ao leite", category: "doce", price: 40 },
  { id: "romeu_julieta", name: "Romeu e Julieta", description: "Muçarela e goiabada", category: "doce", price: 40 },
  { id: "romeu_julieta", name: "Queijo Coalho com Goiabada", description: "Muçarela e goiabada", category: "doce", price: 42 },
];

const neighborhoods = [
  { name: "Centro", tariff: 8 },
  { name: "Bairro Alto", tariff: 8 },
  { name: "Jardim Primavera", tariff: 8 },
  { name: "Vila Nova", tariff: 8 },
  { name: "Parque Industrial", tariff: 8 },
];

const Order = () => {
  const { toast } = useToast();
  const [size, setSize] = useState("");
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState({
    street: "",
    neighborhood: "",
    number: "",
    complement: "", // Campo Complemento
  });
  const [payment, setPayment] = useState("");
  const [needChange, setNeedChange] = useState(false);
  const [notes, setNotes] = useState("");
  const [removeIngredients, setRemoveIngredients] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  const selectedSize = pizzaSizes.find((s) => s.id === size);

  const orderTotal = useMemo(() => {
    if (!selectedFlavors.length) return 0;

    const selectedPizzas = selectedFlavors.map(id => 
      pizzaFlavors.find(flavor => flavor.id === id)
    );

    const maxPrice = Math.max(...selectedPizzas.map(pizza => pizza?.price || 0));
    
    // Adicionando a tarifa do bairro
    const neighborhoodTariff = neighborhoods.find(
      (n) => n.name === address.neighborhood
    )?.tariff || 0;

    return maxPrice + neighborhoodTariff;
  }, [selectedFlavors, address.neighborhood]);

  const handleFlavorSelect = (flavorId: string) => {
    if (!selectedSize) return;

    if (selectedFlavors.includes(flavorId)) {
      setSelectedFlavors(selectedFlavors.filter((id) => id !== flavorId));
    } else if (selectedFlavors.length < selectedSize.maxFlavors) {
      setSelectedFlavors([...selectedFlavors, flavorId]);
    } else {
      toast({
        title: "Limite de sabores atingido",
        description: `Você pode escolher até ${selectedSize.maxFlavors} sabores para este tamanho.`,
      });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return value;
  };

  const generateOrderSummary = () => {
    const selectedFlavorNames = selectedFlavors
      .map((id) => pizzaFlavors.find((f) => f.id === id)?.name)
      .join(", ");

    const date = new Date();
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();

    return `*Pedido - Brother's Pizzaria*
Data: ${formattedDate}
Hora: ${formattedTime}

*Tamanho:* ${selectedSize?.name}
*Sabores:* ${selectedFlavorNames}
${notes ? `*Observações:* ${notes}\n` : ""}

*Cliente:* ${name}
*Telefone:* ${phone}
*Endereço:* ${address.street}, ${address.number} - ${address.neighborhood}
${address.complement ? `*Complemento:* ${address.complement}\n` : ""}
*Forma de Pagamento:* ${payment}
${needChange ? "Precisa de troco: Sim" : ""}

Obrigado por realizar seu pedido.
${payment === "pix" ? "Nossa chave PIX é (75) 988510206 - Jeferson Barboza" : ""}`;
  };

  const handleWhatsAppOrder = () => {
    const summary = generateOrderSummary();
    const encodedMessage = encodeURIComponent(summary);
    window.open(`https://wa.me/5575991662591?text=${encodedMessage}`, "_blank");
  };

  const handleVerifySummary = () => {
    if (!size || selectedFlavors.length === 0 || !name || !phone || !address.street || !payment) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    setShowSummary(true);
  };

  return (
    <div className="min-h-screen bg-secondary py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <Card className="mb-8 shadow-lg border-2 border-primary/20">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-4xl font-bold text-primary">
              Fazer Pedido
            </CardTitle>
            <CardDescription className="text-base">
              Preencha os dados para concluir o pedido.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Label>Nome</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite seu nome"
                />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="Digite seu telefone"
                />
              </div>
              <div>
                <Label>Endereço</Label>
                <Input
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  placeholder="Digite sua rua"
                />
              </div>
              <div>
                <Label>Bairro</Label>
                <Select
                  value={address.neighborhood}
                  onValueChange={(val) => setAddress({ ...address, neighborhood: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha o bairro" />
                  </SelectTrigger>
                  <SelectContent>
                    {neighborhoods.map((neighborhood) => (
                      <SelectItem key={neighborhood.name} value={neighborhood.name}>
                        {neighborhood.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Número</Label>
                <Input
                  value={address.number}
                  onChange={(e) => setAddress({ ...address, number: e.target.value })}
                  placeholder="Digite o número da casa"
                />
              </div>
              <div>
                <Label>Complemento</Label>
                <Input
                  value={address.complement}
                  onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                  placeholder="Digite o complemento (opcional)"
                />
              </div>
              <div>
                <Label>Tamanho da Pizza</Label>
                <Select
                  value={size}
                  onValueChange={setSize}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha o tamanho" />
                  </SelectTrigger>
                  <SelectContent>
                    {pizzaSizes.map((size) => (
                      <SelectItem key={size.id} value={size.id}>
                        {size.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Sabores</Label>
                <Accordion type="multiple">
                  {pizzaFlavors.map((flavor) => (
                    <AccordionItem key={flavor.id} value={flavor.id}>
                      <AccordionTrigger>
                        <Check className="mr-2" />
                        {flavor.name}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p>{flavor.description}</p>
                        <Button
                          onClick={() => handleFlavorSelect(flavor.id)}
                          variant={selectedFlavors.includes(flavor.id) ? "secondary" : "outline"}
                        >
                          {selectedFlavors.includes(flavor.id) ? "Remover" : "Adicionar"}
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
              <div>
                <Label>Observações</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Deixe suas observações"
                />
              </div>
              <div>
                <Label>Remover Ingredientes</Label>
                <Input
                  value={removeIngredients}
                  onChange={(e) => setRemoveIngredients(e.target.value)}
                  placeholder="Ingredientes a remover"
                />
              </div>
              <div>
                <Label>Forma de Pagamento</Label>
                <Select
                  value={payment}
                  onValueChange={setPayment}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha a forma de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="cartao">Cartão</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleVerifySummary} className="mt-4">Verificar Resumo</Button>
            {showSummary && (
              <div className="mt-4">
                <h3 className="font-bold text-xl">Resumo do Pedido:</h3>
                <pre>{generateOrderSummary()}</pre>
                <Button onClick={handleWhatsAppOrder} className="mt-4">Enviar pelo WhatsApp</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Order;
