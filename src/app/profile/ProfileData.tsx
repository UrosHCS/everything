import { LogInWithGoogleButton } from '@components/LogInWithGoogle';
import { LogOutButton } from '@components/LogOutButton';
import ProfileImage from '@components/profile/ProfileImage';
import { Button } from '@components/ui/button';
import { useSession } from 'next-auth/react';
import { Mail } from 'react-feather';

export function ProfileData() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading your profile</p>;
  }

  const user = session?.user;

  if (!user) {
    return (
      <section>
        <LogInWithGoogleButton />
      </section>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <ProfileImage />
        <p>{user.name}</p>
      </div>
      <div className="flex items-center gap-2">
        <Mail />
        <p>{user.email}</p>
      </div>
      <div className="flex flex-col gap-2 pt-4">
        <Button className="bg-red-600 hover:bg-red-700" onClick={deleteAccountWithConfirmation}>
          Delete account
        </Button>
        <LogOutButton />
      </div>
    </div>
  );
}

function deleteAccountWithConfirmation() {
  if (!confirm('Are you sure you want to delete your account?')) {
    return;
  }

  if (!confirm('This will delete ALL of your data and cannot be undone. Are you sure?')) {
    return;
  }

  alert('Account deletion not implemented yet with next-auth');
}
