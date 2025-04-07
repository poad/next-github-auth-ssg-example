import * as childProcess from 'node:child_process';
import * as fs from 'node:fs';

export const nextJsExport = ({
  clientId,
  apiUrl,
}: {
  clientId: string;
  apiUrl: string;
}) => {
  [`${process.cwd()}/../.next`, `${process.cwd()}/../out`].forEach((dir) => {
    if (fs.existsSync(dir)) {
      fs.rmdirSync(dir, {
        recursive: true,
      });
    }
  });
  ['pnpm install'].forEach((cmd) => {
    childProcess.execSync(cmd, {
      cwd: `${process.cwd()}/../`,
      stdio: ['ignore', 'inherit', 'inherit'],
      env: { ...process.env },
      shell: 'bash',
    });
  });

  ['pnpm all'].forEach((cmd) => {
    childProcess.execSync(cmd, {
      cwd: `${process.cwd()}/../`,
      stdio: ['ignore', 'inherit', 'inherit'],
      env: {
        ...process.env,
        NEXT_PUBLIC_GITHUB_CLIENT_ID: clientId,
        NEXT_PUBLIC_API_URL: apiUrl,
      },
      shell: 'bash',
    });
  });
};
