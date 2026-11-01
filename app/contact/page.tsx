"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1800));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormState({ name: '', email: '', subject: '', message: '' });

    setTimeout(() => setSubmitted(false), 7000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const teamMembers = [
    {
      name: 'Rishi Singh',
      role: 'Lead AI Engineer & Founder',
      email: 'rishi2004singhrs@gmail.com',
      phone: '+91 88877 28229',
      avatarGradient: 'from-pink-500 via-rose-500 to-indigo-600',
      initials: 'RS'
    },
    {
      name: 'Palak Gupta',
      role: 'Product Designer & co-Founder',
      email: 'guptapalak1432@gmail.com',
      phone: '+91 96515 92908',
      avatarGradient: 'from-violet-600 via-purple-600 to-blue-500',
      initials: 'PG'
    },
    {
      name: 'Sakshi Singh',
      role: 'Operations & Quality Analyst',
      email: 'sakshisingh34589@gmail.com',
      phone: null,
      avatarGradient: 'from-blue-600 via-indigo-600 to-teal-500',
      initials: 'SS'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } }
  } as const;

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-28 pb-20 px-6 relative overflow-hidden">
      {/* Decorative dynamic glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      
      {/* Animated Subtle Grid Lines background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800d_1px,transparent_1px),linear-gradient(to_bottom,#8080800d_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Animated Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-wider shadow-sm"
          >
            <Sparkles className="h-4 w-4 text-indigo-400 animate-spin-slow" />
            <span>Connect & Support</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: "spring" }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight"
          >
            Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">Conversation</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-neutral-400 text-base md:text-xl leading-relaxed max-w-2xl mx-auto"
          >
            Have ideas for customization, business integrations, or feedback? Reach out directly to our creators.
          </motion.p>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: Meet the Team & AI generated connectivity (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* AI Generated Scenic Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative aspect-[21/9] w-full rounded-[28px] overflow-hidden border border-white/10 shadow-2xl group cursor-pointer"
            >
              <Image 
                src="/travel_connectivity.png"
                alt="Wander AI Global Connectivity illustration"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400">AI Global Connectivity</span>
                <h3 className="text-xl font-bold text-white mt-1">Connecting travel desires to intelligent itineraries</h3>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="p-2 bg-indigo-500/10 rounded-xl"><MessageSquare className="text-indigo-400 h-6 w-6" /></span>
                Direct Team Contacts
              </h2>
              
              {/* Staggered Team Member Cards */}
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 gap-6"
              >
                {teamMembers.map((member) => (
                  <motion.div
                    key={member.name}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="p-6 rounded-[28px] bg-white/5 backdrop-blur-xl border border-white/10 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-5 items-start md:items-center relative overflow-hidden group"
                  >
                    {/* Hover border glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                    
                    {/* Animated Avatar Group */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${member.avatarGradient} flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shrink-0 group-hover:rotate-6 transition-transform duration-300`}>
                      {member.initials}
                    </div>

                    <div className="flex-1 space-y-2.5">
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          {member.name}
                        </h3>
                        <p className="text-xs text-indigo-400 font-bold tracking-wide uppercase">{member.role}</p>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-neutral-300">
                        <a href={`mailto:${member.email}`} className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors font-medium">
                          <Mail className="h-4 w-4" />
                          <span>{member.email}</span>
                        </a>
                        {member.phone && (
                          <a href={`tel:${member.phone.replace(/\s+/g, '')}`} className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors font-medium">
                            <Phone className="h-4 w-4" />
                            <span>{member.phone}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Headquarters / Address Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="p-6 rounded-[28px] bg-white/5 backdrop-blur-xl border border-white/10 shadow-md flex items-start gap-4"
            >
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-white/5 shrink-0">
                <MapPin className="h-5 w-5 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-neutral-400 uppercase tracking-wider">Office Headquarters</h4>
                <p className="text-white font-bold text-base leading-relaxed">
                  Taramandal, Gorakhpur, Uttar Pradesh, India
                </p>
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1 font-semibold">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Working Hours: 9:00 AM - 6:00 PM IST</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Contact Form (5 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="lg:col-span-5"
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-[40px] p-8 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
              {/* Outer soft glowing effect for active inputs */}
              <div className={`absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[40px] blur-lg transition-opacity duration-500 -z-10 ${
                activeField ? 'opacity-15' : 'opacity-0'
              }`} />

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center py-16 text-center space-y-5"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 120, damping: 10, delay: 0.2 }}
                      className="w-20 h-20 bg-green-500/10 text-green-400 rounded-3xl flex items-center justify-center border border-green-500/20 shadow-lg"
                    >
                      <CheckCircle2 className="h-10 w-10" />
                    </motion.div>
                    <h3 className="text-3xl font-black text-white">Message Sent!</h3>
                    <p className="text-neutral-400 max-w-xs text-sm leading-relaxed">
                      Thank you for reaching out. Rishi, Palak, or Sakshi will read your inquiry and reply back shortly.
                    </p>
                    <Button 
                      onClick={() => setSubmitted(false)}
                      className="mt-4 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-white/5 rounded-2xl px-6 py-2.5 font-bold text-sm"
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <h3 className="text-2xl font-bold text-white mb-2">Send a Message</h3>
                    <p className="text-xs text-neutral-400 -mt-4 font-semibold">We typically reply in less than 24 hours.</p>

                    <div className="space-y-5">
                      <div className="space-y-2 relative">
                        <label className={`text-xs font-bold transition-colors uppercase tracking-wider ${activeField === 'name' ? 'text-indigo-400' : 'text-neutral-400'}`}>Your Name *</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formState.name}
                          onChange={handleChange}
                          onFocus={() => setActiveField('name')}
                          onBlur={() => setActiveField(null)}
                          placeholder="Jane Doe"
                          className="w-full h-12 px-5 rounded-2xl border border-white/10 bg-white/5 text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all font-medium placeholder:text-neutral-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className={`text-xs font-bold transition-colors uppercase tracking-wider ${activeField === 'email' ? 'text-indigo-400' : 'text-neutral-400'}`}>Your Email *</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formState.email}
                          onChange={handleChange}
                          onFocus={() => setActiveField('email')}
                          onBlur={() => setActiveField(null)}
                          placeholder="jane@example.com"
                          className="w-full h-12 px-5 rounded-2xl border border-white/10 bg-white/5 text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all font-medium placeholder:text-neutral-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className={`text-xs font-bold transition-colors uppercase tracking-wider ${activeField === 'subject' ? 'text-indigo-400' : 'text-neutral-400'}`}>Subject</label>
                        <input
                          type="text"
                          name="subject"
                          value={formState.subject}
                          onChange={handleChange}
                          onFocus={() => setActiveField('subject')}
                          onBlur={() => setActiveField(null)}
                          placeholder="Feedback / Custom Travel Request"
                          className="w-full h-12 px-5 rounded-2xl border border-white/10 bg-white/5 text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all font-medium placeholder:text-neutral-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className={`text-xs font-bold transition-colors uppercase tracking-wider ${activeField === 'message' ? 'text-indigo-400' : 'text-neutral-400'}`}>How can we help? *</label>
                        <textarea
                          name="message"
                          required
                          rows={5}
                          value={formState.message}
                          onChange={handleChange}
                          onFocus={() => setActiveField('message')}
                          onBlur={() => setActiveField(null)}
                          placeholder="Tell us about your questions or comments..."
                          className="w-full p-5 rounded-2xl border border-white/10 bg-white/5 text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all font-medium placeholder:text-neutral-500 resize-none"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || !formState.name || !formState.email || !formState.message}
                      className="w-full h-14 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 group transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending message...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="h-4.5 w-4.5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                        </>
                      )}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}

export default ContactPage;
