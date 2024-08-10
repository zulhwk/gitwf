import {execSync} from "child_process";

export function checkGitRepository(): void {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
  } catch {
    console.error('Error: This is not a Git repository.');
    process.exit(1);
  }
}

export function checkBranchUpToDate(targetBranch: string): void {
  try {
    execSync(`git fetch origin ${targetBranch}`, { stdio: 'ignore' });

    const localCommit = execSync('git rev-parse @').toString().trim();
    const remoteCommit = execSync(`git rev-parse origin/${targetBranch}`).toString().trim();
    const baseCommit = execSync(`git merge-base @ origin/${targetBranch}`).toString().trim();

    if (localCommit === remoteCommit) {
      console.log(`Your branch is up-to-date with the ${targetBranch} branch.`);
    } else if (localCommit === baseCommit) {
      console.error(`Your branch is behind the ${targetBranch} branch. Please pull the latest changes first.`);
      process.exit(1);
    } else {
      console.error(`Your branch has diverged from the ${targetBranch} branch.`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`Error during branch comparison: ${err}`);
    process.exit(1);
  }
}

export function getSourceBranch(): string | null {
  try {
    const currentBranch = execSync('git branch --show-current').toString().trim();
    const branches = execSync(`git show-branch --list --remote`).toString().trim();

    const sourceBranch = branches.split('\n').find(branch => {
      return branch.includes(currentBranch) && branch !== currentBranch;
    });

    if (sourceBranch) {
      return sourceBranch.replace(/^\*?\s*/, '').split(' ')[0].replace('origin/', '');
    } else {
      console.error('Error: Cannot determine source branch.');
      return null;
    }
  } catch (err) {
    console.error(`Error detecting source branch: ${err}`);
    return null;
  }
}