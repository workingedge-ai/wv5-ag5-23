import React, { useEffect, useState } from "react";
import { Clock, Minus, Plus, ShoppingCart } from "lucide-react";
import { useRestaurantNavigation } from "@/hooks/useRestaurantNavigation";
import { useNavigation } from "@/hooks/useUniversalNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Import food images
import margheritaPizza from "@/assets/food/margherita-pizza.jpg";
import caesarSalad from "@/assets/food/caesar-salad.jpg";
import grilledSalmon from "@/assets/food/grilled-salmon.jpg";
import chickenAlfredo from "@/assets/food/chicken-alfredo.jpg";
import chocolateLavaCake from "@/assets/food/chocolate-lava-cake.jpg";
import beefBurger from "@/assets/food/beef-burger.jpg";
import pepperoniPizza from "@/assets/food/pepperoni-pizza.jpg";
import greekSalad from "@/assets/food/greek-salad.jpg";
import mushroomRisotto from "@/assets/food/mushroom-risotto.jpg";
import cheeseburger from "@/assets/food/cheeseburger.jpg";
import tiramisu from "@/assets/food/tiramisu.jpg";
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
const Restaurant = () => {
  const universalNavigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState("Pizza");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [roomNumber, setRoomNumber] = useState("");

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const menuItems: MenuItem[] = restaurantService.getMenu();
  const categories = restaurantService.getCategories();
  const filteredItems = menuItems; // Show all items continuously

  // Initialize keyboard navigation
  const navigation = useRestaurantNavigation(categories.length, filteredItems.length, 4, universalNavigation);
  const addToOrder = (item: MenuItem) => {
    const existingItem = orderItems.find(orderItem => orderItem.id === item.id);
    if (existingItem) {
      setOrderItems(orderItems.map(orderItem => orderItem.id === item.id ? {
        ...orderItem,
        quantity: orderItem.quantity + 1
      } : orderItem));
    } else {
      setOrderItems([...orderItems, {
        ...item,
        quantity: 1,
        specialInstructions: ""
      }]);
    }
  };
  const updateQuantity = (id: string, change: number) => {
    setOrderItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          return {
            ...item,
            quantity: Math.max(0, newQuantity) // Ensure quantity never goes below 0
          };
        }
        return item;
      }).filter(item => item.quantity > 0); // Remove items with 0 quantity

      return updatedItems;
    });
  };
  const removeItemFromOrder = (id: string) => {
    setOrderItems(prevItems => prevItems.filter(item => item.id !== id));
    // Also call the service method for proper integration
    restaurantService.removeItemFromOrder(menuItems.find(item => item.id === id)?.name || '');
  };
  const updateSpecialInstructions = (id: string, instructions: string) => {
    setOrderItems(orderItems.map(item => item.id === id ? {
      ...item,
      specialInstructions: instructions
    } : item));
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
    if (!roomNumber.trim()) {
      toast.error("Please enter a room number");
      return;
    }
    const orderData = {
      roomNumber: roomNumber.trim(),
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
    console.log("Order JSON:", JSON.stringify(orderData, null, 2));
    toast.success(`Order placed for Room ${roomNumber}!`);

    // Reset order
    setOrderItems([]);
    setRoomNumber("");
    setIsOrderDialogOpen(false);
  };
    return <div className="min-h-screen bg-transparent text-white overflow-hidden">
      {/* Main Content - 3 Column Layout */}
      <div className="flex h-[calc(100vh-120px)] pt-4 py-0 my-0 fixed w-full">
        {/* Left Section - Categories */}
        <div className="w-1/4 border-r border-gray-800 p-6">
          <h2 className="text-2xl font-bold mb-6">Categories</h2>
          <div id="categories-container" className="space-y-2">
            {categories.map((category, index) => <button key={category} id={`category-${index}`} onClick={() => {
            setSelectedCategory(category);
            // Scroll to the category section
            const categorySection = document.getElementById(`category-section-${category.toLowerCase()}`);
            if (categorySection) {
              categorySection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          }} className={`
                  w-full text-left px-4 py-2 rounded-lg transition-all duration-200
                  ${selectedCategory === category ? 'text-white bg-white/10 font-semibold' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-900/50'}
                  ${navigation.currentSection === 'categories' && navigation.focusedIndex === index && navigation.focusedIndex !== -1 ? 'ring-2 ring-white' : ''}
                `}>
                {category}
              </button>)}
          </div>
        </div>

        {/* Middle Section - Menu Items */}
        <div className="w-1/2 p-6">
          <h2 className="text-2xl font-bold mb-6">Full Menu</h2>
          <div id="menu-items-container" className="space-y-4 overflow-y-auto h-full pb-20" style={{
          maxHeight: 'calc(100vh - 220px)'
        }}>
            {categories.map(category => <div key={category} id={`category-section-${category.toLowerCase()}`}>
                <h3 className="text-xl font-bold text-white mb-4 mt-6 first:mt-0 sticky top-0 bg-black/90 py-2 z-10">
                  {category}
                </h3>
                <div className="space-y-4">
                  {filteredItems.filter(item => item.category === category).map((item, categoryIndex) => {
                // Calculate global index across all categories
                const globalIndex = filteredItems.findIndex(globalItem => globalItem.id === item.id);
                return <Card key={item.id} id={`menu-item-${globalIndex}`} className={`
                        bg-gray-900/50 border-gray-700 hover:border-gray-500 transition-all duration-300 cursor-pointer
                        ${navigation.currentSection === 'menu-items' && navigation.focusedIndex === globalIndex && navigation.focusedIndex !== -1 ? 'border-white bg-white/10 shadow-lg shadow-white/20' : ''}
                      `} onClick={() => addToOrder(item)}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-semibold text-white">{item.name}</h3>
                              <span className="text-lg font-bold text-green-400">${item.price}</span>
                            </div>
                            <p className="text-gray-300 mb-3">{item.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-sm bg-gray-700 px-2 py-1 rounded">{item.category}</span>
                              <div className="flex items-center text-gray-400 text-sm">
                                <Clock size={14} className="mr-1" />
                                {item.time}
                              </div>
                            </div>
                            {orderItems.find(orderItem => orderItem.id === item.id) && <div className="mt-3 space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-300">Quantity:</span>
                                  <Button variant="outline" size="sm" onClick={e => {
                              e.stopPropagation();
                              updateQuantity(item.id, -1);
                            }}>
                                    <Minus size={14} />
                                  </Button>
                                  <span className="text-white font-semibold">
                                    {orderItems.find(orderItem => orderItem.id === item.id)?.quantity || 0}
                                  </span>
                                  <Button variant="outline" size="sm" onClick={e => {
                              e.stopPropagation();
                              updateQuantity(item.id, 1);
                            }}>
                                    <Plus size={14} />
                                  </Button>
                                </div>
                                <Textarea placeholder="Special instructions (optional)" value={orderItems.find(orderItem => orderItem.id === item.id)?.specialInstructions || ""} onChange={e => updateSpecialInstructions(item.id, e.target.value)} className="bg-gray-800 border-gray-600 text-gray-300 placeholder-gray-500 text-sm resize-none" rows={2} onClick={e => e.stopPropagation()} />
                              </div>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>;
              })}
                </div>
              </div>)}
          </div>
        </div>

        {/* Right Section - Order Summary */}
        <div className="w-1/4 border-l border-gray-800 p-6">
          <div id="order-summary-container">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <ShoppingCart size={24} />
              Order Summary
            </h2>
            
            {orderItems.length === 0 ? <p className="text-gray-400 text-center py-8">No items in order</p> : <div className="space-y-4">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {orderItems.map(item => <div key={item.id} className="bg-gray-900/50 p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-white">{item.name}</h4>
                          <p className="text-sm text-gray-300">Qty: {item.quantity}</p>
                          {item.specialInstructions && <p className="text-xs text-gray-400 mt-1">
                              Note: {item.specialInstructions}
                            </p>}
                        </div>
                        <span className="text-green-400 font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>)}
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
                </div>
                
                <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
                  <DialogTrigger asChild>
                    <Button id="place-order-button" className={`
                        w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3
                        ${navigation.currentSection === 'place-order' ? 'ring-2 ring-white' : ''}
                      `}>
                      Place Order
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-700 text-white">
                    <DialogHeader>
                      <DialogTitle>Confirm Order</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="room-number">Room Number</Label>
                        <Input id="room-number" value={roomNumber} onChange={e => setRoomNumber(e.target.value)} placeholder="Enter your room number" className="bg-gray-800 border-gray-600 text-white" />
                      </div>
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Order Summary</h4>
                        <div className="space-y-2 text-sm">
                          {orderItems.map(item => <div key={item.id} className="flex justify-between">
                              <span>{item.name} x{item.quantity}</span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>)}
                          <div className="border-t border-gray-600 pt-2 font-semibold">
                            <div className="flex justify-between">
                              <span>Total:</span>
                              <span className="text-green-400">${getTotalPrice().toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button onClick={handlePlaceOrder} className="w-full bg-green-600 hover:bg-green-700" disabled={!roomNumber.trim()}>
                        Confirm Order
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
export default Restaurant;