import { checkBranchUpToDate, checkGitRepository, getSourceBranch } from "../../utils/git"

export default () => {
  checkGitRepository();

  const sourceBranch = getSourceBranch();

  if (sourceBranch) {
    checkBranchUpToDate(sourceBranch);
  } else {
    console.error('Could not determine the source branch. Please check your branch structure.');
    process.exit(1);
  }
}