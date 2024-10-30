import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { 
  ArrowRight, 
  FileText, 
  Brain, 
  Shield, 
  Clock, 
  Users, 
  Sparkles, 
  Zap, 
  BarChart3, 
  Target,
  Rocket,
  CheckCircle,
  Puzzle,
  Lightbulb,
  Workflow,
  MessageSquare
} from 'lucide-react';

// Changed to named export to match the import in Routes.tsx
export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-8 max-w-4xl mx-auto leading-tight">
            Transform Your Clinical Trial Setup
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              with AI-Powered Intelligence
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            Streamline your study startup process with intelligent document generation,
            automated workflows, and comprehensive compliance management.
          </p>
          <Button 
            onClick={() => navigate('/study-setup')}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
          >
            Start Your Trial Setup
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Revolutionize Your Study Startup Process
          </h2>
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FileText className="h-8 w-8 text-blue-600" />}
              title="Smart Document Generation"
              description="Generate IRB materials, protocols, and CRFs with AI-powered intelligence"
            />
            <FeatureCard
              icon={<Brain className="h-8 w-8 text-indigo-600" />}
              title="AI-Powered Insights"
              description="Get intelligent suggestions and optimizations for your study design"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-green-600" />}
              title="Compliance Assured"
              description="Stay compliant with automated checks and regulatory guidance"
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8 text-purple-600" />}
              title="Rapid Setup"
              description="Reduce study startup time by up to 60% with automated workflows"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-pink-600" />}
              title="Team Collaboration"
              description="Real-time collaboration with version control and audit trails"
            />
            <FeatureCard
              icon={<Sparkles className="h-8 w-8 text-amber-600" />}
              title="Document Hub"
              description="Centralized repository for all study-related documents and materials"
            />
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="w-full py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">
            Advanced Features for Modern Clinical Trials
          </h2>
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
            <AdvancedFeatureCard
              icon={<Rocket className="h-6 w-6 text-blue-500" />}
              title="Marketing Suite"
              description="Create professional recruitment materials, brochures, and social media content"
            />
            <AdvancedFeatureCard
              icon={<Puzzle className="h-6 w-6 text-purple-500" />}
              title="Interactive Training"
              description="Generate engaging training materials with built-in assessments"
            />
            <AdvancedFeatureCard
              icon={<Workflow className="h-6 w-6 text-green-500" />}
              title="Smart Checklists"
              description="Dynamic checklists that adapt to your study's needs"
            />
            <AdvancedFeatureCard
              icon={<MessageSquare className="h-6 w-6 text-pink-500" />}
              title="Team Chat"
              description="Built-in communication tools for seamless collaboration"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
            <StatCard
              icon={<Zap className="h-6 w-6 text-yellow-500" />}
              value="60%"
              label="Faster Setup Time"
            />
            <StatCard
              icon={<BarChart3 className="h-6 w-6 text-green-500" />}
              value="40%"
              label="Cost Reduction"
            />
            <StatCard
              icon={<Target className="h-6 w-6 text-blue-500" />}
              value="90%"
              label="Compliance Rate"
            />
            <StatCard
              icon={<Users className="h-6 w-6 text-purple-500" />}
              value="500+"
              label="Active Users"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>Case Studies</li>
                <li>Documentation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>Help Center</li>
                <li>Training</li>
                <li>API Documentation</li>
                <li>Community</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Security</li>
                <li>Compliance</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
            © 2024 Talosix. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800">
      <div className="h-12 w-12 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
}

function AdvancedFeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gray-100 dark:bg-gray-800 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}

function StatCard({ icon, value, label }: { 
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
        {icon}
      </div>
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className="text-gray-600 dark:text-gray-400">{label}</div>
    </div>
  );
}