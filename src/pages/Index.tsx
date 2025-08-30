import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Layout } from "@/components/Layout"
import { ArrowRight, Shield, Zap, TrendingUp, Users, CreditCard, Clock } from "lucide-react"
import { Link } from "react-router-dom"

const Index = () => {
  const stats = [
    { label: "Success Rate", value: "99.8%" },
    { label: "Transactions/Day", value: "50K+" },
    { label: "Processing Time", value: "<2s" },
    { label: "Uptime", value: "99.9%" }
  ]

  const features = [
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "End-to-end encryption with multi-layer security protocols"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Sub-2 second transaction processing with real-time confirmations"
    },
    {
      icon: TrendingUp,
      title: "High Success Rate",
      description: "Industry-leading 99.8% success rate for all UPI transactions"
    },
    {
      icon: Users,
      title: "Enterprise Ready",
      description: "Scalable infrastructure supporting millions of transactions"
    }
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Badge variant="secondary" className="mb-6 px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Enterprise UPI Gateway
            </Badge>
          </motion.div>
          
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            FusionPay
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Secure, fast, and reliable private UPI payment gateway for enterprises. 
            Bank-grade security with industry-leading success rates.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link to="/admin/login">
                Admin Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
              <Link to="/pay/demo-order-123">
                <CreditCard className="w-5 h-5 mr-2" />
                View Demo Payment
              </Link>
            </Button>
          </motion.div>
          
          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="glass-card p-6 text-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose <span className="bg-gradient-primary bg-clip-text text-transparent">FusionPay</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built for enterprises that demand reliability, security, and performance
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full glass-card border-0 hover:scale-105 transition-transform duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-2xl flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="glass-card p-12">
              <Clock className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join enterprises worldwide who trust FusionPay for their payment processing needs
              </p>
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link to="/admin/login">
                  Access Admin Panel
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
