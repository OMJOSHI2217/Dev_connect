import React, { useState, useRef } from 'react';
import { 
  User, 
  Shield, 
  Lock, 
  MapPin, 
  Globe, 
  Github, 
  Linkedin, 
  Sun, 
  Moon, 
  Check, 
  Save,
  AtSign,
  Mail,
  Phone,
  Briefcase,
  Camera,
  Upload
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { SkillTag } from '../components/ui/SkillTag';
import { RoleType, ExperienceLevel, Availability } from '../types';

export const ProfileSettingsPage: React.FC = () => {
  const { currentUser, updateCurrentUser, theme, toggleTheme, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'privacy' | 'preferences'>('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || '+1 (415) 892-3490');
  const [role, setRole] = useState<RoleType>(currentUser.role);
  const [specialization, setSpecialization] = useState(currentUser.specialization);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(currentUser.experienceLevel);
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(currentUser.yearsOfExperience);
  const [bio, setBio] = useState(currentUser.bio);
  const [city, setCity] = useState(currentUser.city);
  const [country, setCountry] = useState(currentUser.country);
  const [availability, setAvailability] = useState<Availability>(currentUser.availability);

  // Socials
  const [github, setGithub] = useState(currentUser.socialLinks?.github || '');
  const [linkedin, setLinkedin] = useState(currentUser.socialLinks?.linkedin || '');
  const [portfolio, setPortfolio] = useState(currentUser.socialLinks?.portfolio || '');

  // Privacy states
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'connections-only'>(
    currentUser.privacy.profileVisibility
  );
  const [showExactLocation, setShowExactLocation] = useState(currentUser.privacy.showExactLocation);
  const [showSocialLinksPublicly, setShowSocialLinksPublicly] = useState(currentUser.privacy.showSocialLinksPublicly);
  const [showPhoneToConnections, setShowPhoneToConnections] = useState(currentUser.privacy.showPhoneToConnections ?? true);
  const [allowProjectInvites, setAllowProjectInvites] = useState(currentUser.privacy.allowProjectInvites);
  const [showOnlineStatus, setShowOnlineStatus] = useState(currentUser.privacy.showOnlineStatus);

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
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
          addToast('New profile photo loaded! Click Save to apply.', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      avatar,
      name,
      username,
      email,
      phone,
      role,
      specialization,
      experienceLevel,
      yearsOfExperience,
      bio,
      city,
      country,
      availability,
      socialLinks: {
        github,
        linkedin,
        portfolio
      },
      privacy: {
        profileVisibility,
        showExactLocation,
        showSocialLinksPublicly,
        showPhoneToConnections,
        allowProjectInvites,
        showOnlineStatus
      }
    });
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      {/* Header with profile banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative group shrink-0">
            <img
              src={avatar}
              alt={name}
              className="w-18 h-18 rounded-2xl object-cover ring-2 ring-teal-500 shadow-md"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-slate-950/60 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              title="Change Picture"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {currentUser.name}
            </h1>
            <p className="text-sm font-semibold text-teal-600 dark:text-teal-400">
              @{currentUser.username} • {currentUser.role}
            </p>
            {phone && (
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {phone}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={toggleTheme}
            icon={theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          >
            {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
          </Button>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Profile Information
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'privacy'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Privacy & Visibility Controls
        </button>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* TAB 1: Profile Details */}
        {activeTab === 'profile' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            {/* Picture Upload Field */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <label className="block text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-200 mb-2">
                Update Profile Picture
              </label>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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
                  Choose Picture from Computer
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Or pick preset:</span>
                  <div className="flex gap-1.5">
                    {presetAvatars.map((p, i) => (
                      <img
                        key={i}
                        src={p}
                        alt=""
                        onClick={() => setAvatar(p)}
                        className={`w-8 h-8 rounded-lg object-cover cursor-pointer transition-all ${
                          avatar === p ? 'ring-2 ring-teal-500 scale-105' : 'opacity-70 hover:opacity-100'
                        }`}
                      />
                    ))}
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
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                helperText="Only revealed to connections if permitted by your privacy settings."
                required
              />

              {/* Mobile Number Option */}
              <Input
                label="Mobile Number (Optional)"
                type="tel"
                placeholder="+1 (415) 892-3490"
                icon={<Phone className="w-4 h-4" />}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                helperText="Can be shared with verified connections."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                label="Specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Input
                label="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            <Textarea
              label="Biography & Project Interests"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Developer Social Channels
              </h4>
              <Input
                label="GitHub URL"
                icon={<Github className="w-4 h-4" />}
                value={github}
                onChange={(e) => setGithub(e.target.value)}
              />
              <Input
                label="Portfolio / Website URL"
                icon={<Globe className="w-4 h-4" />}
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
              />
              <Input
                label="LinkedIn URL"
                icon={<Linkedin className="w-4 h-4" />}
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* TAB 2: Privacy Controls */}
        {activeTab === 'privacy' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-2">
              Privacy & Access Permissions
            </h3>

            {/* Profile Visibility */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Discovery Profile Visibility
              </h4>
              <p className="text-xs text-slate-500">
                Determines whether your profile appears on the public discovery page.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-1">
                <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer font-medium">
                  <input
                    type="radio"
                    name="profileVisibility"
                    checked={profileVisibility === 'public'}
                    onChange={() => setProfileVisibility('public')}
                    className="text-teal-600 focus:ring-teal-500"
                  />
                  <span>Public Discovery (All Developers)</span>
                </label>

                <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer font-medium">
                  <input
                    type="radio"
                    name="profileVisibility"
                    checked={profileVisibility === 'connections-only'}
                    onChange={() => setProfileVisibility('connections-only')}
                    className="text-teal-600 focus:ring-teal-500"
                  />
                  <span>Connections Only (Private)</span>
                </label>
              </div>
            </div>

            {/* Location Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Show Approximate Location
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Display "{city}, {country}" on your public cards so nearby developers can find you.
                </p>
              </div>
              <input
                type="checkbox"
                checked={showExactLocation}
                onChange={(e) => setShowExactLocation(e.target.checked)}
                className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
              />
            </div>

            {/* Mobile Number Privacy Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Share Mobile Number with Accepted Connections
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  When enabled, connected partners can view your phone number for quick communication.
                </p>
              </div>
              <input
                type="checkbox"
                checked={showPhoneToConnections}
                onChange={(e) => setShowPhoneToConnections(e.target.checked)}
                className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
              />
            </div>

            {/* Social Links Visibility */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Public Social Links
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  When turned off, GitHub and LinkedIn links are only revealed after mutual connection acceptance.
                </p>
              </div>
              <input
                type="checkbox"
                checked={showSocialLinksPublicly}
                onChange={(e) => setShowSocialLinksPublicly(e.target.checked)}
                className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
              />
            </div>

            {/* Project Invites */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Allow Project Invitations
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Permit project maintainers to invite you directly to collaborate on open roles.
                </p>
              </div>
              <input
                type="checkbox"
                checked={allowProjectInvites}
                onChange={(e) => setAllowProjectInvites(e.target.checked)}
                className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
              />
            </div>

            {/* Online Status */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Show Active Online Status
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Display a green activity dot next to your avatar when you are online.
                </p>
              </div>
              <input
                type="checkbox"
                checked={showOnlineStatus}
                onChange={(e) => setShowOnlineStatus(e.target.checked)}
                className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
              />
            </div>
          </div>
        )}

        {/* Save button bar */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={<Save className="w-5 h-5" />}
          >
            Save Profile & Privacy Settings
          </Button>
        </div>

      </form>

    </div>
  );
};
