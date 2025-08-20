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

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  time: string;
  image: string;
}

export interface OrderItem extends MenuItem {
  quantity: number;
  specialInstructions: string;
}

class RestaurantService {
  private menuItems: MenuItem[] = [
    // Pizza Category
    { 
      id: "1",
      name: "Margherita Pizza", 
      description: "Fresh tomato sauce, mozzarella, basil", 
      price: 18.99, 
      category: "Pizza",
      time: "15-20 min",
      image: margheritaPizza
    },
    { 
      id: "7",
      name: "Pepperoni Pizza", 
      description: "Classic pepperoni with mozzarella cheese", 
      price: 20.99, 
      category: "Pizza",
      time: "15-20 min",
      image: pepperoniPizza
    },
    { 
      id: "8",
      name: "BBQ Chicken Pizza", 
      description: "BBQ sauce, grilled chicken, red onions, cilantro", 
      price: 22.99, 
      category: "Pizza",
      time: "18-22 min",
      image: margheritaPizza
    },
    { 
      id: "19",
      name: "Supreme Pizza", 
      description: "Pepperoni, sausage, peppers, onions, mushrooms, olives", 
      price: 24.99, 
      category: "Pizza",
      time: "18-22 min",
      image: pepperoniPizza
    },
    { 
      id: "20",
      name: "Hawaiian Pizza", 
      description: "Ham, pineapple, mozzarella cheese", 
      price: 19.99, 
      category: "Pizza",
      time: "15-20 min",
      image: margheritaPizza
    },
    { 
      id: "21",
      name: "Meat Lovers Pizza", 
      description: "Pepperoni, sausage, bacon, ham, ground beef", 
      price: 26.99, 
      category: "Pizza",
      time: "20-25 min",
      image: pepperoniPizza
    },
    // Salads Category
    { 
      id: "2",
      name: "Caesar Salad", 
      description: "Romaine lettuce, parmesan, croutons, caesar dressing", 
      price: 12.99, 
      category: "Salads",
      time: "5-10 min",
      image: caesarSalad
    },
    { 
      id: "9",
      name: "Greek Salad", 
      description: "Fresh vegetables, feta cheese, olives, Greek dressing", 
      price: 14.99, 
      category: "Salads",
      time: "5-10 min",
      image: greekSalad
    },
    { 
      id: "10",
      name: "Garden Salad", 
      description: "Mixed greens, tomatoes, cucumbers, house vinaigrette", 
      price: 10.99, 
      category: "Salads",
      time: "5-8 min",
      image: caesarSalad
    },
    { 
      id: "22",
      name: "Caprese Salad", 
      description: "Fresh mozzarella, tomatoes, basil, balsamic glaze", 
      price: 13.99, 
      category: "Salads",
      time: "5-10 min",
      image: greekSalad
    },
    { 
      id: "23",
      name: "Spinach Salad", 
      description: "Baby spinach, strawberries, pecans, poppy seed dressing", 
      price: 12.99, 
      category: "Salads",
      time: "5-10 min",
      image: caesarSalad
    },
    // Main Course Category
    { 
      id: "3",
      name: "Grilled Salmon", 
      description: "Atlantic salmon with lemon herb seasoning", 
      price: 24.99, 
      category: "Main Course",
      time: "20-25 min",
      image: grilledSalmon
    },
    { 
      id: "11",
      name: "Ribeye Steak", 
      description: "12oz ribeye with garlic mashed potatoes", 
      price: 32.99, 
      category: "Main Course",
      time: "25-30 min",
      image: grilledSalmon
    },
    { 
      id: "12",
      name: "Grilled Chicken Breast", 
      description: "Herb-seasoned chicken with roasted vegetables", 
      price: 21.99, 
      category: "Main Course",
      time: "18-22 min",
      image: grilledSalmon
    },
    { 
      id: "24",
      name: "Pan-Seared Duck", 
      description: "Duck breast with cherry sauce and wild rice", 
      price: 28.99, 
      category: "Main Course",
      time: "25-30 min",
      image: grilledSalmon
    },
    { 
      id: "25",
      name: "Braised Lamb Shank", 
      description: "Slow-braised lamb with rosemary and red wine reduction", 
      price: 29.99, 
      category: "Main Course",
      time: "30-35 min",
      image: grilledSalmon
    },
    { 
      id: "26",
      name: "Fish and Chips", 
      description: "Beer-battered cod with crispy fries and tartar sauce", 
      price: 18.99, 
      category: "Main Course",
      time: "15-20 min",
      image: grilledSalmon
    },
    // Pasta Category
    { 
      id: "4",
      name: "Chicken Alfredo", 
      description: "Fettuccine pasta with grilled chicken in cream sauce", 
      price: 19.99, 
      category: "Pasta",
      time: "15-20 min",
      image: chickenAlfredo
    },
    { 
      id: "13",
      name: "Mushroom Risotto", 
      description: "Creamy arborio rice with wild mushrooms and parmesan", 
      price: 18.99, 
      category: "Pasta",
      time: "20-25 min",
      image: mushroomRisotto
    },
    { 
      id: "14",
      name: "Spaghetti Carbonara", 
      description: "Classic carbonara with pancetta, egg, and parmesan", 
      price: 17.99, 
      category: "Pasta",
      time: "12-15 min",
      image: chickenAlfredo
    },
    { 
      id: "27",
      name: "Seafood Linguine", 
      description: "Linguine with shrimp, scallops, and white wine sauce", 
      price: 24.99, 
      category: "Pasta",
      time: "18-22 min",
      image: chickenAlfredo
    },
    { 
      id: "28",
      name: "Lasagna", 
      description: "Classic meat lasagna with marinara and three cheeses", 
      price: 19.99, 
      category: "Pasta",
      time: "25-30 min",
      image: mushroomRisotto
    },
    { 
      id: "29",
      name: "Penne Arrabbiata", 
      description: "Spicy tomato sauce with garlic, red peppers, and herbs", 
      price: 16.99, 
      category: "Pasta",
      time: "12-15 min",
      image: chickenAlfredo
    },
    // Burgers Category
    { 
      id: "6",
      name: "Beef Burger", 
      description: "Angus beef patty with lettuce, tomato, onion", 
      price: 16.99, 
      category: "Burgers",
      time: "12-18 min",
      image: beefBurger
    },
    { 
      id: "15",
      name: "Cheeseburger", 
      description: "Classic beef burger with American cheese and fries", 
      price: 18.99, 
      category: "Burgers",
      time: "12-18 min",
      image: cheeseburger
    },
    { 
      id: "16",
      name: "Chicken Burger", 
      description: "Grilled chicken breast with avocado and mayo", 
      price: 17.99, 
      category: "Burgers",
      time: "15-20 min",
      image: beefBurger
    },
    { 
      id: "30",
      name: "Black Bean Burger", 
      description: "Vegetarian black bean patty with sprouts and chipotle mayo", 
      price: 15.99, 
      category: "Burgers",
      time: "12-15 min",
      image: beefBurger
    },
    { 
      id: "31",
      name: "BBQ Bacon Burger", 
      description: "Beef patty with bacon, BBQ sauce, onion rings", 
      price: 20.99, 
      category: "Burgers",
      time: "15-18 min",
      image: cheeseburger
    },
    { 
      id: "32",
      name: "Mushroom Swiss Burger", 
      description: "Beef patty with sautéed mushrooms and Swiss cheese", 
      price: 19.99, 
      category: "Burgers",
      time: "15-18 min",
      image: beefBurger
    },
    // Desserts Category
    { 
      id: "5",
      name: "Chocolate Lava Cake", 
      description: "Warm chocolate cake with molten center", 
      price: 8.99, 
      category: "Dessert",
      time: "10-15 min",
      image: chocolateLavaCake
    },
    { 
      id: "17",
      name: "Tiramisu", 
      description: "Classic Italian dessert with coffee and mascarpone", 
      price: 9.99, 
      category: "Dessert",
      time: "5-8 min",
      image: tiramisu
    },
    { 
      id: "18",
      name: "Cheesecake", 
      description: "New York style cheesecake with berry compote", 
      price: 8.99, 
      category: "Dessert",
      time: "5-8 min",
      image: chocolateLavaCake
    },
    { 
      id: "33",
      name: "Crème Brûlée", 
      description: "Vanilla custard with caramelized sugar crust", 
      price: 9.99, 
      category: "Dessert",
      time: "5-8 min",
      image: tiramisu
    },
    { 
      id: "34",
      name: "Apple Pie", 
      description: "Traditional apple pie with cinnamon and vanilla ice cream", 
      price: 7.99, 
      category: "Dessert",
      time: "8-12 min",
      image: chocolateLavaCake
    },
    { 
      id: "35",
      name: "Chocolate Brownie", 
      description: "Fudgy brownie with walnuts and vanilla ice cream", 
      price: 7.99, 
      category: "Dessert",
      time: "5-8 min",
      image: chocolateLavaCake
    },
    // Appetizers Category
    { 
      id: "36",
      name: "Buffalo Wings", 
      description: "Crispy chicken wings with buffalo sauce and blue cheese", 
      price: 12.99, 
      category: "Appetizers",
      time: "10-15 min",
      image: beefBurger
    },
    { 
      id: "37",
      name: "Mozzarella Sticks", 
      description: "Breaded mozzarella with marinara dipping sauce", 
      price: 9.99, 
      category: "Appetizers",
      time: "8-12 min",
      image: cheeseburger
    },
    { 
      id: "38",
      name: "Calamari Rings", 
      description: "Crispy fried squid rings with spicy aioli", 
      price: 11.99, 
      category: "Appetizers",
      time: "8-12 min",
      image: grilledSalmon
    },
    { 
      id: "39",
      name: "Loaded Nachos", 
      description: "Tortilla chips with cheese, jalapeños, sour cream, guacamole", 
      price: 13.99, 
      category: "Appetizers",
      time: "10-15 min",
      image: beefBurger
    },
    { 
      id: "40",
      name: "Spinach Artichoke Dip", 
      description: "Creamy spinach and artichoke dip with tortilla chips", 
      price: 10.99, 
      category: "Appetizers",
      time: "8-12 min",
      image: caesarSalad
    }
  ];

