import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

// Product type
interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string | null;
  stock: number;
}

export default function ProductDetail() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [, params] = useRoute<{ id: string }>("/products/:id");
  const [quantity, setQuantity] = useState("1");

  // Get product ID from URL params
  const productId = params?.id ? parseInt(params.id, 10) : -1;

  // Fetch product details
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    enabled: productId > 0,
  });

  // Handler for adding product to cart
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!product) return;
    
    // Add to cart logic will be implemented here
    console.log(`Add ${quantity} of product ${productId} to cart`);
    
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart`,
    });
  };

  const handleBackToProducts = () => {
    navigate("/products");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
                <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
                <Button onClick={handleBackToProducts}>
                  Back to Products
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Generate an array of quantity options based on stock
  const quantityOptions = Array.from(
    { length: Math.min(10, product.stock) },
    (_, i) => (i + 1).toString()
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={handleBackToProducts}>
            ← Back to Products
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="text-muted-foreground text-xl">No image available</div>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{product.name}</CardTitle>
              <p className="text-2xl font-bold text-primary">${product.price}</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">{product.description}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Availability</h3>
                <p className={product.stock > 0 ? "text-green-500" : "text-red-500"}>
                  {product.stock > 0 
                    ? `In Stock (${product.stock} available)` 
                    : "Out of Stock"}
                </p>
              </div>

              {product.stock > 0 && (
                <div className="flex items-center gap-4">
                  <div className="w-24">
                    <Select
                      value={quantity}
                      onValueChange={setQuantity}
                      disabled={product.stock <= 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Qty" />
                      </SelectTrigger>
                      <SelectContent>
                        {quantityOptions.map((value) => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter>
              <Button 
                onClick={handleAddToCart}
                className="w-full"
                size="lg"
                disabled={product.stock <= 0}
              >
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}