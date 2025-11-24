import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Users, Crown, User, ArrowRight, Shield, CreditCard, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const heroImage = "https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=1600";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Secure Management",
      description: "Role-based access with secure authentication"
    },
    {
      icon: CreditCard,
      title: "Online Payments",
      description: "Secure rent collection with multiple payment options"
    },
    {
      icon: MessageCircle,
      title: "Complaint System",
      description: "Streamlined communication between owners and tenants"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">PG Portal</span>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => navigate("/signup")}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-primary leading-tight mb-6">
              Modern PG Management
              <span className="text-secondary"> Made Simple</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Professional paying guest management portal for owners and tenants. 
              Streamline room management, rent collection, and tenant communication.
            </p>
            
            {/* Role Selection Cards */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <Card className="group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-2 hover:border-primary/20" 
                    onClick={() => navigate("/owner/dashboard")}>
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-primary rounded-full h-16 w-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">PG Owner</h3>
                  <p className="text-muted-foreground mb-4">Manage rooms, tenants, and collect rent</p>
                  <Button className="w-full group-hover:bg-primary-glow">
                    Owner Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-2 hover:border-secondary/20"
                    onClick={() => navigate("/tenant/dashboard")}>
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-secondary rounded-full h-16 w-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Tenant</h3>
                  <p className="text-muted-foreground mb-4">View profile, pay rent, and raise complaints</p>
                  <Button variant="outline" className="w-full border-secondary text-secondary hover:bg-secondary hover:text-white">
                    Tenant Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="Modern PG accommodation with diverse young residents in welcoming common area" 
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-hero opacity-20"></div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Why Choose PG Portal?</h2>
            <p className="text-muted-foreground text-lg">Powerful features designed for modern PG management</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="bg-primary/10 rounded-full h-20 w-20 mx-auto mb-6 flex items-center justify-center">
                    <feature.icon className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-hero rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl opacity-90 mb-8">Join hundreds of PG owners managing their properties efficiently</p>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" onClick={() => navigate("/signup")}>
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary/5 border-t py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-primary">PG Portal</span>
          </div>
          <p className="text-muted-foreground">Professional PG Management Made Simple</p>
        </div>
      </footer>
    </div>
  );
}