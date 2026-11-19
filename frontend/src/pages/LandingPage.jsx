import React from 'react';
import {
  GraduationCap,
  ArrowRight,
  Users,
  HeartHandshake,
  Clock,
  Compass,
  UserPlus,
  MessageSquarePlus,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  MessageSquare,
  AlertCircle,
  Lock,
  ShoppingBag,
  Package,
  Home,
  Tag,
  Sparkles,
} from 'lucide-react';

/* =========================================================================
   REUSABLE SUBCOMPONENTS
   ========================================================================= */

// Reusable Service Card (Section 3)
function ServiceCard({ title, description, image, tag, icon: Icon, href = '#explore' }) {
  return (
    <a
      href={href}
      className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-[#D5D1C9] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-[#171717]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2 focus-visible:ring-offset-[#EDEBE6] cursor-pointer"
    >
      <div>
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E5E2DC]">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 transition-opacity duration-200 group-hover:opacity-40" />
          
          {tag && (
            <span className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 rounded-full bg-[#171717]/85 backdrop-blur-md px-3 py-1 text-xs font-medium text-white shadow-sm">
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {tag}
            </span>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold tracking-tight text-[#171717]">
            {title}
          </h3>
          <p className="mt-2.5 text-sm leading-relaxed text-[#555555]">
            {description}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-1 flex items-center justify-between text-sm font-semibold text-[#171717]">
        <span className="inline-flex items-center gap-1.5 transition-colors duration-200 group-hover:underline underline-offset-4">
          Explore service
        </span>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#EDEBE6] text-[#171717] transition-all duration-200 group-hover:bg-[#171717] group-hover:text-white group-hover:translate-x-1">
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </a>
  );
}

// Reusable Benefit Card (Section 4)
function BenefitCard({ icon: Icon, title, description }) {
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-white p-6 sm:p-7 border border-[#D5D1C9] transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-[#171717]/40">
      <div>
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#EDEBE6] text-[#171717] transition-all duration-200 group-hover:bg-[#171717] group-hover:text-white shadow-sm">
          <Icon className="w-6 h-6" strokeWidth={2} />
        </div>
        <h3 className="mt-5 text-lg font-bold tracking-tight text-[#171717]">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[#555555]">
          {description}
        </p>
      </div>
      <div className="mt-6 h-1 w-8 rounded-full bg-[#D5D1C9] transition-all duration-200 group-hover:w-16 group-hover:bg-[#171717]" />
    </div>
  );
}

// Reusable Step Card (Section 5)
function StepCard({ stepNumber, title, description, icon: Icon }) {
  return (
    <div className="relative flex flex-col flex-1">
      <div className="group relative z-10 flex flex-col h-full rounded-2xl bg-white p-6 border border-[#D5D1C9] transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-[#171717]/40">
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-xs font-semibold tracking-wider text-[#666666] bg-[#EDEBE6] px-2.5 py-1 rounded-md">
            STEP {stepNumber}
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EDEBE6] text-[#171717] transition-colors duration-200 group-hover:bg-[#171717] group-hover:text-white">
            <Icon className="w-5 h-5" strokeWidth={2} />
          </div>
        </div>
        <h3 className="text-lg font-bold tracking-tight text-[#171717]">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[#555555]">
          {description}
        </p>
      </div>
    </div>
  );
}

// Reusable Trust Card (Section 6)
function TrustCard({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#D5D1C9] transition-all duration-200 hover:border-[#171717]/40 hover:shadow-sm">
      <div className="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EDEBE6] text-[#171717]">
        <Icon className="w-5 h-5" strokeWidth={2} />
      </div>
      <div>
        <h3 className="text-base font-bold text-[#171717]">
          {title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-[#555555]">
          {description}
        </p>
      </div>
    </div>
  );
}

/* =========================================================================
   MAIN LANDING PAGE COMPONENT
   ========================================================================= */
export default function LandingPage() {
  const serviceCards = [
    {
      title: 'Find Companions',
      description:
        'Find students to join you for food, shopping, movies, gym, sports, study sessions, and outings.',
      image:
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
      tag: 'Social & Activities',
      icon: Users,
    },
    {
      title: 'Campus Errands',
      description:
        'Need something from outside campus? Or already going out and willing to help someone? Connect students who need items with students who can bring them.',
      image:
        'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',
      tag: 'Deliveries & Errands',
      icon: Package,
    },
    {
      title: 'Student Storage',
      description:
        'Find temporary storage options for your luggage and belongings when you need extra space.',
      image:
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      tag: 'Luggage & Space',
      icon: ShoppingBag,
    },
    {
      title: 'Rooms & Flatmates',
      description:
        'Discover rooms, accommodation options, and students looking for flatmates.',
      image:
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
      tag: 'Housing & Rooms',
      icon: Home,
    },
    {
      title: 'Student Marketplace',
      description:
        'Buy, sell, or rent pre-owned student essentials such as books, bicycles, furniture, and electronics.',
      image:
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
      tag: 'Buy, Sell & Rent',
      icon: Tag,
    },
  ];

  const benefits = [
    {
      icon: Users,
      title: 'Find Your People',
      description: 'Meet students who share your interests and plans.',
    },
    {
      icon: HeartHandshake,
      title: 'Help Each Other',
      description: 'Turn everyday needs into opportunities to help fellow students.',
    },
    {
      icon: Clock,
      title: 'Save Time & Effort',
      description: 'Find convenient solutions to common campus problems.',
    },
    {
      icon: Compass,
      title: 'One Community',
      description: 'Discover multiple student services in one platform.',
    },
  ];

  const steps = [
    {
      stepNumber: '01',
      title: 'Join the Community',
      description: 'Create your account and set up your student profile.',
      icon: UserPlus,
    },
    {
      stepNumber: '02',
      title: 'Explore Services',
      description: 'Browse activities, requests, offers, rooms, and marketplace listings.',
      icon: Compass,
    },
    {
      stepNumber: '03',
      title: 'Post or Connect',
      description: 'Create your own post or connect with another student.',
      icon: MessageSquarePlus,
    },
    {
      stepNumber: '04',
      title: 'Make It Happen',
      description: 'Communicate, coordinate, and complete your activity.',
      icon: CheckCircle2,
    },
  ];

  const trustFeatures = [
    {
      icon: Users,
      title: 'Student-focused community',
      description:
        'A dedicated network created specifically for students to collaborate and help each other.',
    },
    {
      icon: UserCheck,
      title: 'Student verification features',
      description:
        'Profile verification protocols to help confirm university and student identity.',
    },
    {
      icon: MessageSquare,
      title: 'Direct communication',
      description:
        'Clear, built-in communication channels for seamless coordination between peers.',
    },
    {
      icon: AlertCircle,
      title: 'Report and block options',
      description:
        'Quick reporting tools and responsive moderation to maintain a respectful space.',
    },
    {
      icon: Lock,
      title: 'Privacy-conscious interactions',
      description:
        'Strict data protection where your personal information remains safe and under your control.',
    },
  ];

  return (
    <div className="w-full bg-[#EDEBE6] text-[#171717] selection:bg-[#171717] selection:text-white">
      
      {/* =========================================================================
          1. HERO SECTION
         ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-32 border-b border-[#D5D1C9]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#D5D1C9] text-xs font-semibold uppercase tracking-wider text-[#171717] shadow-sm mb-6">
                <span className="flex h-2 w-2 rounded-full bg-[#171717] animate-pulse" />
                The Student Life Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#171717] leading-[1.12]">
                Your campus. <br className="hidden sm:inline" />
                Your people. <br className="hidden sm:inline" />
                <span className="text-[#171717]/85">Your community.</span>
              </h1>

              <p className="mt-6 text-base sm:text-lg lg:text-xl text-[#444444] leading-relaxed max-w-2xl font-normal">
                Connect with students, find companions, get everyday things done, and make campus life easier. Everything you need to connect and collaborate with fellow students, all in one place.
              </p>

              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
                <a
                  href="/signup"
                  className="inline-flex items-center justify-center h-12 px-7 rounded-xl text-base font-semibold text-white bg-[#171717] shadow-sm cursor-pointer transition-all duration-200 hover:bg-[#333333] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2 focus-visible:ring-offset-[#EDEBE6]"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </a>
                <a
                  href="#explore"
                  className="inline-flex items-center justify-center h-12 px-7 rounded-xl text-base font-semibold text-[#171717] bg-white border border-[#D5D1C9] shadow-sm cursor-pointer transition-all duration-200 hover:bg-[#DCD9D2] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2 focus-visible:ring-offset-[#EDEBE6]"
                >
                  Explore Services
                </a>
              </div>

              <div className="mt-10 pt-8 border-t border-[#D5D1C9]/80 flex flex-wrap items-center gap-6 sm:gap-10 text-xs sm:text-sm text-[#555555]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#171717] text-base">5,000+</span>
                  <span>Active students</span>
                </div>
                <div className="h-4 w-px bg-[#D5D1C9]" />
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#171717] text-base">5 Core</span>
                  <span>Campus services</span>
                </div>
                <div className="h-4 w-px bg-[#D5D1C9]" />
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#171717] text-base">100%</span>
                  <span>Student verified</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#E5E2DC]">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
                    alt="University students studying and enjoying campus life together"
                    className="w-full h-full object-cover object-center"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#171717] text-white flex items-center justify-center font-bold text-sm">
                          CC
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#171717]">Peer Companion Match</p>
                          <p className="text-[11px] text-[#555555]">Library study group • Block 3</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">
                        Active now
                      </span>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-4 -left-4 sm:-left-6 p-3 sm:p-3.5 rounded-2xl bg-white border border-[#D5D1C9] shadow-lg flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDEBE6] text-[#171717]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#171717]">Campus Verified</p>
                    <p className="text-[11px] text-[#666666]">Student ID checked</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          2. WHAT IS CAMPUSCONNECT? (Anchors to #about from navbar)
         ========================================================================= */}
      <section id="about" className="py-16 sm:py-24 border-b border-[#D5D1C9]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D5D1C9] text-xs font-semibold uppercase tracking-wider text-[#171717]">
                <Sparkles className="w-3.5 h-3.5 text-[#171717]" />
                Student-to-Student Platform
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#171717] leading-tight">
                What is CampusConnect?
              </h2>

              <p className="text-base sm:text-lg text-[#333333] leading-relaxed font-normal">
                CampusConnect is a student-to-student community platform designed to make everyday campus life easier. Whether you need someone to join you for an activity, need something from outside campus, want to help another student, or are looking for a room or second-hand items, CampusConnect brings students together to make it happen.
              </p>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-[#D5D1C9] shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#666666]">Model</p>
                  <p className="mt-1 text-sm font-semibold text-[#171717]">Peer-to-Peer</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-[#D5D1C9] shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#666666]">Access</p>
                  <p className="mt-1 text-sm font-semibold text-[#171717]">Zero Middlemen</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-[#D5D1C9] shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#666666]">Focus</p>
                  <p className="mt-1 text-sm font-semibold text-[#171717]">Campus Life</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl bg-white p-6 sm:p-8 border border-[#D5D1C9] shadow-md">
                <div className="flex items-center justify-between pb-5 border-b border-[#D5D1C9]/80">
                  <div className="flex items-center gap-2.5">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                    <div className="h-3 w-3 rounded-full bg-emerald-400" />
                    <span className="ml-2 text-xs font-semibold text-[#666666]">Live Community Feed</span>
                  </div>
                  <span className="text-xs font-medium text-[#171717] bg-[#EDEBE6] px-2.5 py-1 rounded-full">
                    Real-time
                  </span>
                </div>

                <div className="mt-5 space-y-3.5">
                  <div className="p-3.5 rounded-xl bg-[#EDEBE6]/60 border border-[#D5D1C9]/70 flex items-center justify-between hover:bg-[#EDEBE6] transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-[#171717] text-white flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#171717]">Join an Activity</p>
                        <p className="text-xs text-[#555555]">"Need someone for badminton doubles at 6 PM"</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#171717] bg-white px-2 py-1 rounded-md border border-[#D5D1C9]">2 joined</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#EDEBE6]/60 border border-[#D5D1C9]/70 flex items-center justify-between hover:bg-[#EDEBE6] transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-[#171717] text-white flex items-center justify-center flex-shrink-0">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#171717]">Outside Campus Help</p>
                        <p className="text-xs text-[#555555]">"Heading to town market; can pickup packages"</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-1 rounded-md">Available</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#EDEBE6]/60 border border-[#D5D1C9]/70 flex items-center justify-between hover:bg-[#EDEBE6] transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-[#171717] text-white flex items-center justify-center flex-shrink-0">
                        <Home className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#171717]">Rooms & Flatmates</p>
                        <p className="text-xs text-[#555555]">"Roommate needed for 2BHK near university"</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#171717] bg-white px-2 py-1 rounded-md border border-[#D5D1C9]">1 spot left</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#EDEBE6]/60 border border-[#D5D1C9]/70 flex items-center justify-between hover:bg-[#EDEBE6] transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-[#171717] text-white flex items-center justify-center flex-shrink-0">
                        <Tag className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#171717]">Second-Hand Marketplace</p>
                        <p className="text-xs text-[#555555]">"Calculus textbook & scientific calculator"</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#171717] bg-white px-2 py-1 rounded-md border border-[#D5D1C9]">Available</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          3. EXPLORE SERVICES (Anchors to #explore)
         ========================================================================= */}
      <section id="explore" className="py-16 sm:py-24 border-b border-[#D5D1C9]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#D5D1C9] text-xs font-semibold uppercase tracking-wider text-[#171717] mb-4">
              Explore Campus Services
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#171717]">
              Everything campus life needs, in one place.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#555555]">
              Discover services designed around real student needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {serviceCards.slice(0, 3).map((card) => (
              <ServiceCard key={card.title} {...card} />
            ))}
          </div>
          
          <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {serviceCards.slice(3, 5).map((card) => (
              <ServiceCard key={card.title} {...card} />
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          4. WHY CAMPUSCONNECT?
         ========================================================================= */}
      <section className="py-16 sm:py-24 border-b border-[#D5D1C9]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#D5D1C9] text-xs font-semibold uppercase tracking-wider text-[#171717] mb-4">
              Student Advantages
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#171717]">
              Campus life is better when we help each other.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <BenefitCard key={benefit.title} {...benefit} />
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. HOW IT WORKS (Anchors to #how-it-works)
         ========================================================================= */}
      <section id="how-it-works" className="py-16 sm:py-24 border-b border-[#D5D1C9]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#D5D1C9] text-xs font-semibold uppercase tracking-wider text-[#171717] mb-4">
              Step-by-Step Guide
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#171717]">
              Getting started is simple.
            </h2>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-[#D5D1C9] -translate-y-12 z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
              {steps.map((step) => (
                <StepCard
                  key={step.stepNumber}
                  stepNumber={step.stepNumber}
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          6. TRUST & STUDENT COMMUNITY
         ========================================================================= */}
      <section className="py-16 sm:py-24 border-b border-[#D5D1C9]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D5D1C9] text-xs font-semibold uppercase tracking-wider text-[#171717] mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-[#171717]" />
              Safe & Reliable
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#171717]">
              Built around students. Designed for trust.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#555555]">
              CampusConnect aims to create a helpful student community where people can connect with greater confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {trustFeatures.slice(0, 3).map((feature) => (
              <TrustCard key={feature.title} {...feature} />
            ))}
          </div>
          
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {trustFeatures.slice(3, 5).map((feature) => (
              <TrustCard key={feature.title} {...feature} />
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-white border border-[#D5D1C9] max-w-3xl mx-auto text-center shadow-sm">
            <p className="text-sm text-[#444444] leading-relaxed">
              <strong className="text-[#171717] font-semibold">Student Community Commitment:</strong> CampusConnect is an independent student platform built by and for campus peers to facilitate genuine collaboration, mutual respect, and safe interactions across all activities.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          7. FINAL CALL TO ACTION
         ========================================================================= */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-[#171717] text-white px-6 py-16 sm:px-12 sm:py-20 lg:py-24 text-center shadow-xl">
            
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Make your campus experience better.
              </h2>
              <p className="mt-5 text-base sm:text-lg text-white/80 leading-relaxed font-normal">
                Find your people, discover opportunities, and make everyday campus life easier with CampusConnect.
              </p>
              
              <div className="mt-8 sm:mt-10 flex justify-center">
                <a
                  href="/signup"
                  className="inline-flex items-center justify-center h-13 px-8 rounded-xl text-base font-semibold text-[#171717] bg-white cursor-pointer transition-all duration-200 hover:bg-[#DCD9D2] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717] shadow-lg"
                >
                  Join CampusConnect
                  <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          8. FOOTER
         ========================================================================= */}
      <footer className="border-t border-[#D5D1C9] bg-[#EDEBE6] pt-12 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-[#D5D1C9]/70">
            
            <div className="max-w-sm">
              <a
                href="/"
                className="group inline-flex items-center gap-2.5 text-[#171717] transition-opacity duration-200 hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2 focus-visible:ring-offset-[#EDEBE6] rounded-md cursor-pointer"
              >
                <GraduationCap className="w-7 h-7" strokeWidth={2.2} />
                <span className="text-xl font-bold tracking-tight text-[#171717]">
                  CampusConnect
                </span>
              </a>
              <p className="mt-3 text-sm text-[#555555] leading-relaxed">
                A student-to-student community platform connecting peers, enabling collaboration, and making campus life simpler.
              </p>
            </div>

            <div className="flex flex-wrap gap-8 sm:gap-12">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                  Navigation
                </h4>
                <ul className="mt-3 space-y-2 text-sm text-[#555555]">
                  <li>
                    <a
                      href="#explore"
                      className="transition-colors duration-200 hover:text-[#171717] cursor-pointer"
                    >
                      Explore
                    </a>
                  </li>
                  <li>
                    <a
                      href="#how-it-works"
                      className="transition-colors duration-200 hover:text-[#171717] cursor-pointer"
                    >
                      How it works
                    </a>
                  </li>
                  <li>
                    <a
                      href="#about"
                      className="transition-colors duration-200 hover:text-[#171717] cursor-pointer"
                    >
                      About
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                  Account
                </h4>
                <ul className="mt-3 space-y-2 text-sm text-[#555555]">
                  <li>
                    <a
                      href="/login"
                      className="transition-colors duration-200 hover:text-[#171717] cursor-pointer"
                    >
                      Log in
                    </a>
                  </li>
                  <li>
                    <a
                      href="/signup"
                      className="transition-colors duration-200 hover:text-[#171717] cursor-pointer"
                    >
                      Sign up
                    </a>
                  </li>
                </ul>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#666666] gap-4">
            <p>© 2026 CampusConnect. All rights reserved.</p>
            <p className="text-[11px] text-[#777777]">
              Built with care for students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}