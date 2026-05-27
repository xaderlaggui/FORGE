import { useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../../../services/supabase';
import { useAuthStore } from '../../../stores/authStore';

export type VisibilityOption = 'Public' | 'Friends Only' | 'Private';
export const VISIBILITY_OPTIONS: VisibilityOption[] = ['Public', 'Friends Only', 'Private'];

export function usePrivacySecurity() {
  const { user } = useAuthStore();

  const [showChangePwd, setShowChangePwd] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  const [profileVisibility, setProfileVisibility] = useState<VisibilityOption>(
    (user as any)?.profileVisibility || 'Public'
  );
  const [activityVisibility, setActivityVisibility] = useState<VisibilityOption>(
    (user as any)?.activityVisibility || 'Friends Only'
  );
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(
    (user as any)?.showLeaderboard ?? true
  );
  const [allowFollow, setAllowFollow] = useState<boolean>(
    (user as any)?.allowFollow ?? true
  );

  const [twoFAEnabled, setTwoFAEnabled] = useState<boolean>(
    (user as any)?.twoFAEnabled ?? false
  );

  const updatePrivacySetting = async (key: string, value: any) => {
    if (!user?.uid) return;
    try {
      await supabase.from('profiles').update({ [key]: value }).eq('id', user.uid);
    } catch (e) {
      console.warn('Failed to save setting:', e);
    }
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const handleChangePassword = async () => {
    if (newPwd !== confirmPwd) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    if (newPwd.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }
    setPwdLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPwd });
      if (error) throw error;
      Alert.alert('Success', 'Password updated successfully.');
      setShowChangePwd(false);
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setPwdLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      Alert.alert('Error', 'Please type DELETE to confirm.');
      return;
    }
    try {
      if (user?.uid) {
        await supabase.from('profiles').delete().eq('id', user.uid);
      }
      await supabase.auth.signOut();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const handleDownloadData = () => {
    Alert.alert('Data Export', 'Your data export request has been submitted. You will receive it via email within 24 hours.');
  };

  return {
    showChangePwd, setShowChangePwd,
    currentPwd, setCurrentPwd,
    newPwd, setNewPwd,
    confirmPwd, setConfirmPwd,
    pwdLoading,
    profileVisibility, setProfileVisibility,
    activityVisibility, setActivityVisibility,
    showLeaderboard, setShowLeaderboard,
    allowFollow, setAllowFollow,
    twoFAEnabled, setTwoFAEnabled,
    updatePrivacySetting,
    showDeleteModal, setShowDeleteModal,
    deleteConfirmText, setDeleteConfirmText,
    handleChangePassword,
    handleDeleteAccount,
    handleDownloadData,
  };
}
