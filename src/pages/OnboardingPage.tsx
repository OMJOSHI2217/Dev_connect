import React, { useState, useRef } from 'react';
import { 
  User as UserIcon, 
  Briefcase, 
  Code, 
  MapPin, 
  Share2, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Upload,
  Globe,
  Github,
  Linkedin,
  Phone,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { SkillTag } from '../components/ui/SkillTag';
import { RoleType, ExperienceLevel, Availability, User } from '../types';

export const OnboardingPage: React.FC = () => {
  const { currentUser, updateCurrentUser, setCurrentView, addToast } = useApp();

  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states initialized with currentUser
  const [name, setName] = useState(currentUser.name || 'Alex Rivera');
  const [username, setUsername] = useState(currentUser.username || 'alexrivera_dev');
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [phone, setPhone] = useState(currentUser.phone || '+1 (415) 892-3490');
  const [role, setRole] = useState<RoleType>(currentUser.role || 'Backend Developer');
  const [specialization, setSpecialization] = useState(currentUser.specialization || 'Distributed Systems & Real-Time APIs');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(currentUser.experienceLevel || 'Senior (5-8 yrs)');
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(currentUser.yearsOfExperience || 6);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [city, setCity] = useState(currentUser.city || 'San Francisco');
  const [country, setCountry] = useState(currentUser.country || 'United States');
  const [skills, setSkills] = useState<string[]>(currentUser.skills || ['Go', 'Node.js', 'PostgreSQL', 'Docker']);
  const [skillInput, setSkillInput] = useState('');
  const [preferredCollaboratorRoles, setPreferredCollaboratorRoles] = useState<RoleType[]>(
    currentUser.preferredCollaboratorRoles || ['Frontend Developer', 'UI/UX & Product Designer']
  );
  const [availability, setAvailability] = useState<Availability>(currentUser.availability || 'Part-Time (10-15h/wk)');
  
  const [github, setGithub] = useState(currentUser.socialLinks?.github || 'https://github.com/alexrivera-dev');
  const [linkedin, setLinkedin] = useState(currentUser.socialLinks?.linkedin || '');
  const [portfolio, setPortfolio] = useState(currentUser.socialLinks?.portfolio || '');
  
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'connections-only'>(currentUser.privacy?.profileVisibility || 'public');
  const [showExactLocation, setShowExactLocation] = useState(currentUser.privacy?.showExactLocation ?? true);
  const [showPhoneToConnections, setShowPhoneToConnections] = useState(currentUser.privacy?.showPhoneToConnections ?? true);
  const [allowProjectInvites, setAllowProjectInvites] = useState(currentUser.privacy?.allowProjectInvites ?? true);

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
  ];

  const commonSkills = [
    'React', 'TypeScript', 'Node.js', 'Go', 'Python', 'Rust', 'Next.js', 
    'PostgreSQL', 'Docker', 'Kubernetes', 'Tailwind CSS', 'GraphQL', 'AWS', 
    'Figma', 'PyTorch', 'MongoDB', 'Redis', 'React Native'
  ];

  const rolesList: RoleType[] = [
    'Frontend Developer',
    'Backend Developer',
    'Fullstack Developer',
    'Mobile Developer',
    'DevOps & Cloud Engineer',
    'AI & Machine Learning Engineer',
    'UI/UX & Product Designer',
    'Systems & Security Engineer',
    'Data Engineer'
  ];

  // Handle local user file upload for picture
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast('Image size should be less than 5MB', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
          addToast('Profile picture uploaded successfully!', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const toggleCollaboratorRole = (r: RoleType) => {
    setPreferredCollaboratorRoles(prev => 
      prev.includes(r) ? prev.filter(item => item !== r) : [...prev, r]
    );
  };

  const handleFinishOnboarding = () => {
    updateCurrentUser({
      name,
      username,
      avatar,
      phone,
      role,
      specialization,
      experienceLevel,
      yearsOfExperience,
      bio,
      city,
      country,
      skills,
      preferredCollaboratorRoles,
      availability,
      socialLinks: {
        github,
        linkedin,
        portfolio
      },
      privacy: {
        profileVisibility,
        showExactLocation,
        showSocialLinksPublicly: profileVisibility === 'public',
        showPhoneToConnections,
        allowProjectInvites,
        showOnlineStatus: true
      }
    });

    addToast('Profile setup complete! Welcome to your developer dashboard.', 'success');
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Progress Header */}
        <div className="mb-10 text-center max-w-xl mx-auto">
          <Badge variant="teal" size="md">
            Step {step} of 5
          </Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
            Setup Your Developer Profile
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
            Customize your identity and preferences so the matching engine pairs you with the right engineers.
          </p>

          {/* Progress bar */}
          <div className="mt-5 w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-teal-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Main 2-Column Layout: Form on Left, Live Card Preview on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Step Pane */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            
            {/* Step 1: Basic Identity & Photo */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                    1. Identity, Photo & Contact
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">Upload your real photo and set your developer details.</p>
                </div>

                {/* Picture Upload Area */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                  <label className="block text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-200 mb-3">
                    Profile Picture
                  </label>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="relative group shrink-0">
                      <img
                        src={avatar}
                        alt="Profile Preview"
                        className="w-20 h-20 rounded-2xl object-cover ring-2 ring-teal-500 shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-slate-950/60 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Upload Photo"
                      >
                        <Camera className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap gap-2">
                        {/* Hidden file input */}
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          icon={<Upload className="w-3.5 h-3.5" />}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Upload Your Photo
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500">Supports PNG, JPG, or WEBP up to 5MB.</p>
                      
                      <div className="pt-2">
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Or choose a preset avatar:</p>
                        <div className="flex gap-2">
                          {presetAvatars.map((p, i) => (
                            <img
                              key={i}
                              src={p}
                              alt=""
                              onClick={() => setAvatar(p)}
                              className={`w-9 h-9 rounded-xl object-cover cursor-pointer transition-all ${
                                avatar === p ? 'ring-2 ring-teal-500 scale-105' : 'opacity-70 hover:opacity-100'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />

                  <Input
                    label="Username / Handle"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    helperText="Unique username across projects."
                    required
                  />
                </div>

                {/* Mobile Number Option */}
                <Input
                  label="Mobile Number (Optional)"
                  type="tel"
                  placeholder="+1 (415) 892-3490"
                  icon={<Phone className="w-4 h-4" />}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  helperText="Your phone number can optionally be shared with accepted connections."
                />
              </div>
            )}

            {/* Step 2: Role & Experience */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                    2. Role & Specialization
                  </h3>
                  <p className="text-sm text-slate-500">Define your primary engineering discipline.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300 mb-1.5">
                    Primary Developer Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as RoleType)}
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                  >
                    {rolesList.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Specialization or Core Focus"
                  placeholder="e.g. Distributed Systems & High-Throughput APIs"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300 mb-1.5">
                      Experience Tier
                    </label>
                    <select
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                    >
                      <option value="Junior (0-2 yrs)">Junior (0-2 yrs)</option>
                      <option value="Mid-Level (2-5 yrs)">Mid-Level (2-5 yrs)</option>
                      <option value="Senior (5-8 yrs)">Senior (5-8 yrs)</option>
                      <option value="Lead / Staff (8+ yrs)">Lead / Staff (8+ yrs)</option>
                    </select>
                  </div>

                  <Input
                    label="Years of Experience"
                    type="number"
                    min={0}
                    max={30}
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300 mb-1.5">
                    Availability for Collaboration
                  </label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value as Availability)}
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                  >
                    <option value="Part-Time (10-15h/wk)">Part-Time (10-15h/wk)</option>
                    <option value="Full-Time Available">Full-Time Available</option>
                    <option value="Weekends & Hackathons">Weekends & Hackathons</option>
                    <option value="Advisory & Mentorship">Advisory & Mentorship</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Skills & Tech Stack */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                    3. Skills & Technologies
                  </h3>
                  <p className="text-sm text-slate-500">Select technologies you feel confident building with.</p>
                </div>

                {/* Selected skills cloud */}
                <div>
                  <label className="block text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300 mb-2">
                    Your Selected Skills ({skills.length})
                  </label>
                  <div className="flex flex-wrap gap-2 min-h-[50px] p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                    {skills.map(s => (
                      <SkillTag key={s} name={s} onRemove={() => handleRemoveSkill(s)} size="md" />
                    ))}
                    {skills.length === 0 && (
                      <span className="text-sm text-slate-400">Click skills below or type custom ones...</span>
                    )}
                  </div>
                </div>

                {/* Custom skill adder */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type custom skill (e.g. Svelte, Kafka, WebAssembly)"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (skillInput.trim()) {
                          handleAddSkill(skillInput.trim());
                          setSkillInput('');
                        }
                      }
                    }}
                    className="flex-1 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => {
                      if (skillInput.trim()) {
                        handleAddSkill(skillInput.trim());
                        setSkillInput('');
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>

                {/* Quick Add Common Skills */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-2">Popular suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {commonSkills.map(s => {
                      const isAdded = skills.includes(s);
                      return (
                        <button
                          type="button"
                          key={s}
                          onClick={() => isAdded ? handleRemoveSkill(s) : handleAddSkill(s)}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer font-medium ${
                            isAdded
                              ? 'bg-teal-500/10 text-teal-600 dark:text-teal-300 border-teal-500/40 font-semibold'
                              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                          }`}
                        >
                          {isAdded ? `✓ ${s}` : `+ ${s}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Preferred Collaborator Roles */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300 mb-2">
                    Who do you want to collaborate with most?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {rolesList.map(r => {
                      const selected = preferredCollaboratorRoles.includes(r);
                      return (
                        <button
                          type="button"
                          key={r}
                          onClick={() => toggleCollaboratorRole(r)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer font-medium ${
                            selected
                              ? 'bg-indigo-600 text-white border-indigo-500 font-semibold'
                              : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-500'
                          }`}
                        >
                          {selected ? `✓ ${r}` : `+ ${r}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Bio, Location & Social Links */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                    4. Biography & Channels
                  </h3>
                  <p className="text-sm text-slate-500">Tell prospective collaborators what you love building.</p>
                </div>

                <Textarea
                  label="Short Biography & Project Interests"
                  placeholder="I am passionate about building high-performance web applications and distributed systems..."
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  helperText="150-300 characters is ideal."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="City"
                    placeholder="San Francisco"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <Input
                    label="Country"
                    placeholder="United States"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>

                <Input
                  label="GitHub Profile URL"
                  icon={<Github className="w-4 h-4" />}
                  placeholder="https://github.com/username"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                />

                <Input
                  label="Portfolio or Website URL"
                  icon={<Globe className="w-4 h-4" />}
                  placeholder="https://myportfolio.dev"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                />

                <Input
                  label="LinkedIn Profile URL (Optional)"
                  icon={<Linkedin className="w-4 h-4" />}
                  placeholder="https://linkedin.com/in/username"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                />
              </div>
            )}

            {/* Step 5: Privacy Controls & Finish */}
            {step === 5 && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                    5. Privacy & Permissions
                  </h3>
                  <p className="text-sm text-slate-500">Control who can discover and connect with you.</p>
                </div>

                <div className="space-y-3.5">
                  
                  {/* Profile visibility */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Profile Visibility</p>
                    <div className="flex flex-col sm:flex-row gap-3 pt-1">
                      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer font-medium">
                        <input
                          type="radio"
                          name="visibility"
                          checked={profileVisibility === 'public'}
                          onChange={() => setProfileVisibility('public')}
                          className="text-teal-600 focus:ring-teal-500"
                        />
                        <span>Public Discovery (Recommended)</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer font-medium">
                        <input
                          type="radio"
                          name="visibility"
                          checked={profileVisibility === 'connections-only'}
                          onChange={() => setProfileVisibility('connections-only')}
                          className="text-teal-600 focus:ring-teal-500"
                        />
                        <span>Connections Only (Private)</span>
                      </label>
                    </div>
                  </div>

                  {/* Location toggle */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Display Approximate Location</p>
                      <p className="text-xs text-slate-500 mt-0.5">Shows "{city}, {country}" on discovery cards.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={showExactLocation}
                      onChange={(e) => setShowExactLocation(e.target.checked)}
                      className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                    />
                  </div>

                  {/* Mobile number share toggle */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Share Mobile Number with Connections</p>
                      <p className="text-xs text-slate-500 mt-0.5">Only developers you accept connections with can see your phone.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={showPhoneToConnections}
                      onChange={(e) => setShowPhoneToConnections(e.target.checked)}
                      className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                    />
                  </div>

                  {/* Project invitations */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Allow Project Invitations</p>
                      <p className="text-xs text-slate-500 mt-0.5">Developers can invite you to open collaboration roles.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={allowProjectInvites}
                      onChange={(e) => setAllowProjectInvites(e.target.checked)}
                      className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                    />
                  </div>

                </div>

                <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-sm text-teal-900 dark:text-teal-200 leading-relaxed font-medium">
                  ✓ Your profile is configured. You can update your picture, mobile number, and settings anytime from your profile settings.
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setStep(step - 1)}
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < 5 ? (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={() => setStep(step + 1)}
                  iconRight={<ArrowRight className="w-4 h-4" />}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleFinishOnboarding}
                  icon={<Check className="w-4 h-4" />}
                >
                  Save & Go to Dashboard
                </Button>
              )}
            </div>

          </div>

          {/* Right Pane: Live Profile Card Preview */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-slate-100 dark:bg-slate-900/60 p-5 rounded-3xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4 text-xs font-semibold text-slate-500">
                <span>Live Card Preview</span>
                <span className="text-teal-500 font-bold">What other developers see</span>
              </div>

              {/* Simulated Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={avatar}
                    alt=""
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                      {name || 'Developer Name'}
                    </p>
                    <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 truncate">
                      @{username || 'handle'}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mt-1 truncate">
                      {role}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {bio || 'Short biography will appear here once entered...'}
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span>{showExactLocation ? `${city}, ${country}` : 'Remote'}</span>
                  <span>•</span>
                  <span>{experienceLevel.split(' ')[0]}</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {skills.slice(0, 4).map(s => (
                    <SkillTag key={s} name={s} size="sm" />
                  ))}
                  {skills.length > 4 && (
                    <span className="text-xs text-slate-400 font-semibold self-center">
                      +{skills.length - 4}
                    </span>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500 font-medium">
                  <span>{availability.split(' ')[0]}</span>
                  <Badge variant="teal" size="sm">
                    Verified Builder
                  </Badge>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
