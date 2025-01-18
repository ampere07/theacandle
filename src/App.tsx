import { useState } from 'react';
import { ShoppingCart, Flame, Menu, X, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Section {
  id: string;
  title: string;
}

const sections: Section[] = [
  { id: 'home', title: 'Home' },
  { id: 'shop', title: 'Shop' },
];

const products: Product[] = [
  {
    id: 1,
    name: "Raurr",
    price: 24.99,
    description: "A soothing blend of vanilla and warm amber",
    image: "https://images.unsplash.com/photo-1602874801007-bd36c362e1d6?auto=format&fit=crop&q=80&w=500",
  },
  {
    id: 2,
    name: "Lavender Fields",
    price: 29.99,
    description: "Pure lavender essence for relaxation",
    image: "https://images.unsplash.com/photo-1596433809252-901acb55fc63?auto=format&fit=crop&q=80&w=500",
  },
  {
    id: 3,
    name: "Ocean Breeze",
    price: 27.99,
    description: "Fresh marine scents with a hint of citrus",
    image: "/image/bear.jpg",
  },
  {
    id: 4,
    name: "Cozy Fireside",
    price: 32.99,
    description: "Woody notes with a touch of smoke",
    image: "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&q=80&w=500",
  },
];

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact: '',
    paymentMethod: 'cod'
  });

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (!formData.name || !formData.address || !formData.contact) {
      alert('Please fill in all required fields');
      return;
    }
    
    console.log('Order placed:', { cart, formData });
    alert('Order placed successfully!');
    setCart([]);
  };

  const handleNavigation = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return (
          <div className="pt-16">
            {/* Hero Section */}
            <div className="relative bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1601479604588-68d9e6d386b5?auto=format&fit=crop&q=80&w=2000"
                alt="Candle making"
                className="w-full h-[60vh] object-cover opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-stone-900 sm:text-5xl md:text-6xl">
                    Handcrafted Candles
                  </h1>
                  <p className="mt-3 max-w-md mx-auto text-base text-stone-700 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                    Illuminate your space with our artisanal collection of luxury candles
                  </p>
                  <Button 
                    className="mt-8 bg-amber-600 hover:bg-amber-700"
                    onClick={() => handleNavigation('shop')}
                  >
                    Shop Now
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-stone-900">Handcrafted</h3>
                  <p className="mt-2 text-stone-600">Each candle is carefully made by hand with attention to detail</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-stone-900">Natural Ingredients</h3>
                  <p className="mt-2 text-stone-600">We use only the finest natural waxes and essential oils</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-stone-900">Eco-Friendly</h3>
                  <p className="mt-2 text-stone-600">Sustainable packaging and environmentally conscious practices</p>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white py-24">
              <div className="max-w-4xl mx-auto px-6 sm:px-8">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-stone-900 sm:text-3xl md:text-6xl">
                    Our Story
                  </h1>
                  <p
                    className="text-stone-700 leading-relaxed text-xl max-w-xl mx-auto mb-6"
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    Welcome to Reign. We’re passionate about creating an ambiance that<br />
                    inspires comfort and connection. With a focus on handcrafted quality<br />
                    and sustainability, each of our candles tells a story of warmth and<br />
                    beauty.
                  </p>
                  <p
                    className="text-stone-700 leading-relaxed text-xl max-w-xl mx-auto"
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    Our dedication to using natural ingredients and eco-friendly practices<br />
                    ensures that every product enhances your space responsibly and<br />
                    meaningfully.
                  </p>
                </div>
              </div>
            </div>



            {/* Contact Section */}
            <div className="py-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h2 className="text-3xl font-bold text-stone-900 mb-6">Get in Touch</h2>
                    <p className="text-stone-600 mb-8">
                      We'd love to hear from you. Whether you have a question about our products,
                      custom orders, or anything else, our team is here to help.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-amber-600" />
                        <span className="text-stone-600">hello@reign.com</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-amber-600" />
                        <span className="text-stone-600">+1 (555) 123-4567</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-amber-600" />
                        <span className="text-stone-600">123 Candle Street, Wax City, FL 12345</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-stone-900 mb-4">Send us a Message</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="contact-name">Name</Label>
                        <Input id="contact-name" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="contact-email">Email</Label>
                        <Input id="contact-email" type="email" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="contact-message">Message</Label>
                        <textarea
                          id="contact-message"
                          rows={4}
                          className="w-full mt-1 rounded-md border border-stone-200 focus:border-amber-500 focus:ring-amber-500"
                        />
                      </div>
                      <Button className="w-full bg-amber-600 hover:bg-amber-700">
                        Send Message
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'shop':
        return (
          <div className="pt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <h2 className="text-3xl font-bold text-stone-900 mb-8">Our Collection</h2>
              <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {products.map((product) => (
                  <Card key={product.id} className="group relative">
                    <div className="w-full min-h-80 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-center object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-stone-900">{product.name}</h3>
                      <p className="mt-1 text-sm text-stone-500">{product.description}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <p className="text-lg font-medium text-stone-900">${product.price}</p>
                        <Button
                          onClick={() => addToCart(product)}
                          className="bg-amber-600 hover:bg-amber-700"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <nav className="bg-stone-100 border-b border-stone-200 fixed w-full z-10 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center cursor-pointer" onClick={() => handleNavigation('home')}>
              <Flame className="h-8 w-8 text-amber-600" />
              <span className="ml-2 text-2xl font-semibold text-stone-800">Reign</span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleNavigation(section.id)}
                  className={`text-stone-600 hover:text-stone-900 ${
                    activeSection === section.id ? 'font-semibold text-stone-900' : ''
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <ShoppingCart className="h-6 w-6" />
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-amber-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Shopping Cart</SheetTitle>
                  </SheetHeader>
                  <div className="mt-8">
                    {cart.length === 0 ? (
                      <p className="text-stone-500">Your cart is empty</p>
                    ) : (
                      <>
                        {cart.map(item => (
                          <div key={item.id} className="flex items-center justify-between py-4 border-b">
                            <div>
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-sm text-stone-500">${item.price}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                -
                              </Button>
                              <span>{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeFromCart(item.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                        <div className="mt-4">
                          <div className="flex justify-between font-medium">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="w-full mt-4 bg-amber-600 hover:bg-amber-700">
                                Checkout
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Checkout</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div>
                                  <Label htmlFor="name">Name</Label>
                                  <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="address">Delivery Address</Label>
                                  <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="contact">Contact Number</Label>
                                  <Input
                                    id="contact"
                                    value={formData.contact}
                                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label>Payment Method</Label>
                                  <RadioGroup
                                    value={formData.paymentMethod}
                                    onValueChange={(value) => setFormData({...formData, paymentMethod: value})}
                                    className="mt-2"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="cod" id="cod" />
                                      <Label htmlFor="cod">Cash on Delivery</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="meetup" id="meetup" />
                                      <Label htmlFor="meetup">Meet Up</Label>
                                    </div>
                                  </RadioGroup>
                                </div>
                                <Button onClick={handleCheckout} className="mt-4 bg-amber-600 hover:bg-amber-700">
                                  Place Order
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
              
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white pt-16">
          <div className="p-4 space-y-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleNavigation(section.id)}
                className={`block w-full text-left text-stone-600 hover:text-stone-900 ${
                  activeSection === section.id ? 'font-semibold text-stone-900' : ''
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      {renderSection()}
    </div>
  );
}

export default App;