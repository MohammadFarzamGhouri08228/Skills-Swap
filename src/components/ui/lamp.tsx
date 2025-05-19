import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ReactNode } from "react"

export const LampContainer = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-purple-950 w-full rounded-md z-0",
        className
      )}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: "conic-gradient(var(--purple-500) 0%, transparent 40%)",
          }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-transparent blur-2xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-transparent opacity-0 blur-2xl" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: "conic-gradient(var(--purple-500) 0%, transparent 40%)",
          }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem] overflow-visible"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-purple-500 blur-2xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-purple-500 opacity-0 blur-2xl" />
        </motion.div>
        <div className="absolute inset-0 h-full w-full bg-purple-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>
      {children}
    </div>
  )
} 