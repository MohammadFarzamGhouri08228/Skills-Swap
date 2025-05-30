import { LucideIcon } from "lucide-react"

interface NavItemProps {
  icon: LucideIcon
  label: string
  active?: boolean
}

export function NavItem({ icon: Icon, label, active = false }: NavItemProps) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${
        active 
          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20" 
          : "text-gray-600 hover:bg-gray-100/80 hover:shadow-sm"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
} 