import SignupForm from './SignupForm';

export default function SignupPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      <SignupForm />
    </main>
  );
}
