import React from 'react';
import { Link } from 'react-router-dom';
import {  Heart, Mail, MapPin, Phone } from 'lucide-react';
import { Scissors, Leaf, Clock } from 'lucide-react';
import logo from '../images/logo.jpg';

const Home = () => {
  return (
    <div className="min-h-screen bg-beige-50">
      <div className="relative h-[70vh]">
        <img
          src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=1920"
          alt="Candles Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-6xl font-serif mb-4 font-light tracking-wide">Reign Co.</h1>
            <p className="text-xl mb-8 font-light tracking-wider">Embrace the glow</p>
            <Link
              to="/shop"
              className="bg-beige-100 text-stone-800 px-8 py-3 rounded-none hover:bg-beige-200 transition-colors tracking-wider text-sm"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center p-6">
            <Scissors className="w-12 h-12 mx-auto mb-4 text-beige-700" />
            <h3 className="text-2xl font-serif mb-3 text-stone-800">Handcrafted</h3>
            <p className="text-stone-600 font-light">Each candle is carefully handcrafted with attention to detail</p>
          </div>
          <div className="text-center p-6">
            <Leaf className="w-12 h-12 mx-auto mb-4 text-beige-700" />
            <h3 className="text-2xl font-serif mb-3 text-stone-800">Natural Ingredients</h3>
            <p className="text-stone-600 font-light">Made with 100% natural soy wax and essential oils</p>
          </div>
          <div className="text-center p-6">
            <Clock className="w-12 h-12 mx-auto mb-4 text-beige-700" />
            <h3 className="text-2xl font-serif mb-3 text-stone-800">Long-lasting</h3>
            <p className="text-stone-600 font-light">Enjoy up to 50 hours of burning time</p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-beige-300 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src={logo}
                alt="About Reign Co"
                className="rounded-none shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-4xl font-serif mb-8 text-stone-800">About Reign Co.</h2>
              <p className="text-stone-600 mb-6 font-light leading-relaxed">
                At Reign Co., we believe in creating more than just candles – we craft experiences that transform your space into a sanctuary of warmth and tranquility. Our journey began with a simple passion for artisanal candle making, which has now blossomed into a dedication to bringing luxury and comfort to homes across the country.
              </p>
              <p className="text-stone-600 mb-8 font-light leading-relaxed">
                Each of our candles is handcrafted with care, using only the finest natural soy wax and premium essential oils. We take pride in our sustainable practices and commitment to creating products that are both beautiful and environmentally conscious.
              </p>
              <div className="flex items-center">
                <Heart className="w-5 h-5 text-beige-700 mr-2" />
                <span className="text-stone-700 font-light">Made with love in the Philippines</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-900 text-beige-100">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-2xl font-serif text-beige-100 mb-4">Reign Co.</h3>
              <p className="mb-4 font-light">Embrace the glow</p>
              <div className="flex items-center space-x-6">
                <a href="https://www.instagram.com/reigncoqa?igsh=eGU3Y3JybDJvcmgw&utm_source=qr" className="hover:text-beige-300 transition-colors font-light">Instagram</a>
                <a href="https://www.facebook.com/people/Reign-Co/61567747556945/" className="hover:text-beige-300 transition-colors font-light">Facebook</a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-serif text-beige-100 mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link to="/" className="hover:text-beige-300 transition-colors font-light">Home</Link></li>
                <li><Link to="/shop" className="hover:text-beige-300 transition-colors font-light">Shop</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-serif text-beige-100 mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-center font-light">
                  <MapPin className="w-5 h-5 mr-3 text-beige-400" />
                  khattab bin aal harith, nuaija qatar
                </li>
                <li className="flex items-center font-light">
                  <Phone className="w-5 h-5 mr-3 text-beige-400" />
                  +974 5531 1390
                </li>
                <li className="flex items-center font-light">
                  <Mail className="w-5 h-5 mr-3 text-beige-400" />
                  manaorthea@gmail.com
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-12 pt-8 text-center">
            <p className="font-light text-sm">&copy; {new Date().getFullYear()} Reign Co. All rights reserved.<br />Designed and maintained by Ampere </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;