  private categories = Array.from(new Set(this.menuItems.map(item => item.category)));

  getMenu(): MenuItem[] {
    return this.menuItems;
  }

  getCategories(): string[] {
    return this.categories;
  }

  findItemByName(name: string): MenuItem | undefined {
    return this.menuItems.find(item => 
      item.name.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(item.name.toLowerCase())
    );
  }

  showCategory(category: string): { success: boolean; message: string } {
    const normalizedCategory = category.toLowerCase();
    const availableCategory = this.categories.find(cat => 
      cat.toLowerCase().includes(normalizedCategory) ||
      normalizedCategory.includes(cat.toLowerCase())
    );

    if (!availableCategory) {
      return { 
        success: false, 
        message: `Category "${category}" not found. Available categories: ${this.categories.join(', ')}` 
      };
    }

    // Find and click the category button
    const categoryButtons = document.querySelectorAll('#categories-container button');
    let categoryClicked = false;

    categoryButtons.forEach((button, index) => {
      if (button.textContent?.toLowerCase().includes(availableCategory.toLowerCase())) {
        (button as HTMLElement).click();
        categoryClicked = true;
        
        // Scroll to the first item of this category in the menu
        setTimeout(() => {
          const menuContainer = document.getElementById('menu-items-container');
          const categoryItems = this.menuItems.filter(item => item.category === availableCategory);
          if (menuContainer && categoryItems.length > 0) {
            const firstItemId = categoryItems[0].id;
            const firstItemElement = document.querySelector(`#menu-items-container [id*="${firstItemId}"]`);
            if (firstItemElement) {
              firstItemElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          }
        }, 100);
      }
    });

    if (categoryClicked) {
      return { 
        success: true, 
        message: `Showing ${availableCategory} category and scrolled to items` 
      };
    } else {
      return { 
        success: false, 
        message: `Failed to show ${availableCategory} category` 
      };
    }
  }

  addItemToOrder(itemName: string, quantity: number = 1): { success: boolean; message: string } {
    const item = this.findItemByName(itemName);
    if (!item) {
      const availableItems = this.menuItems.map(item => item.name).join(', ');
      return { 
        success: false, 
        message: `Item "${itemName}" not found. Available items: ${availableItems}` 
      };
    }

    // Find the item card in the DOM and click it
    const menuItems = document.querySelectorAll('#menu-items-container .cursor-pointer');
    let itemClicked = false;

    menuItems.forEach(menuElement => {
      const nameElement = menuElement.querySelector('h3');
      if (nameElement && nameElement.textContent?.includes(item.name)) {
        // Scroll to the item first to ensure it's visible
        menuElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        
        // Wait a moment, then click the item multiple times for quantity
        setTimeout(() => {
          for (let i = 0; i < quantity; i++) {
            (menuElement as HTMLElement).click();
          }
        }, 300);
        itemClicked = true;
      }
    });

    if (itemClicked) {
      return { 
        success: true, 
        message: `Added ${quantity} ${item.name}(s) to order for $${(item.price * quantity).toFixed(2)}` 
      };
    } else {
      return { 
        success: false, 
        message: `Failed to add ${item.name} to order` 
      };
    }
  }

  removeItemFromOrder(itemName: string): { success: boolean; message: string } {
    const item = this.findItemByName(itemName);
    if (!item) {
      return { 
        success: false, 
        message: `Item "${itemName}" not found` 
      };
    }

    // Find the item in the menu and repeatedly click minus button
    const menuItems = document.querySelectorAll('#menu-items-container .cursor-pointer');
    let itemFound = false;

    menuItems.forEach(menuElement => {
      const nameElement = menuElement.querySelector('h3');
      if (nameElement && nameElement.textContent?.includes(item.name)) {
        // Find all minus buttons (Minus icons) and click them
        const minusButtons = menuElement.querySelectorAll('button');
        minusButtons.forEach(button => {
          const svg = button.querySelector('svg');
          if (svg) {
            const path = svg.querySelector('path');
            // Check if it's a minus icon by looking for horizontal line path
            if (path && path.getAttribute('d')?.includes('M5 12h14')) {
              // Click minus button multiple times to remove all quantities
              for (let i = 0; i < 10; i++) {
                button.click();
              }
              itemFound = true;
            }
          }
        });
      }
    });

    if (itemFound) {
      return { 
        success: true, 
        message: `Removed ${item.name} from order` 
      };
    } else {
      return { 
        success: false, 
        message: `Failed to remove ${item.name} from order` 
      };
    }
  }

  updateItemQuantity(itemName: string, quantity: number): { success: boolean; message: string } {
    const item = this.findItemByName(itemName);
    if (!item) {
      return { 
        success: false, 
        message: `Item "${itemName}" not found` 
      };
    }

    if (quantity < 0) {
      return { 
        success: false, 
        message: `Quantity must be 0 or greater` 
      };
    }

    // First remove all existing quantities, then add the new quantity
    this.removeItemFromOrder(itemName);
    
    if (quantity > 0) {
      return this.addItemToOrder(itemName, quantity);
    } else {
      return { 
        success: true, 
        message: `Removed ${item.name} from order` 
      };
    }
  }

  addSpecialInstructions(itemName: string, instructions: string): { success: boolean; message: string } {
    const item = this.findItemByName(itemName);
    if (!item) {
      return { 
        success: false, 
        message: `Item "${itemName}" not found` 
      };
    }

    // Find the item's special instructions textarea
    const menuItems = document.querySelectorAll('#menu-items-container .cursor-pointer');
    let instructionsAdded = false;

    menuItems.forEach(menuElement => {
      const nameElement = menuElement.querySelector('h3');
      if (nameElement && nameElement.textContent?.includes(item.name)) {
        const textarea = menuElement.querySelector('textarea');
        if (textarea) {
          textarea.value = instructions;
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
          instructionsAdded = true;
        }
      }
    });

    if (instructionsAdded) {
      return { 
        success: true, 
        message: `Added special instructions to ${item.name}: "${instructions}"` 
      };
    } else {
      return { 
        success: false, 
        message: `Failed to add special instructions to ${item.name}. Item may not be in order yet.` 
      };
    }
  }

  scrollMenu(direction: 'up' | 'down', amount: 'small' | 'medium' | 'large' = 'medium'): { success: boolean; message: string } {
    const container = document.getElementById('menu-items-container');
    if (!container) {
      return { 
        success: false, 
        message: 'Menu container not found' 
      };
    }

    const scrollAmounts = {
      small: 200,
      medium: 400,
      large: 600
    };

    const scrollDistance = scrollAmounts[amount];
    const scrollTop = direction === 'down' ? scrollDistance : -scrollDistance;

    container.scrollBy({
      top: scrollTop,
      behavior: 'smooth'
    });

    return { 
      success: true, 
      message: `Scrolled menu ${direction} (${amount})` 
    };
  }

  placeOrder(roomNumber: string): { success: boolean; message: string } {
    if (!roomNumber.trim()) {
      return { 
        success: false, 
        message: 'Room number is required' 
      };
    }

    // Click the place order button to open the dialog
    const placeOrderButton = document.getElementById('place-order-button');
    if (!placeOrderButton) {
      return { 
        success: false, 
        message: 'Place order button not found' 
      };
    }

    placeOrderButton.click();

    // Wait a moment for dialog to open, then fill room number and confirm
    setTimeout(() => {
      const roomNumberInput = document.getElementById('room-number') as HTMLInputElement;
      if (roomNumberInput) {
        roomNumberInput.value = roomNumber;
        roomNumberInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Find and click the confirm button
        const confirmButton = document.querySelector('[role="dialog"] button:last-child') as HTMLElement;
        if (confirmButton) {
          confirmButton.click();
        }
      }
    }, 500);

    return { 
      success: true, 
      message: `Placing order for room ${roomNumber}` 
    };
  }

  clearOrder(): { success: boolean; message: string } {
    // Find all minus buttons and click them to clear the order
    const minusButtons = document.querySelectorAll('#menu-items-container button');
    let itemsCleared = 0;

    minusButtons.forEach(button => {
      const svg = button.querySelector('svg');
      if (svg) {
        const path = svg.querySelector('path');
        if (path && path.getAttribute('d')?.includes('M5 12h14')) { // Minus icon path
          for (let i = 0; i < 10; i++) { // Click multiple times to ensure all quantities are removed
            (button as HTMLElement).click();
          }
          itemsCleared++;
        }
      }
    });

    return { 
      success: true, 
      message: itemsCleared > 0 ? 'Order cleared successfully' : 'Order was already empty' 
    };
  }

  getOrderSummary(): { success: boolean; message: string; data?: any } {
    // Read the order summary from the DOM
    const orderSummary = document.getElementById('order-summary-container');
    if (!orderSummary) {
      return { 
        success: false, 
        message: 'Order summary not found' 
      };
    }

    const orderItems = orderSummary.querySelectorAll('.bg-gray-900\\/50');
    const items: any[] = [];
    let totalAmount = 0;

    orderItems.forEach(item => {
      const nameElement = item.querySelector('h4');
      const paragraphs = item.querySelectorAll('p');
      let qtyElement = null;
      
      // Find the quantity paragraph
      paragraphs.forEach(p => {
        if (p.textContent?.includes('Qty:')) {
          qtyElement = p;
        }
      });
      
      const priceElement = item.querySelector('.text-green-400');
      const instructionsElement = item.querySelector('.text-xs');

      if (nameElement && qtyElement && priceElement) {
        const name = nameElement.textContent || '';
        const quantity = parseInt(qtyElement.textContent?.replace('Qty: ', '') || '0');
        const price = parseFloat(priceElement.textContent?.replace('$', '') || '0');
        const instructions = instructionsElement?.textContent?.replace('Note: ', '') || '';

        items.push({
          name,
          quantity,
          price,
          instructions: instructions || 'None'
        });

        totalAmount += price;
      }
    });

    if (items.length === 0) {
      return { 
        success: true, 
        message: 'Order is empty',
        data: { items: [], total: 0, estimatedTime: '0 min' }
      };
    }

    const totalElement = orderSummary.querySelector('.text-xl .text-green-400');
    
    // Find estimated time element
    const smallElements = orderSummary.querySelectorAll('.text-sm');
    let timeElement = null;
    smallElements.forEach(el => {
      if (el.textContent?.includes('Estimated Time:')) {
        timeElement = el;
      }
    });
    
    const total = totalElement?.textContent?.replace('$', '') || totalAmount.toFixed(2);
    const estimatedTime = timeElement?.textContent?.replace('Estimated Time:', '').trim() || 'Unknown';

    const summary = {
      items,
      total: parseFloat(total),
      estimatedTime,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
    };

    const itemsList = items.map(item => 
      `${item.name} x${item.quantity} - $${item.price.toFixed(2)}${item.instructions !== 'None' ? ` (Note: ${item.instructions})` : ''}`
    ).join(', ');

    return { 
      success: true, 
      message: `Current order: ${itemsList}. Total: $${summary.total}, Estimated time: ${summary.estimatedTime}`,
      data: summary
    };
  }
}

export const restaurantService = new RestaurantService();