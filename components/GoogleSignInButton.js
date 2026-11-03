import { useCallback, useEffect, useRef, useState } from 'react';

const GOOGLE_SCRIPT_ID = 'google-identity-services';

export default function GoogleSignInButton({ onCredential, disabled }) {
  const buttonRef = useRef(null);
  const credentialHandler = useRef(onCredential);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState('');
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const renderGoogleButton = useCallback(() => {
    const googleIdentity = window.google?.accounts?.id;
    if (!googleIdentity || !buttonRef.current || !clientId) return;

    googleIdentity.initialize({
      client_id: clientId,
      callback: (response) => credentialHandler.current(response.credential),
    });
    buttonRef.current.replaceChildren();
    googleIdentity.renderButton(buttonRef.current, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      logo_alignment: 'center',
      width: Math.min(buttonRef.current.clientWidth, 400),
    });
  }, [clientId]);

  useEffect(() => {
    credentialHandler.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    if (!clientId) return undefined;
    if (window.google?.accounts?.id) {
      setScriptLoaded(true);
      renderGoogleButton();
      return undefined;
    }

    let script = document.getElementById(GOOGLE_SCRIPT_ID);
    const handleLoad = () => {
      setScriptLoaded(true);
      renderGoogleButton();
    };
    const handleError = () => setScriptError('Google sign-in could not load. Check your connection and try again.');

    if (!script) {
      script = document.createElement('script');
      script.id = GOOGLE_SCRIPT_ID;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.addEventListener('load', handleLoad, { once: true });
      script.addEventListener('error', handleError, { once: true });
      document.head.appendChild(script);
    } else {
      script.addEventListener('load', handleLoad, { once: true });
      script.addEventListener('error', handleError, { once: true });
    }

    return () => {
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
    };
  }, [clientId, renderGoogleButton]);

  return (
    <div className="mt-4">
      {clientId ? (
        <div
          ref={buttonRef}
          aria-label="Sign in with Google"
          className={`flex min-h-11 w-full justify-center ${disabled || !scriptLoaded ? 'pointer-events-none opacity-60' : ''}`}
        />
      ) : (
        <button
          type="button"
          onClick={() => setScriptError('Google sign-in needs a Google OAuth client ID before it can be used.')}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
        >
          <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.4 1.2 8.8 3.5l6.5-6.5C35.3 2.7 30.3 0.5 24 0.5 14.8 0.5 6.9 5.8 3.1 13.5l7.6 5.9C12.5 13.2 17.7 9.5 24 9.5Z" transform="translate(0 4)" />
            <path fill="#4285F4" d="M47.5 24.5c0-1.6-.2-3.1-.5-4.5H24v9h13.2c-.6 2.9-2.2 5.3-4.6 7l7.2 5.6c4.2-3.9 6.7-9.7 6.7-17.1Z" />
            <path fill="#34A853" d="M10.7 28.6c-.6-1.4-.9-3-.9-4.6s.3-3.2.9-4.6l-7.6-5.9C1.1 17 .1 20.4.1 24s1 7 3 10.5l7.6-5.9Z" transform="translate(0 0)" />
            <path fill="#FBBC05" d="M24 47.5c6.3 0 11.6-2.1 15.4-5.8l-7.2-5.6c-2 1.3-4.6 2.1-8.2 2.1-6.3 0-11.5-3.7-13.4-9l-7.6 5.9c3.8 7.7 11.7 12.4 21 12.4Z" transform="translate(0 -3.5)" />
          </svg>
          Sign in with Google
        </button>
      )}
      {scriptError && <p role="alert" className="mt-2 text-center text-xs text-rose-700">{scriptError}</p>}
    </div>
  );
}
