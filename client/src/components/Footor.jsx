import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  const footerLinks = {
    platform: [
      { name: 'How It Works', href: '#' },
      { name: 'Features', href: '#' },
      { name: 'Pricing', href: '#' },
      { name: 'Success Stories', href: '#' },
    ],
    resources: [
      { name: 'Documentation', href: '#' },
      { name: 'Help Center', href: '#' },
      { name: 'Community', href: '#' },
      { name: 'Blog', href: '#' },
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Contact', href: '#' },
      { name: 'Partners', href: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'Guidelines', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
  ];

  return (
    <footer className="w-full relative overflow-hidden mt-20">
      {/* Purple Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] -z-10"></div>
      
      {/* Glassmorphic Container */}
      <div className="backdrop-blur-xl bg-neutral-900/50 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
             <Image src="/assets/logo.png" width={150} height={150} alt='logo' className='mb-4'/>
              <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                Connect, learn, and grow with our global skill exchange community. Share your expertise and discover new talents.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-neutral-400 text-sm">
                  <Mail className="w-4 h-4 text-purple-400" />
                  <span>contact@skillswap.com</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-400 text-sm">
                  <Phone className="w-4 h-4 text-purple-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-400 text-sm">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-3">
                {footerLinks.platform.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-neutral-400 text-sm hover:text-purple-400 transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-neutral-400 text-sm hover:text-purple-400 transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-neutral-400 text-sm hover:text-purple-400 transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-neutral-400 text-sm hover:text-purple-400 transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-800 my-8"></div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <p className="text-neutral-500 text-sm">
              © 2025 SkillSwap. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full backdrop-blur-md bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;