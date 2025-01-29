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

const Order = () => {
  const { toast } = useToast();
  const [size, setSize] = useState("");
  const [category, setCategory] = useState("");
  const [flavor, setFlavor] = useState("");
  const [payment, setPayment] = useState("");
  const [needChange, setNeedChange] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Pedido enviado!",
      description: "Em breve entraremos em contato para confirmar seu pedido.",
    });
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Label>Tamanho da Pizza</Label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tamanho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="grande">Grande</SelectItem>
                    <SelectItem value="familia">Família</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Categoria</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tradicional">Tradicionais</SelectItem>
                    <SelectItem value="especial">Especiais</SelectItem>
                    <SelectItem value="doce">Doces</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Observações (opcional)</Label>
                <Textarea placeholder="Digite suas observações aqui..." />
              </div>

              <div className="space-y-4">
                <Label>Ingredientes para retirar (opcional)</Label>
                <Textarea placeholder="Digite os ingredientes que deseja retirar..." />
              </div>

              <div className="space-y-4">
                <Label>Nome</Label>
                <Input required placeholder="Seu nome completo" />
              </div>

              <div className="space-y-4">
                <Label>Telefone</Label>
                <Input
                  required
                  type="tel"
                  placeholder="(00) 00000-0000"
                  pattern="\([0-9]{2}\) [0-9]{5}-[0-9]{4}"
                />
              </div>

              <div className="space-y-4">
                <Label>Endereço</Label>
                <Input required placeholder="Rua" className="mb-2" />
                <Input required placeholder="Bairro" className="mb-2" />
                <Input required placeholder="Número" type="number" />
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

              <Button type="submit" className="w-full">
                Enviar Pedido
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Order;