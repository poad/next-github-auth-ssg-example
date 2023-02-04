import qs from 'qs';
import { useCallback, useState } from 'react';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL as string;

const useGitHubOAuthAccess = () => {
  const [databaseId, setDatabaseId] = useState<number>();
  const fetcher = useCallback(async (code: string) => {
    return await fetch(NEXT_PUBLIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `code=${encodeURIComponent(code)}`,
    });
  }, []);
  const queryParams = qs.parse(window.location.search);
  if (queryParams.code) {
    const code = queryParams.code.toString();
    fetcher(code).then((response) =>
      response.json().then((json) => setDatabaseId(json.databaseId)),
    );
  }
  return databaseId;
};

export default useGitHubOAuthAccess;
