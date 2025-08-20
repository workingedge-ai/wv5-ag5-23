import React, { useEffect, useState } from "react";
import { Clock, Minus, Plus, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { restaurantService } from "@/services/restaurantService";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  time: string;
  image: string;
}

interface OrderItem extends MenuItem {
  quantity: number;
  specialInstructions: string;
}

const MobileRestaurant = () => {
  const [selectedCategory, setSelectedCategory] = useState("Pizza");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  
  const roomNumber = localStorage.getItem('mobile-room-number') || '';
  const guestName = localStorage.getItem('mobile-guest-name') || '';

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const menuItems: MenuItem[] = restaurantService.getMenu();
  const categories = restaurantService.getCategories();
  const filteredItems = menuItems.filter(item => item.category === selectedCategory);

  const addToOrder = (item: MenuItem) => {
    const existingItem = orderItems.find(orderItem => orderItem.id === item.id);
    if (existingItem) {
      setOrderItems(orderItems.map(orderItem => 
        orderItem.id === item.id ? {
          ...orderItem,
          quantity: orderItem.quantity + 1
        } : orderItem
      ));
    } else {
      setOrderItems([...orderItems, {
        ...item,
        quantity: 1,
        specialInstructions: ""
      }]);
    }
    toast.success(`${item.name} added to order`);
  };

  const updateQuantity = (id: string, change: number) => {
    setOrderItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          return {
            ...item,
            quantity: Math.max(0, newQuantity)
          };
        }
        return item;
      }).filter(item => item.quantity > 0);

      return updatedItems;
    });
  };

  const removeItemFromOrder = (id: string) => {
    setOrderItems(prevItems => prevItems.filter(item => item.id !== id));
    restaurantService.removeItemFromOrder(menuItems.find(item => item.id === id)?.name || '');
  };

  const updateSpecialInstructions = (id: string, instructions: string) => {
    setOrderItems(orderItems.map(item => 
      item.id === id ? {
        ...item,
        specialInstructions: instructions
      } : item
    ));
  };

  const getTotalPrice = () => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getEstimatedTime = () => {
    if (orderItems.length === 0) return "0 min";
    const maxTime = Math.max(...orderItems.map(item => {
      const timeRange = item.time.split('-').map(t => parseInt(t));
      return timeRange[1] || timeRange[0];
    }));
    return `${maxTime} min`;
  };

  const handlePlaceOrder = () => {
    const orderData = {
      roomNumber: roomNumber,
      guestName: guestName,
      orderTime: new Date().toISOString(),
      items: orderItems.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.price * item.quantity,
        specialInstructions: item.specialInstructions || null,
        preparationTime: item.time
      })),
      totalAmount: getTotalPrice(),
      estimatedPreparationTime: getEstimatedTime(),
      orderStatus: "received"
    };

    console.log("Mobile Order JSON:", JSON.stringify(orderData, null, 2));
    toast.success(`Order placed for Room ${roomNumber}!`);

    // Reset order
    setOrderItems([]);
    setIsOrderDialogOpen(false);
    setShowOrderSummary(false);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-20">
      {/* Categories - Horizontal Scroll */}
      <div className="px-4 py-3 border-b border-gray-800 sticky top-16 bg-black/90 backdrop-blur-md z-40">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className={`whitespace-nowrap ${
                selectedCategory === category 
                  ? 'bg-white text-black' 
                  : 'bg-gray-900 text-gray-300 border-gray-700 hover:bg-gray-800'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 py-4 space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">{selectedCategory}</h2>
        {filteredItems.map((item) => {
          const orderItem = orderItems.find(orderItem => orderItem.id === item.id);
          
          return (
            <Card 
              key={item.id}
              className="bg-gray-900/50 border-gray-700 hover:border-gray-500 transition-all duration-300"
            >
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-white truncate pr-2">{item.name}</h3>
                      <span className="text-lg font-bold text-green-400 flex-shrink-0">${item.price}</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                      <div className="flex items-center text-gray-400 text-xs">
                        <Clock size={12} className="mr-1" />
                        {item.time}
                      </div>
                    </div>
                    
                    {!orderItem ? (
                      <Button 
                        onClick={() => addToOrder(item)}
                        size="sm"
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        Add to Order
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus size={14} />
                            </Button>
                            <span className="text-white font-semibold min-w-[2rem] text-center">
                              {orderItem.quantity}
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus size={14} />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItemFromOrder(item.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          >
                            <X size={14} />
                          </Button>
                        </div>
                        <Textarea
                          placeholder="Special instructions (optional)"
                          value={orderItem.specialInstructions || ""}
                          onChange={(e) => updateSpecialInstructions(item.id, e.target.value)}
                          className="bg-gray-800 border-gray-600 text-gray-300 placeholder-gray-500 text-sm resize-none"
                          rows={2}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Floating Order Button */}
      {orderItems.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <Button
            onClick={() => setShowOrderSummary(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center">
              <ShoppingCart size={20} className="mr-2" />
              <span>View Order ({orderItems.length} items)</span>
            </div>
            <span className="font-bold">${getTotalPrice().toFixed(2)}</span>
          </Button>
        </div>
      )}

      {/* Order Summary Modal */}
      <Dialog open={showOrderSummary} onOpenChange={setShowOrderSummary}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-[95vw] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart size={20} />
              Order Summary
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {orderItems.map(item => (
                <div key={item.id} className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{item.name}</h4>
                      <p className="text-sm text-gray-300">Qty: {item.quantity}</p>
                      {item.specialInstructions && (
                        <p className="text-xs text-gray-400 mt-1">
                          Note: {item.specialInstructions}
                        </p>
                      )}
                    </div>
                    <span className="text-green-400 font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span className="text-green-400">${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>Estimated Time:</span>
                <span>{getEstimatedTime()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>Room:</span>
                <span>{roomNumber}</span>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline"
                onClick={() => setShowOrderSummary(false)}
                className="flex-1"
              >
                Continue Shopping
              </Button>
              <Button 
                onClick={handlePlaceOrder}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Place Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MobileRestaurant;