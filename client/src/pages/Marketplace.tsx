import { useState } from "react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, ShoppingCart, Plus, Star } from "lucide-react";

interface Product {
  id: string;
  name: string;
  seller: string;
  price: number;
  currency: string;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  inStock: boolean;
}

interface Order {
  id: string;
  productName: string;
  seller: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "cancelled";
  orderDate: string;
}

export default function Marketplace() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock products data
  const products: Product[] = [
    {
      id: "prod_001",
      name: "Premium Wireless Headphones",
      seller: "Tech Store",
      price: 199.99,
      currency: "USD",
      rating: 4.8,
      reviews: 245,
      image: "🎧",
      category: "electronics",
      inStock: true,
    },
    {
      id: "prod_002",
      name: "USB-C Fast Charger",
      seller: "Power Solutions",
      price: 49.99,
      currency: "USD",
      rating: 4.6,
      reviews: 128,
      image: "🔌",
      category: "electronics",
      inStock: true,
    },
    {
      id: "prod_003",
      name: "Laptop Stand",
      seller: "Office Essentials",
      price: 79.99,
      currency: "USD",
      rating: 4.7,
      reviews: 89,
      image: "🖥️",
      category: "accessories",
      inStock: true,
    },
    {
      id: "prod_004",
      name: "Mechanical Keyboard",
      seller: "Gaming Gear",
      price: 159.99,
      currency: "USD",
      rating: 4.9,
      reviews: 312,
      image: "⌨️",
      category: "electronics",
      inStock: false,
    },
    {
      id: "prod_005",
      name: "Phone Case",
      seller: "Protection Plus",
      price: 29.99,
      currency: "USD",
      rating: 4.5,
      reviews: 567,
      image: "📱",
      category: "accessories",
      inStock: true,
    },
    {
      id: "prod_006",
      name: "Screen Protector",
      seller: "Protection Plus",
      price: 14.99,
      currency: "USD",
      rating: 4.4,
      reviews: 234,
      image: "🛡️",
      category: "accessories",
      inStock: true,
    },
  ];

  // Mock orders data
  const orders: Order[] = [
    {
      id: "ord_001",
      productName: "Premium Wireless Headphones",
      seller: "Tech Store",
      amount: 199.99,
      currency: "USD",
      status: "completed",
      orderDate: "2026-06-15",
    },
    {
      id: "ord_002",
      productName: "USB-C Fast Charger",
      seller: "Power Solutions",
      amount: 49.99,
      currency: "USD",
      status: "completed",
      orderDate: "2026-06-10",
    },
    {
      id: "ord_003",
      productName: "Laptop Stand",
      seller: "Office Essentials",
      amount: 79.99,
      currency: "USD",
      status: "pending",
      orderDate: "2026-06-20",
    },
  ];

  const categories = ["all", "electronics", "accessories", "software"];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Marketplace</h1>
            <p className="text-muted-foreground mt-2">Browse and purchase from verified sellers</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Sell on FLATRA
          </Button>
        </div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Browse Products</TabsTrigger>
            <TabsTrigger value="orders">My Orders ({orders.length})</TabsTrigger>
          </TabsList>

          {/* Browse Products Tab */}
          <TabsContent value="browse" className="space-y-6 mt-6">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover:border-primary/40 transition-colors cursor-pointer"
                    onClick={() => setLocation(`/marketplace/${product.id}`)}
                  >
                    <div className="p-6">
                      {/* Product Image */}
                      <div className="w-full h-32 rounded-lg bg-primary/10 flex items-center justify-center text-5xl mb-4">
                        {product.image}
                      </div>

                      {/* Product Info */}
                      <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{product.seller}</p>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          <span className="text-sm font-semibold">{product.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">({product.reviews} reviews)</span>
                      </div>

                      {/* Price and Stock */}
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-lg font-bold">
                          {product.currency} {product.price.toLocaleString()}
                        </p>
                        <Badge variant={product.inStock ? "default" : "secondary"}>
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </div>

                      {/* Add to Cart Button */}
                      <Button className="w-full gap-2" disabled={!product.inStock}>
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No products found</p>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* My Orders Tab */}
          <TabsContent value="orders" className="space-y-6 mt-6">
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{order.productName}</h3>
                          <Badge
                            variant={order.status === "completed" ? "default" : "secondary"}
                            className="capitalize"
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{order.seller}</p>
                        <p className="text-xs text-muted-foreground">Order ID: {order.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          {order.currency} {order.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">{order.orderDate}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-4">No orders yet</p>
                <Button onClick={() => setSelectedCategory("all")}>Start Shopping</Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
