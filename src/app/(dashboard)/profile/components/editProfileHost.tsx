'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ProfileUser } from '@/types/profile';
import EditProfileModal, { EditProfileFormValues } from './editProfileModal';
import { ProfileSideCard } from './profileSideCard';
import { type ProfileHeaderMetric } from './profileHeader';

const STORAGE_KEY = 'lumina_profile_overrides';

interface EditProfileHostProps {
  initialUser: ProfileUser;
  overviewMetrics?: ProfileHeaderMetric[];
  unreadNotifications?: number;
  savedSearchesCount?: number;
}

function sanitizeValues(values: EditProfileFormValues) {
  return {
    firstName: values.firstName,
    lastName: values.lastName,
    phone: values.phone,
    avatarUrl: values.avatarUrl,
  };
}

function mergeUser(user: ProfileUser, overrides: Partial<EditProfileFormValues>): ProfileUser {
  const sanitized = sanitizeValues({
    firstName: overrides.firstName ?? user.firstName,
    lastName: overrides.lastName ?? user.lastName,
    phone: overrides.phone ?? (user.phone ?? ''),
    avatarUrl: overrides.avatarUrl ?? (user.avatarUrl ?? ''),
  });

  return {
    ...user,
    firstName: sanitized.firstName,
    lastName: sanitized.lastName,
    fullName: `${sanitized.firstName} ${sanitized.lastName}`.trim(),
    phone: sanitized.phone.length > 0 ? sanitized.phone : null,
    avatarUrl: sanitized.avatarUrl.length > 0 ? sanitized.avatarUrl : user.avatarUrl,
  };
}

export default function EditProfileHost({
  initialUser,
}: EditProfileHostProps) {
  const [user, setUser] = useState<ProfileUser>(initialUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as Partial<EditProfileFormValues>;
        setUser((prev) => mergeUser(prev, stored));
      }
    } catch {}
  }, []);

  useEffect(() => {
    const handler = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue) as Partial<EditProfileFormValues>;
          setUser((prev) => mergeUser(prev, parsed));
        } catch {}
      }
    };

    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  useEffect(() => {
    if (!justSaved) return;
    const timeout = window.setTimeout(() => setJustSaved(false), 2200);
    return () => window.clearTimeout(timeout);
  }, [justSaved]);

  const initialFormValues = useMemo<EditProfileFormValues>(() => ({
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone ?? '',
    avatarUrl: user.avatarUrl ?? '',
  }), [user.firstName, user.lastName, user.phone, user.avatarUrl]);

  const handleSave = (values: EditProfileFormValues) => {
    const sanitized = sanitizeValues(values);
    const updated: ProfileUser = {
      ...user,
      firstName: sanitized.firstName,
      lastName: sanitized.lastName,
      fullName: `${sanitized.firstName} ${sanitized.lastName}`.trim(),
      phone: sanitized.phone.length > 0 ? sanitized.phone : null,
      avatarUrl: sanitized.avatarUrl.length > 0 ? sanitized.avatarUrl : user.avatarUrl,
    };
    setUser(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    } catch {}
    setJustSaved(true);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Using the new Sidebar Card layout */}
      <ProfileSideCard 
        user={user} 
        onEditProfile={() => setIsModalOpen(true)} 
      />

      {justSaved && (
        <div className="absolute top-4 right-4 mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600 shadow-sm dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200 animate-fade-in">
          Saved
        </div>
      )}
      
      <EditProfileModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initial={initialFormValues}
        onSave={handleSave}
      />
    </>
  );
}
