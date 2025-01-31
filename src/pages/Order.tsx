import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Home } from "lucide-react";
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
import { Pizza, Check, ShoppingCart, Trash2, MapPin } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Define the pizza sizes type
interface PizzaSize {
  id: string;
  name: string;
  slices: number;
  maxFlavors: number;
  available?: boolean;
}

// Update pizza sizes definition
const initialPizzaSizes: PizzaSize[] = [
  { id: "medium", name: "Média", slices: 6, maxFlavors: 2, available: true },
  { id: "large", name: "Grande", slices: 8, maxFlavors: 3, available: true },
  { id: "family", name: "Família", slices: 12, maxFlavors: 4, available: true },
];

// Define the neighborhoods type and data
interface Neighborhood {
  id: string;
  name: string;
  deliveryFee: number;
}

const neighborhoods: Neighborhood[] = [
  { id: "centro", name: "Centro", deliveryFee: 5 },
  { id: "cajueiro", name: "Cajueiro", deliveryFee: 5 },
  { id: "santa_luzia", name: "Santa Luzia", deliveryFee: 6 },
  { id: "alto_bonito", name: "Alto Bonito", deliveryFee: 6 },
  { id: "santo_antonio", name: "Santo Antônio", deliveryFee: 7 },
];

// Define the pizza flavors type
interface PizzaFlavor {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  available?: boolean;
}

// Define the cart item type
interface CartItem {
  size: string;
  flavors: string[];
  notes: string;
  removeIngredients: string;
  total: number;
}

// Helper function to display payment method
const getPaymentMethodDisplay = (method: string): string => {
  switch (method) {
    case "pix":
      return "PIX";
    case "card":
      return "Cartão de crédito/débito";
    case "cash":
      return "Dinheiro";
    case "cash_card":
      return "Dinheiro e cartão";
    default:
      return method;
  }
};

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

