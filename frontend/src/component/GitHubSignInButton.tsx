'use client';
import * as crypto from 'node:crypto';
import { Inter } from 'next/font/google';
import { v4 as uuidv4 } from 'uuid';

const inter = Inter({ subsets: ['latin'] });

const NEXT_PUBLIC_GITHUB_CLIENT_ID = process.env
  .NEXT_PUBLIC_GITHUB_CLIENT_ID as string;

function signIn() {
  const uuid = uuidv4();
  const state = crypto.createHash('sha512').update(uuid).digest('hex');

  const params = {
    client_id: NEXT_PUBLIC_GITHUB_CLIENT_ID,
    redirect_uri: window.location.href,
    state,
    allow_signup: false,
  };
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  window.location.href = `https://github.com/login/oauth/authorize?${queryString}`;
}

export const GitHubSignInButton = () => {
  return (
    <button type="button" onClick={signIn} className={inter.className}>
      Sign in by GitHub
    </button>
  );
};

export default GitHubSignInButton;
