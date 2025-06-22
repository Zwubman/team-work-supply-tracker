import React from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Users,
  BarChart3,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Zap,
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: <Package className="w-8 h-8 text-blue-600" />,
      title: "Inventory Management",
      description:
        "Comprehensive stock tracking with real-time updates and automated alerts for low stock levels.",
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Multi-Role Access",
      description:
        "Role-based access control with Admin and Supplier permissions for secure operations.",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      title: "Analytics Dashboard",
      description:
        "Advanced analytics and reporting tools to track inventory performance and trends.",
    },
    {
      icon: <Shield className="w-8 h-8 text-red-600" />,
      title: "Secure Authentication",
      description:
        "Robust user authentication and authorization system with protected routes.",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-orange-600" />,
      title: "Movement Tracking",
      description:
        "Track inbound and outbound movements with detailed audit trails and history.",
    },
    {
      icon: <AlertTriangle className="w-8 h-8 text-yellow-600" />,
      title: "Smart Alerts",
      description:
        "Automated email notifications for low stock levels and threshold breaches.",
    },
  ];

  const stats = [
    {
      label: "Items Tracked",
      value: "1000+",
      icon: <Database className="w-6 h-6" />,
    },
    {
      label: "Real-time Updates",
      value: "24/7",
      icon: <Zap className="w-6 h-6" />,
    },
    {
      label: "Secure Access",
      value: "100%",
      icon: <Shield className="w-6 h-6" />,
    },
  ];

  const benefits = [
    {
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      text: "Prevent stockouts with automated low stock alerts",
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-500" />,
      text: "Real-time inventory tracking and updates",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-purple-500" />,
      text: "Comprehensive movement history and audit trails",
    },
    {
      icon: <Shield className="w-6 h-6 text-red-500" />,
      text: "Role-based access control for enhanced security",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Inventory Management
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                System
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your inventory operations with our comprehensive
              management solution. Track stock levels, manage movements, and get
              real-time alerts all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Sign In Now
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3 text-blue-600">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your inventory efficiently and
              effectively
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                About Our System
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our Inventory Management System is a comprehensive solution
                designed to streamline inventory operations for businesses of
                all sizes. Built with modern technologies and best practices, it
                provides real-time tracking, automated alerts, and detailed
                analytics to help you make informed decisions.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                The system supports multiple user roles including Administrators
                and Suppliers, each with specific permissions and access levels.
                With features like movement tracking, low stock alerts, and
                comprehensive reporting, you can maintain optimal inventory
                levels and prevent stockouts.
              </p>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    {benefit.icon}
                    <span className="text-gray-700">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Key Technologies</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                    <span>React.js Frontend with Redux</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                    <span>Node.js & Express Backend</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                    <span>PostgreSQL Database</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                    <span>JWT Authentication</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                    <span>Email Notifications</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses that trust our inventory management
            system
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
            >
              Sign In Now
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
