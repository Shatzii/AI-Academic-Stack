import React from 'react'
import Link from 'next/link'

interface SchoolCardProps {
  title: string
  description: string
  icon: string
  href: string
  features: string[]
  bgColor: string
  iconBg: string
}

export default function SchoolCard({ 
  title, 
  description, 
  icon, 
  href, 
  features, 
  bgColor, 
  iconBg 
}: SchoolCardProps) {
  return (
    <div className={`${bgColor} backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2`}>
      <div className="text-center mb-4">
        <div className={`w-20 h-20 mx-auto ${iconBg} rounded-full flex items-center justify-center text-3xl text-white mb-4`}>
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/80 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {features.map((feature, index) => (
            <span 
              key={index}
              className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm"
            >
              {feature}
            </span>
          ))}
        </div>
        <Link 
          href={href}
          className={`inline-block ${iconBg} text-white px-6 py-2 rounded-full hover:opacity-80 transition-opacity`}
        >
          Enter {title}
        </Link>
      </div>
    </div>
  )
}