const Order = () => {
  const { toast } = useToast();
  const [size, setSize] = useState("");
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isPickup, setIsPickup] = useState(false);
  const [address, setAddress] = useState({
    street: "",
    neighborhood: "",
    number: "",
    complement: "",
  });
  const [payment, setPayment] = useState("");
  const [needChange, setNeedChange] = useState(false);
  const [changeAmount, setChangeAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [removeIngredients, setRemoveIngredients] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Update pizzaFlavors state to sync with localStorage
  const [pizzaFlavors, setPizzaFlavors] = useState<PizzaFlavor[]>(() => {
    const storedFlavors = localStorage.getItem('pizzaFlavors');
    return storedFlavors ? JSON.parse(storedFlavors) : initialPizzaFlavors;
  });

  // Add pizzaSizes state to sync with localStorage
  const [pizzaSizes, setPizzaSizes] = useState<PizzaSize[]>(() => {
    const storedSizes = localStorage.getItem('pizzaSizes');
    return storedSizes ? JSON.parse(storedSizes) : initialPizzaSizes;
  });

  // Update when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const storedFlavors = localStorage.getItem('pizzaFlavors');
      if (storedFlavors) {
        setPizzaFlavors(JSON.parse(storedFlavors));
      }
      const storedSizes = localStorage.getItem('pizzaSizes');
      if (storedSizes) {
        setPizzaSizes(JSON.parse(storedSizes));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const selectedSize = pizzaSizes.find((s) => s.id === size);
  
  const orderTotal = useMemo(() => {
    if (!selectedFlavors.length) return 0;
    const selectedPizzas = selectedFlavors.map(id => 
      pizzaFlavors.find(flavor => flavor.id === id)
    );
    const maxPrice = Math.max(...selectedPizzas.map(pizza => pizza?.price || 0));
    
    // Only add delivery fee if not pickup
    if (!isPickup) {
      const selectedNeighborhood = neighborhoods.find(n => n.id === address.neighborhood);
      const deliveryFee = selectedNeighborhood?.deliveryFee || 0;
      return maxPrice + deliveryFee;
    }
    
    return maxPrice;
  }, [selectedFlavors, address.neighborhood, isPickup]);

  const cartTotal = useMemo(() => {
    const itemsTotal = cart.reduce((sum, item) => sum + item.total, 0);
    if (!isPickup) {
      const selectedNeighborhood = neighborhoods.find(n => n.id === address.neighborhood);
      const deliveryFee = selectedNeighborhood?.deliveryFee || 0;
      return itemsTotal + (cart.length > 0 ? deliveryFee : 0);
    }
    return itemsTotal;
  }, [cart, address.neighborhood, isPickup]);

  const handleFlavorSelect = (flavorId: string) => {
    const flavor = pizzaFlavors.find(f => f.id === flavorId);
    if (!flavor?.available) {
      toast({
        title: "Sabor indisponível",
        description: "Este sabor está temporariamente indisponível.",
        variant: "destructive",
      });
      return;
    }

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

  const handleAddToCart = () => {
    // Check if any selected flavor is unavailable
    const hasUnavailableFlavor = selectedFlavors.some(flavorId => {
      const flavor = pizzaFlavors.find(f => f.id === flavorId);
      return !flavor?.available;
    });

    if (hasUnavailableFlavor) {
      toast({
        title: "Sabor indisponível",
        description: "Um ou mais sabores selecionados estão temporariamente indisponíveis.",
        variant: "destructive",
      });
      return;
    }

    if (!size || selectedFlavors.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, selecione o tamanho e os sabores da pizza.",
        variant: "destructive",
      });
      return;
    }

    const newItem: CartItem = {
      size,
      flavors: selectedFlavors,
      notes,
      removeIngredients,
      total: orderTotal - (!isPickup ? (neighborhoods.find(n => n.id === address.neighborhood)?.deliveryFee || 0) : 0),
    };

    setCart([...cart, newItem]);
    
    // Reset pizza selection
    setSize("");
    setSelectedFlavors([]);
    setNotes("");
    setRemoveIngredients("");

    toast({
      title: "Item adicionado ao carrinho",
      description: "Sua pizza foi adicionada ao carrinho com sucesso!",
    });
  };

  const handleRemoveFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
    toast({
      title: "Item removido",
      description: "O item foi removido do carrinho.",
    });
  };

  const generateOrderSummary = () => {
    const cartItemsSummary = cart.map((item, index) => {
      const sizeInfo = pizzaSizes.find(s => s.id === item.size);
      const flavorNames = item.flavors
        .map(id => pizzaFlavors.find(f => f.id === id)?.name)
        .join(", ");
      
      return `
Pizza ${index + 1}:
*Tamanho:* ${sizeInfo?.name}
*Sabores:* ${flavorNames}
${item.notes ? `*Observações:* ${item.notes}\n` : ""}
${item.removeIngredients ? `*Retirar:* ${item.removeIngredients}\n` : ""}
*Valor:* R$ ${item.total.toFixed(2)}
`;
    }).join("\n");

    const date = new Date();
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    
    const addressInfo = isPickup 
      ? "*Retirada no local*" 
      : `*Endereço:* ${address.street}, ${address.number} - ${neighborhoods.find(n => n.id === address.neighborhood)?.name}`;
    
    return `*Pedido - Brother's Pizzaria*
Data: ${formattedDate}
Hora: ${formattedTime}

${cartItemsSummary}
*Valor Total:* R$ ${cartTotal.toFixed(2)}

*Cliente:* ${name}
*Telefone:* ${phone}
${addressInfo}
*Forma de Pagamento:* ${getPaymentMethodDisplay(payment)}
${needChange ? `Precisa de troco: Sim${changeAmount ? ` (Troco para R$ ${changeAmount})` : ""}` : ""}
Obrigado por realizar seu pedido.
${payment === "pix" ? "Nossa chave PIX é (75) 988510206 - Jeferson Barboza" : ""}`;
  };

  const handleVerifySummary = () => {
    if (cart.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Por favor, adicione pelo menos um item ao carrinho.",
        variant: "destructive",
      });
      return;
    }
    
    if (!name || !phone || (!isPickup && !address.street) || !payment) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    setShowSummary(true);
  };

  const handleWhatsAppOrder = () => {
    const summary = generateOrderSummary();
    const encodedMessage = encodeURIComponent(summary);
    window.open(`https://wa.me/5575991662591?text=${encodedMessage}`, "_blank");
  };

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case "tradicional":
        return "bg-gradient-to-r from-[#e6b980] to-[#eacda3]";
      case "especial":
        return "bg-gradient-to-r from-[#fdfcfb] to-[#e2d1c3]";
      case "doce":
        return "bg-gradient-to-r from-[#ffc3a0] to-[#ffafbd]";
      default:
        return "bg-primary/10";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "tradicional":
        return "🍕";
      case "especial":
        return "⭐";
      case "doce":
        return "🍫";
      default:
        return "🍽️";
    }
  };

  const renderFlavorItem = (flavor: PizzaFlavor) => (
    <div
      key={flavor.id}
      className={`p-4 rounded-lg cursor-pointer transition-all ${
        !flavor.available 
          ? 'bg-red-50 opacity-75 cursor-not-allowed'
          : selectedFlavors.includes(flavor.id)
          ? "bg-primary/10 border-2 border-primary shadow-md"
          : "hover:bg-primary/5 border-2 border-transparent hover:shadow-sm"
      }`}
      onClick={() => handleFlavorSelect(flavor.id)}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Pizza className="w-5 h-5 text-primary" />
            <span className={`font-bold ${!flavor.available ? 'text-red-500' : ''}`}>
              {flavor.name}
              {!flavor.available && ' (Indisponível)'}
            </span>
            {selectedFlavors.includes(flavor.id) && (
              <Check className="w-5 h-5 text-primary" />
            )}
          </div>
          <p className="text-sm text-gray-600">
            {flavor.description}
          </p>
        </div>
        <span className="font-bold text-primary">
          R$ {flavor.price.toFixed(2)}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary">
      <header className="bg-primary text-white py-4 px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:text-secondary transition-colors">
          <Home className="w-5 h-5" />
          <span className="font-quicksand">Página inicial</span>
        </Link>
        <h2 className="font-quicksand font-bold text-xl">Brother's Pizzaria</h2>
      </header>

      <div className="py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <Card className="mb-8 shadow-lg border-2 border-primary/20">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-4xl font-bold text-primary">
                Fazer Pedido
              </CardTitle>
              <CardDescription className="text-lg">
                Monte sua pizza do seu jeito
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
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
                <Button
                  type="button"
                  variant={isPickup ? "default" : "outline"}
                  className={`w-full flex items-center justify-center gap-2 ${
                    isPickup ? "bg-primary text-white" : ""
                  }`}
                  onClick={() => setIsPickup(!isPickup)}
                >
                  <MapPin className="w-5 h-5" />
                  {isPickup ? (
                    <span className="flex items-center gap-2">
                      Retirar no local
                      <Check className="w-5 h-5" />
                    </span>
                  ) : (
                    "Deseja retirar seu pedido?"
                  )}
                </Button>
              </div>

              {!isPickup && (
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
                  <Select
                    value={address.neighborhood}
                    onValueChange={(value) =>
                      setAddress({ ...address, neighborhood: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o bairro" />
                    </SelectTrigger>
                    <SelectContent>
                      {neighborhoods.map((neighborhood) => (
                        <SelectItem key={neighborhood.id} value={neighborhood.id}>
                          {neighborhood.name} - Taxa: R$ {neighborhood.deliveryFee.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    required
                    value={address.number}
                    onChange={(e) =>
                      setAddress({ ...address, number: e.target.value })
                    }
                    placeholder="Número"
                    type="text"
                    className="mt-2"
                  />
                  <Input
                    value={address.complement}
                    onChange={(e) =>
                      setAddress({ ...address, complement: e.target.value })
                    }
                    placeholder="Complemento (opcional)"
                    className="mt-2"
                  />
                </div>
              )}

              <h3 className="text-2xl font-bold text-primary">Tamanho da Pizza</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pizzaSizes.map((pizzaSize) => (
                  <Button
                    key={pizzaSize.id}
                    type="button"
                    variant={size === pizzaSize.id ? "default" : "outline"}
                    className={`flex flex-col items-center p-6 h-auto transition-all ${
                      size === pizzaSize.id
                        ? "bg-primary text-white scale-105"
                        : "hover:border-primary"
                    }`}
                    onClick={() => {
                      setSize(pizzaSize.id);
                      setSelectedFlavors([]);
                    }}
                  >
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: Math.min(pizzaSize.slices / 2, 1) }).map((_, i) => (
                        <Pizza
                          key={i}
                          className={`w-5 h-5 ${
                            size === pizzaSize.id ? "text-white" : "text-primary"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-bold">{pizzaSize.name}</span>
                    <span className="text-sm mt-1">
                      {pizzaSize.slices} fatias, {pizzaSize.maxFlavors} sabores
                    </span>
                  </Button>
                ))}
              </div>

              {size && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-primary">
                    Escolha os sabores
                  </h3>
                  <Accordion type="single" collapsible className="w-full">
                    {["tradicional", "especial", "doce"].map((category) => (
                      <AccordionItem key={category} value={category}>
                        <AccordionTrigger 
                          className={`text-lg font-semibold capitalize rounded-lg px-4 py-2 ${getCategoryGradient(category)} transition-all duration-200 hover:no-underline hover:scale-[1.02] group`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getCategoryIcon(category)}</span>
                            <span className="text-primary-dark group-hover:text-primary-dark/80">
                              {category}s
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="mt-2">
                          <div className="space-y-2 p-2">
                            {pizzaFlavors
                              .filter((flavor) => flavor.category === category)
                              .map((flavor) => renderFlavorItem(flavor))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  {selectedFlavors.length > 0 && (
                    <div className="mt-8 p-6 bg-primary/5 rounded-lg">
                      <h4 className="text-xl font-bold text-primary mb-2">Valor do Pedido</h4>
                      <p className="text-2xl font-bold">R$ {orderTotal.toFixed(2)}</p>
                    </div>
                  )}
                  
                  {selectedFlavors.length > 0 && (
                    <div className="mt-8 space-y-4">
                      <Button
                        type="button"
                        className="w-full"
                        onClick={handleAddToCart}
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Adicionar ao Carrinho
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {cart.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-primary">Carrinho</h3>
                  <div className="space-y-4">
                    {cart.map((item, index) => {
                      const sizeInfo = pizzaSizes.find(s => s.id === item.size);
                      const flavorNames = item.flavors
                        .map(id => pizzaFlavors.find(f => f.id === id)?.name)
                        .join(", ");
                      
                      return (
                        <Card key={index}>
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <p className="font-bold">Pizza {index + 1}</p>
                                <p>Tamanho: {sizeInfo?.name}</p>
                                <p>Sabores: {flavorNames}</p>
                                <p className="font-bold">R$ {item.total.toFixed(2)}</p>
                              </div>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleRemoveFromCart(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                    <div className="p-6 bg-primary/5 rounded-lg">
                      <h4 className="text-xl font-bold text-primary mb-2">Total do Carrinho</h4>
                      <p className="text-2xl font-bold">R$ {cartTotal.toFixed(2)}</p>
                    </div>
                  </div>
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

              {(payment === "cash" || payment === "cash_card") && needChange && (
                <div className="space-y-4">
                  <Label htmlFor="changeAmount">Troco para quanto?</Label>
                  <Input
                    id="changeAmount"
                    type="text"
                    placeholder="Digite o valor"
                    value={changeAmount}
                    onChange={(e) => setChangeAmount(e.target.value)}
                  />
                </div>
              )}

              {!showSummary ? (
                <Button
                  type="button"
                  className="w-full bg-primary text-white hover:bg-primary-dark"
                  onClick={handleVerifySummary}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
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
                    className="w-full py-6 text-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
                    onClick={handleWhatsAppOrder}
                  >
                    <Check className="w-6 h-6 mr-2" />
                    Confirmar Pedido no WhatsApp
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Footer - Only show after order confirmation */}
      {showSummary && (
        <footer className="mt-8 bg-white shadow-lg border-t border-gray-200 p-4">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-primary mb-2">Horário de Funcionamento</h3>
                  <p>Todos os dias</p>
                  <p>18:00 às 23:00</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-primary mb-2">Tempo Médio de Entrega</h3>
                  <p>45-60 minutos</p>
                  <p>Dependendo da região</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-primary mb-2">Contato</h3>
                  <p>(75) 98851-0206</p>
                  <p>brotherspizzaria@gmail.com</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-primary mb-2">Endereço</h3>
                  <p>Rua Antônio Balbino, 228</p>
                  <p>Cajueiro, Saj - BA</p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Order;

