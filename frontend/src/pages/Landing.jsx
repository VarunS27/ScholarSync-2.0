import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiUpload, FiSearch, FiStar, FiUsers, FiFileText, 
  FiCheckCircle, FiTrendingUp, FiShield, FiZap, FiAward, 
  FiHeart, FiArrowRight, FiPlay, FiBook, FiTarget, FiGlobe
} from 'react-icons/fi';

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    { name: "Sarah Chen", role: "Engineering Student", text: "This platform saved my semester! Found perfect notes for every subject.", rating: 5 },
    { name: "Marcus Johnson", role: "Medical Student", text: "The quality of notes here is outstanding. Study groups are super helpful too!", rating: 5 },
    { name: "Priya Patel", role: "Business Major", text: "Best decision ever. My grades improved dramatically after joining!", rating: 5 }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Hero Section - Bento Grid Style */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size[64px_64px]" />
        
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-500/30 rounded-full filter blur-[128px] animate-pulse" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-500/30 rounded-full filter blur-[128px] animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Main Content */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center space-x-2 bg-linear-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-full mb-4 backdrop-blur-xl">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-cyan-300">15,000+ students studying smarter</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight px-4">
              <span className="block">
                Your Academic
              </span>
              <span className="block bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Success Story
              </span>
              <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-1">Starts Here</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-6 leading-relaxed px-4">
              Access <span className="text-cyan-400 font-semibold">50,000+</span> premium study notes. 
              Share knowledge. Excel together.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10 px-4">
              <Link
                to="/register"
                className="w-full sm:w-auto group relative px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-sm hover:shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 overflow-hidden text-center"
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>Start Learning Free</span>
                  <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              
              <Link
                to="/notes"
                className="w-full sm:w-auto group px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl font-semibold text-sm hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <FiPlay className="w-3 h-3 ml-0.5" />
                </div>
                <span>Browse Notes</span>
              </Link>
            </div>

            {/* Bento Grid Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-6xl mx-auto">
              {/* Large Card */}
              <Link
                to="/notes"
                className="md:col-span-2 bg-linear-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-cyan-500/30 transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3 gap-3">
                  <div className="flex-1">
                    <div className="text-xs text-cyan-400 font-semibold mb-1">TRENDING NOW</div>
                    <h3 className="text-base sm:text-lg font-bold mb-1">Data Structures & Algorithms</h3>
                    <p className="text-xs text-slate-400">Complete guide with visualizations</p>
                  </div>
                  <div className="flex items-center space-x-1 bg-red-500/20 px-2 py-1 rounded-full">
                    <FiHeart className="w-3 h-3 text-red-400 fill-current" />
                    <span className="text-xs font-semibold">1.2K</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-xs text-slate-400">
                  <div className="flex items-center space-x-1">
                    <FiUsers className="w-3 h-3" />
                    <span>234 studying</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                    <span>4.9</span>
                  </div>
                </div>
              </Link>

              {/* Stats Card */}
              <div className="bg-linear-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex flex-col justify-between hover:border-purple-500/30 transition-all">
                <div>
                  <FiTrendingUp className="w-7 h-7 text-purple-400 mb-2" />
                  <div className="text-3xl font-black mb-1">98%</div>
                  <p className="text-xs text-slate-400">Student satisfaction</p>
                </div>
              </div>

              {/* Subject Card */}
              <Link
                to="/notes"
                className="bg-linear-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-green-500/30 transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 bg-linear-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center mb-2">
                  <FiFileText className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold mb-1">Organic Chemistry</h3>
                <p className="text-slate-400 text-xs">189 notes • 4.8★</p>
              </Link>

              {/* Activity Card */}
              <div className="md:col-span-2 bg-linear-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-orange-500/30 transition-all">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-9 h-9 bg-linear-to-br from-orange-400 to-red-600 rounded-full flex items-center justify-center shrink-0">
                    <FiZap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-orange-400 font-semibold">LIVE ACTIVITY</div>
                    <div className="text-base sm:text-lg font-bold">42 notes uploaded today</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="w-6 h-6 bg-linear-to-br from-cyan-400 to-blue-600 rounded-full border-2 border-slate-900" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">+200 active contributors</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 px-4 border-y border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { num: "50K+", label: "Study Notes", icon: FiFileText },
            { num: "15K+", label: "Active Students", icon: FiUsers },
            { num: "200+", label: "Subjects Covered", icon: FiBook },
            { num: "4.9/5", label: "Average Rating", icon: FiStar }
          ].map((stat, i) => (
            <div key={i} className="text-center group cursor-pointer">
              <stat.icon className="w-5 h-5 mx-auto mb-2 text-cyan-400 group-hover:scale-110 transition-transform" />
              <div className="text-2xl sm:text-3xl font-black bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-1">
                {stat.num}
              </div>
              <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-cyan-400 font-bold mb-2 tracking-wider text-xs">FEATURES</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 px-4">
              Everything You Need to{' '}
              <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Excel
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto px-4">
              Powerful tools designed to make studying easier and more effective
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[
              { icon: FiZap, title: "Lightning Fast Search", desc: "Find any note instantly with AI-powered search", color: "from-yellow-400 to-orange-500" },
              { icon: FiShield, title: "Quality Guaranteed", desc: "Every note reviewed and rated by students", color: "from-green-400 to-emerald-500" },
              { icon: FiUpload, title: "Easy Sharing", desc: "Upload and share your notes in seconds", color: "from-blue-400 to-cyan-500" },
              { icon: FiAward, title: "Earn Rewards", desc: "Get badges and recognition for helping others", color: "from-purple-400 to-pink-500" },
              { icon: FiGlobe, title: "Global Community", desc: "Connect with students worldwide", color: "from-indigo-400 to-purple-500" },
              { icon: FiTarget, title: "Smart Recommendations", desc: "Personalized note suggestions for your courses", color: "from-red-400 to-orange-500" }
            ].map((feature, i) => (
              <div key={i} className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-cyan-500/30 transition-all cursor-pointer">
                <div className={`w-10 h-10 bg-linear-to-br ${feature.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold mb-2 group-hover:text-cyan-400 transition-colors">{feature.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-12 sm:py-16 px-4 bg-linear-to-b from-transparent via-cyan-500/5 to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-cyan-400 font-bold mb-2 tracking-wider text-xs">TESTIMONIALS</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3">
              Loved by Students{' '}
              <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Worldwide
              </span>
            </h2>
          </div>

          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 sm:p-8 min-h-[220px] flex flex-col justify-center">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className={`transition-all duration-500 ${
                  i === activeTestimonial ? 'opacity-100' : 'opacity-0 absolute inset-0 p-6 sm:p-8'
                }`}
              >
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <FiStar key={j} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-base sm:text-lg font-medium mb-5 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="font-bold text-sm">{testimonial.name}</div>
                  <div className="text-cyan-400 text-xs">{testimonial.role}</div>
                </div>
              </div>
            ))}
            
            <div className="flex items-center justify-center space-x-2 mt-5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === activeTestimonial ? 'bg-cyan-400 w-6' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-linear-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-2xl p-8 sm:p-10 text-center overflow-hidden shadow-2xl">
            {/* Animated elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full filter blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3">
                Ready to Transform Your Studies?
              </h2>
              <p className="text-sm sm:text-base mb-6 opacity-90 max-w-2xl mx-auto px-4">
                Join thousands of students who are already acing their exams with ScholarSync
              </p>
              
              <Link
                to="/register"
                className="inline-flex items-center justify-center space-x-2 px-6 sm:px-8 py-3 bg-white text-blue-600 font-bold text-sm rounded-xl hover:bg-slate-100 transition-all duration-300 shadow-2xl hover:scale-105"
              >
                <span>Start Learning for Free</span>
                <FiCheckCircle className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </Link>

              <p className="mt-4 opacity-75 text-xs px-4">
                ✨ No credit card required • ⚡ Instant access • 🎓 Forever free
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4 bg-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <div className="w-7 h-7 bg-linear-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
              <FiBook className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base text-white">ScholarSync</span>
          </div>
          <p className="mb-2 text-sm">Empowering students worldwide</p>
          <p className="text-xs">&copy; 2024 ScholarSync. Made with 💙 for students.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;