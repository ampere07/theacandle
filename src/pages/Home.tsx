import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Heart, Mail, MapPin, Phone } from 'lucide-react';
import logo from '../images/logo.jpg';

const Home = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="relative h-[70vh]">
        <img
          src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=1920"
          alt="Candles Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-serif mb-4">Reign Co.</h1>
            <p className="text-xl mb-8">Illuminate Your Space with Elegance</p>
            <Link
              to="/shop"
              className="bg-stone-800 text-white px-8 py-3 rounded-md hover:bg-stone-700 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <Flame className="w-12 h-12 mx-auto mb-4 text-stone-700" />
            <h3 className="text-xl font-medium mb-2">Handcrafted</h3>
            <p className="text-stone-600">Each candle is carefully handcrafted with attention to detail</p>
          </div>
          <div className="text-center p-6">
            <Flame className="w-12 h-12 mx-auto mb-4 text-stone-700" />
            <h3 className="text-xl font-medium mb-2">Natural Ingredients</h3>
            <p className="text-stone-600">Made with 100% natural soy wax and essential oils</p>
          </div>
          <div className="text-center p-6">
            <Flame className="w-12 h-12 mx-auto mb-4 text-stone-700" />
            <h3 className="text-xl font-medium mb-2">Long-lasting</h3>
            <p className="text-stone-600">Enjoy up to 50 hours of burning time</p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-stone-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={logo} // Use the imported image here
                alt="About Reign Co"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-serif mb-6">About Reign Co.</h2>
              <p className="text-stone-600 mb-6">
                At Reign Co., we believe in creating more than just candles – we craft experiences that transform your space into a sanctuary of warmth and tranquility. Our journey began with a simple passion for artisanal candle making, which has now blossomed into a dedication to bringing luxury and comfort to homes across the country.
              </p>
              <p className="text-stone-600 mb-6">
                Each of our candles is handcrafted with care, using only the finest natural soy wax and premium essential oils. We take pride in our sustainable practices and commitment to creating products that are both beautiful and environmentally conscious.
              </p>
              <div className="flex items-center">
                <Heart className="w-5 h-5 text-stone-700 mr-2" />
                <span className="text-stone-700">Made with love in the Philippines</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-800 text-stone-300">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-serif text-white mb-4">Reign Co.</h3>
              <p className="mb-4">Illuminate Your Space with Elegance</p>
              <div className="flex items-center space-x-4">
                <a href="#" className="hover:text-white transition-colors">Instagram</a>
                <a href="#" className="hover:text-white transition-colors">Facebook</a>
                <a href="#" className="hover:text-white transition-colors">Pinterest</a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/shop" className="hover:text-white transition-colors">Shop</Link></li>
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Contact Us</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  123 Candle Street, Metro Manila
                </li>
                <li className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  +63 123 456 7890
                </li>
                <li className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  hello@reignco.com
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-700 mt-8 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} Reign Co. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;