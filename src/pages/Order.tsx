import { useState } from "react";
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
import { Pizza } from "lucide-react";

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
  // Tradicionais
  { id: "alho", name: "Alho", description: "Molho de tomate, muçarela, orégano, alho e azeitona", category: "tradicional", price: 35 },
  { id: "bacalhau", name: "Bacalhau", description: "Molho de tomate, muçarela, orégano, azeitona e bacalhau", category: "tradicional", price: 35 },
  { id: "bacalhau_teriyaki", name: "Bacalhau Teriyaki", description: "Molho de tomate, muçarela, orégano, bacalhau, cream cheese, cebolinha e molho teriyaki", category: "tradicional", price: 38 },
  { id: "mussarela", name: "Mussarela", category: "tradicional", price: 35 },
  { id: "calabresa", name: "Calabresa", category: "tradicional", price: 35 },
  { id: "portuguesa", name: "Portuguesa", category: "tradicional", price: 38 },

  // Especiais
  { id: "atum", name: "Atum", description: "Molho de tomate, muçarela, orégano, atum e cebola", category: "especial", price: 42 },
  { id: "atum_catupiry", name: "Atum Catupiry", description: "Molho de tomate, muçarela, orégano, atum e catupiry", category: "especial", price: 45 },
  { id: "frango_catupiry", name: "Frango com Catupiry", category: "especial", price: 42 },
  { id: "quatro_queijos", name: "Quatro Queijos", category: "especial", price: 45 },

  // Doces
  { id: "brigadeiro", name: "Brigadeiro", description: "Muçarela, brigadeiro e granulado", category: "doce", price: 40 },
  { id: "brigadeiro_morango", name: "Brigadeiro com Morango", description: "Muçarela, brigadeiro, morango e granulado", category: "doce", price: 40 },
  { id: "chocolate", name: "Chocolate", category: "doce", price: 40 },
  { id: "romeu_julieta", name: "Romeu e Julieta", category: "doce", price: 40 },
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
  });
  const [payment, setPayment] = useState("");
  const [needChange, setNeedChange] = useState(false);
  const [notes, setNotes] = useState("");
  const [removeIngredients, setRemoveIngredients] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  const selectedSize = pizzaSizes.find((s) => s.id === size);

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

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
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
${removeIngredients ? `*Retirar:* ${removeIngredients}\n` : ""}

*Cliente:* ${name}
*Telefone:* ${phone}
*Endereço:* ${address.street}, ${address.number} - ${address.neighborhood}
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
      <div className="container max-w-2xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Fazer Pedido</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para fazer seu pedido
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-4">
                <Label>Tamanho da Pizza</Label>
                <div className="grid grid-cols-3 gap-4">
                  {pizzaSizes.map((pizzaSize) => (
                    <Button
                      key={pizzaSize.id}
                      type="button"
                      variant={size === pizzaSize.id ? "default" : "outline"}
                      className="flex flex-col items-center p-4"
                      onClick={() => {
                        setSize(pizzaSize.id);
                        setSelectedFlavors([]);
                      }}
                    >
                      <div className="flex gap-1 mb-2">
                        {Array.from({ length: pizzaSize.slices }).map((_, i) => (
                          <Pizza key={i} className="w-6 h-6" />
                        ))}
                      </div>
                      {pizzaSize.name}
                    </Button>
                  ))}
                </div>
              </div>

              {size && (
                <div className="space-y-4">
                  <Label>Sabores (escolha {selectedSize?.maxFlavors})</Label>
                  {["tradicional", "especial", "doce"].map((category) => (
                    <div key={category} className="space-y-2">
                      <h3 className="font-semibold capitalize">{category}s</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {pizzaFlavors
                          .filter((flavor) => flavor.category === category)
                          .map((flavor) => (
                            <Button
                              key={flavor.id}
                              type="button"
                              variant={
                                selectedFlavors.includes(flavor.id)
                                  ? "default"
                                  : "outline"
                              }
                              className="justify-start"
                              onClick={() => handleFlavorSelect(flavor.id)}
                            >
                              <Pizza className="mr-2" />
                              {flavor.name}
                            </Button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-4">
                <Label>Observações (opcional)</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Digite suas observações aqui..."
                />
              </div>

              <div className="space-y-4">
                <Label>Ingredientes para retirar (opcional)</Label>
                <Textarea
                  value={removeIngredients}
                  onChange={(e) => setRemoveIngredients(e.target.value)}
                  placeholder="Digite os ingredientes que deseja retirar..."
                />
              </div>

              <div className="space-y-4">
                <Label>Nome</Label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="space-y-4">
                <Label>Telefone</Label>
                <Input
                  required
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="space-y-4">
                <Label>Endereço</Label>
                <Input
                  required
                  value={address.street}
                  onChange={(e) =>
                    setAddress({ ...address, street: e.target.value })
                  }
                  placeholder="Rua"
                  className="mb-2"
                />
                <Input
                  required
                  value={address.neighborhood}
                  onChange={(e) =>
                    setAddress({ ...address, neighborhood: e.target.value })
                  }
                  placeholder="Bairro"
                  className="mb-2"
                />
                <Input
                  required
                  value={address.number}
                  onChange={(e) =>
                    setAddress({ ...address, number: e.target.value })
                  }
                  placeholder="Número"
                  type="text"
                />
              </div>

              <div className="space-y-4">
                <Label>Forma de Pagamento</Label>
                <Select value={payment} onValueChange={setPayment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a forma de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="card">Cartão de crédito/débito</SelectItem>
                    <SelectItem value="cash">Dinheiro</SelectItem>
                    <SelectItem value="cash_card">Dinheiro e cartão</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(payment === "cash" || payment === "cash_card") && (
                <div className="space-y-4">
                  <Label>Precisa de troco?</Label>
                  <Select
                    value={needChange ? "yes" : "no"}
                    onValueChange={(value) => setNeedChange(value === "yes")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione se precisa de troco" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Sim</SelectItem>
                      <SelectItem value="no">Não</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {!showSummary ? (
                <Button
                  type="button"
                  className="w-full"
                  onClick={handleVerifySummary}
                >
                  Verificar Resumo
                </Button>
              ) : (
                <div className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <pre className="whitespace-pre-wrap font-mono text-sm">
                        {generateOrderSummary()}
                      </pre>
                    </CardContent>
                  </Card>
                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleWhatsAppOrder}
                  >
                    Confirmar Pedido no WhatsApp
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Order;
