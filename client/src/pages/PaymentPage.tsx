import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams, useNavigate } from "react-router-dom"
import { Layout } from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, ArrowLeft, Smartphone } from "lucide-react"

type PaymentStatus = "pending" | "success" | "failed"

const PaymentPage = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [selectedUpi, setSelectedUpi] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("pending")
  
  const [orderData, setOrderData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch order data from API
  const fetchOrderData = async () => {
    try {
      const response = await fetch(`/api/payment/initiate/${orderId}`)
      const data = await response.json()
      setOrderData(data)
    } catch (error) {
      console.error('Failed to fetch order data:', error)
      setOrderData({
        orderId: orderId || "ORDER_NOT_FOUND",
        amount: 0,
        merchantName: "Unknown Merchant",
        description: "Order details unavailable",
        customerEmail: "unknown@example.com"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const upiApps = [
    { 
      id: "gpay", 
      name: "Google Pay", 
      icon: "🅶", 
      bgColor: "bg-blue-600",
      installed: true 
    },
    { 
      id: "phonepe", 
      name: "PhonePe", 
      icon: "📞", 
      bgColor: "bg-purple-600",
      installed: true 
    },
    { 
      id: "paytm", 
      name: "Paytm", 
      icon: "💳", 
      bgColor: "bg-blue-500",
      installed: false 
    },
    { 
      id: "bhim", 
      name: "BHIM UPI", 
      icon: "🏛️", 
      bgColor: "bg-orange-600",
      installed: true 
    }
  ]

  const handlePayment = async () => {
    if (!selectedUpi || !orderData) return
    
    setPaymentStatus("pending")
    
    try {
      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData.orderId,
          upiApp: selectedUpi,
          amount: orderData.amount
        })
      })
      
      // Poll for payment status
      const pollStatus = async () => {
        const statusResponse = await fetch(`/api/payment/status/${orderData.orderId}`)
        const statusData = await statusResponse.json()
        setPaymentStatus(statusData.status)
      }
      
      // Poll every 2 seconds for status updates
      const pollInterval = setInterval(pollStatus, 2000)
      
      // Stop polling after 60 seconds
      setTimeout(() => clearInterval(pollInterval), 60000)
      
    } catch (error) {
      console.error('Payment failed:', error)
      setPaymentStatus("failed")
    }
  }

  const StatusIcon = () => {
    switch (paymentStatus) {
      case "success":
        return <CheckCircle className="h-16 w-16 text-green-500" />
      case "failed":
        return <XCircle className="h-16 w-16 text-red-500" />
      default:
        return <Clock className="h-16 w-16 text-yellow-500 animate-pulse" />
    }
  }

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case "success":
        return {
          title: "Payment Successful!",
          description: "Your payment has been processed successfully. You will receive a confirmation email shortly.",
          action: "Continue Shopping"
        }
      case "failed":
        return {
          title: "Payment Failed",
          description: "Something went wrong with your payment. Please try again or use a different payment method.",
          action: "Try Again"
        }
      default:
        return {
          title: "Processing Payment...",
          description: "Please complete the payment in your UPI app. Do not close this window.",
          action: null
        }
    }
  }

  // Initialize component
  useEffect(() => {
    if (orderId) {
      fetchOrderData()
    }
  }, [orderId])

  if (isLoading) {
    return (
      <Layout showHeader={false}>
        <div className="min-h-screen flex items-center justify-center p-6 gradient-hero">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!orderData) {
    return (
      <Layout showHeader={false}>
        <div className="min-h-screen flex items-center justify-center p-6 gradient-hero">
          <Card className="glass-card text-center">
            <CardContent className="pt-8 pb-6">
              <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
              <p className="text-muted-foreground mb-6">The order you're looking for could not be found.</p>
              <Button onClick={() => navigate("/")} className="gradient-primary">
                Go Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  if (paymentStatus !== "pending") {
    const status = getStatusMessage()
    return (
      <Layout showHeader={false}>
        <div className="min-h-screen flex items-center justify-center p-6 gradient-hero">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md"
          >
            <Card className="glass-card text-center">
              <CardContent className="pt-8 pb-6">
                <StatusIcon />
                <h2 className="text-2xl font-bold mt-4 mb-2">{status.title}</h2>
                <p className="text-muted-foreground mb-6">{status.description}</p>
                
                <div className="space-y-2 text-sm text-left bg-muted/50 p-4 rounded-lg mb-6">
                  <div className="flex justify-between">
                    <span>Order ID:</span>
                    <span className="font-mono">{orderData.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-semibold">₹{orderData.amount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(-1)}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    className="flex-1 gradient-primary"
                    onClick={() => paymentStatus === "failed" ? setPaymentStatus("pending") : navigate("/")}
                  >
                    {status.action}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout showHeader={false}>
      <div className="min-h-screen flex items-center justify-center p-6 gradient-hero">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-md"
        >
          <Card className="glass-card">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">Complete Your Payment</CardTitle>
              <CardDescription>
                Secure payment powered by My Payment Gateway
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Order Details */}
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Merchant:</span>
                  <span className="font-medium">{orderData.merchantName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-mono text-xs">{orderData.orderId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Description:</span>
                  <span className="font-medium">{orderData.description}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2 mt-2">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold text-primary">₹{orderData.amount.toFixed(2)}</span>
                </div>
              </div>

              {/* UPI App Selection */}
              <div>
                <h3 className="font-semibold mb-3">Choose your UPI app:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {upiApps.map((app) => (
                    <motion.div
                      key={app.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`upi-button ${selectedUpi === app.id ? 'ring-2 ring-primary glow-primary' : ''} ${!app.installed ? 'opacity-50' : ''}`}
                      onClick={() => app.installed && setSelectedUpi(app.id)}
                    >
                      <div className={`w-8 h-8 ${app.bgColor} rounded-lg flex items-center justify-center text-white font-bold text-lg`}>
                        {app.icon}
                      </div>
                      <span className="text-sm font-medium">{app.name}</span>
                      {!app.installed && (
                        <Badge variant="secondary" className="text-xs">Not Installed</Badge>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Pay Button */}
              <Button 
                className="w-full gradient-primary text-white py-3 text-lg font-semibold"
                disabled={!selectedUpi}
                onClick={handlePayment}
              >
                Pay ₹{orderData.amount.toFixed(2)}
              </Button>

              {/* Security Note */}
              <div className="text-center text-xs text-muted-foreground">
                🔒 Your payment is secured with bank-grade encryption
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  )
}

export default PaymentPage