import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/ThemeToggle"

interface LayoutProps {
  children: React.ReactNode
  showHeader?: boolean
}

export function Layout({ children, showHeader = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {showHeader && (
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-0 left-0 right-0 z-50 p-4"
        >
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <motion.div 
              className="glass-card px-4 py-2"
              whileHover={{ scale: 1.05 }}
            >
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                FusionPay
              </h1>
            </motion.div>
            
            <ThemeToggle />
          </div>
        </motion.header>
      )}
      
      <main className={showHeader ? "pt-20" : ""}>
        {children}
      </main>
    </div>
  )
}