import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Layout } from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Activity, 
  Settings,
  LogOut,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Key,
  Plus,
  Copy,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { signOutAdmin, onAuthStateChange, isValidAdminEmail } from "@/lib/firebase"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const [stats, setStats] = useState<any[]>([])
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])
  const [visibleKeys, setVisibleKeys] = useState<{[key: string]: boolean}>({})
  const [isGenerating, setIsGenerating] = useState(false)

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (user && isValidAdminEmail(user.email || "")) {
        setIsAuthenticated(true)
        setUserEmail(user.email || "")
        setIsCheckingAuth(false)
      } else {
        setIsAuthenticated(false)
        setUserEmail("")
        setIsCheckingAuth(false)
        navigate("/admin/login")
      }
    })
    
    return () => unsubscribe()
  }, [navigate])

  // Fetch data from APIs
  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsResponse = await fetch('/api/admin/stats')
      const statsData = await statsResponse.json()
      setStats(statsData)

      // Fetch transactions
      const transactionsResponse = await fetch('/api/admin/transactions')
      const transactionsData = await transactionsResponse.json()
      setRecentTransactions(transactionsData)

      // Fetch API keys
      const keysResponse = await fetch('/api/admin/api-keys')
      const keysData = await keysResponse.json()
      setApiKeys(keysData)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOutAdmin()
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      })
      navigate("/admin/login")
    } catch (error: any) {
      toast({
        title: "Logout Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchDashboardData().finally(() => {
      setIsRefreshing(false)
      toast({
        title: "Dashboard Refreshed", 
        description: "All data has been updated successfully",
      })
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="status-success">Success</Badge>
      case "failed":
        return <Badge className="status-failed">Failed</Badge>
      case "pending":
        return <Badge className="status-pending">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  // API Key Management Functions
  const generateApiKey = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const newKey = {
        id: `fp_live_${Math.random().toString(36).substring(2, 18)}`,
        name: `API Key ${apiKeys.length + 1}`,
        created: new Date().toISOString().slice(0, 16).replace('T', ' '),
        lastUsed: "Never",
        status: "active",
        permissions: ["read"]
      }
      setApiKeys([...apiKeys, newKey])
      setIsGenerating(false)
      toast({
        title: "API Key Generated",
        description: "New API key has been created successfully",
      })
    }, 1500)
  }

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to Clipboard",
      description: "API key has been copied to your clipboard",
    })
  }

  const deleteApiKey = (keyId: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== keyId))
    toast({
      title: "API Key Deleted",
      description: "The API key has been permanently deleted",
      variant: "destructive"
    })
  }

  const maskApiKey = (key: string) => {
    if (visibleKeys[key]) return key
    return key.substring(0, 12) + "..." + key.substring(key.length - 4)
  }

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <Layout showHeader={false}>
        <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Checking authentication...</p>
          </div>
        </div>
      </Layout>
    )
  }

  // Redirect to login if not authenticated (handled by useEffect)
  if (!isAuthenticated) {
    return null
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex justify-between items-center"
          >
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Monitor your payment gateway transactions and analytics</p>
              <p className="text-sm text-primary mt-1">Signed in as: {userEmail}</p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="glass-card"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" className="glass-card">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" className="glass-card">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
          {stats.length > 0 ? (
            stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className="glass-card hover:scale-105 transition-smooth">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <stat.icon className="h-8 w-8 text-primary mb-2" />
                        <div className={`flex items-center text-sm ${
                          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.trend === 'up' ? 
                            <TrendingUp className="h-3 w-3 mr-1" /> : 
                            <TrendingDown className="h-3 w-3 mr-1" />
                          }
                          {stat.change}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{stat.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Analytics Data</h3>
              <p className="text-muted-foreground">
                Revenue and transaction metrics will appear here once you start processing payments
              </p>
            </div>
          )}
          </motion.div>

          {/* API Keys Management */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      API Keys Management
                      <Badge variant="secondary" className="ml-2">
                        {apiKeys.length} keys
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Generate and manage API keys for your payment gateway integration
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={generateApiKey}
                    disabled={isGenerating}
                    className="glass-card"
                  >
                    <Plus className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                    {isGenerating ? 'Generating...' : 'Generate Key'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiKeys.map((key, index) => (
                    <motion.div
                      key={key.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="glass-card p-4 border rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{key.name}</h4>
                            <Badge 
                              variant={key.status === 'active' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {key.status}
                            </Badge>
                            <div className="flex gap-1">
                              {key.permissions.map((permission: string) => (
                                <Badge key={permission} variant="outline" className="text-xs">
                                  {permission}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Created: {key.created}</span>
                            <span>Last used: {key.lastUsed}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            <code className="bg-muted px-3 py-1 rounded text-sm font-mono">
                              {maskApiKey(key.id)}
                            </code>
                            <Button
                              variant="ghost" 
                              size="sm"
                              onClick={() => toggleKeyVisibility(key.id)}
                            >
                              {visibleKeys[key.id] ? 
                                <EyeOff className="h-4 w-4" /> : 
                                <Eye className="h-4 w-4" />
                              }
                            </Button>
                            <Button
                              variant="ghost" 
                              size="sm"
                              onClick={() => copyToClipboard(key.id)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteApiKey(key.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {apiKeys.length === 0 && (
                    <div className="text-center py-12">
                      <Key className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No API Keys</h3>
                      <p className="text-muted-foreground mb-4">
                        Generate your first API key to start integrating with your payment gateway
                      </p>
                      <Button onClick={generateApiKey} disabled={isGenerating}>
                        <Plus className="h-4 w-4 mr-2" />
                        Generate Your First Key
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Transactions
                  <Badge variant="secondary" className="ml-2">
                    {recentTransactions.length} transactions
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Latest payment activities across all merchants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Merchant</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>UPI App</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                     <TableBody>
                      {recentTransactions.length > 0 ? (
                        recentTransactions.map((transaction, index) => (
                          <motion.tr
                            key={transaction.id}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                            className="hover:bg-muted/50 transition-colors"
                          >
                            <TableCell className="font-mono text-sm">
                              {transaction.id}
                            </TableCell>
                            <TableCell className="font-medium">
                              {transaction.merchant}
                            </TableCell>
                            <TableCell className="font-semibold">
                              ₹{transaction.amount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{transaction.upiApp}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(transaction.status)}
                                {getStatusBadge(transaction.status)}
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {transaction.timestamp}
                            </TableCell>
                          </motion.tr>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Transactions</h3>
                            <p className="text-muted-foreground">
                              Transaction data will appear here once payments start flowing through your gateway
                            </p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default AdminDashboard