# Branch Protection Setup

This document explains how to set up complete branch protection for this repository to prevent direct commits to the main branch and only allow changes through pull requests.

## What's Already Implemented

### 1. GitHub Workflow (`branch-protection.yml`)

The workflow file `.github/workflows/branch-protection.yml` has been created with the following features:

- **Blocks direct commits to main**: If someone tries to push directly to the main branch, the workflow will fail and provide a clear error message
- **Validates pull requests**: Checks that PRs have proper descriptions and follows best practices
- **Adds helpful comments**: Automatically comments on PRs targeting main to confirm they follow protection rules
- **Provides clear feedback**: Shows success/error messages for different scenarios

## Required GitHub Repository Settings

To make branch protection fully effective, you need to configure these settings in your GitHub repository:

### 1. Enable Branch Protection Rules

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Branches**
3. Click **Add rule** or **Add branch protection rule**
4. In the **Branch name pattern** field, enter: `main`
5. Configure the following settings:

#### Required Settings:

- ✅ **Require a pull request before merging**

  - Check "Require approvals" (recommend 1-2 reviewers)
  - Check "Dismiss stale PR approvals when new commits are pushed"
  - Check "Require review from code owners" (if you have a CODEOWNERS file)

- ✅ **Require status checks to pass before merging**

  - Check "Require branches to be up to date before merging"
  - Add the workflow name: `Branch Protection`

- ✅ **Require conversation resolution before merging**

  - Check "Require conversation resolution before merging"

- ✅ **Require signed commits** (optional but recommended)

  - Check "Require signed commits"

- ✅ **Require linear history** (optional)

  - Check "Require linear history"

- ✅ **Require deployments to succeed before merging** (if applicable)
  - Add any deployment environments you want to require

#### Additional Settings:

- ✅ **Restrict pushes that create files that are larger than 100 MB**
- ✅ **Require lock conversation on closed issues**
- ✅ **Require lock conversation on closed pull requests**

### 2. Configure Default Branch

Ensure your default branch is set to `main`:

1. Go to **Settings** → **General**
2. Under "Default branch", make sure it's set to `main`
3. If not, change it and confirm

### 3. Set Up Code Owners (Optional but Recommended)

Create a `.github/CODEOWNERS` file to automatically assign reviewers:

```markdown
# Global code owners

- @your-username

# Specific file/directory owners

/src/app/user/ @backend-team
/src/database/ @database-team
```

## How It Works

### For Direct Commits to Main:

1. Someone tries to push directly to main
2. The workflow runs and fails with a clear error message
3. The commit is blocked and the user is instructed to create a PR instead

### For Pull Requests:

1. Someone creates a PR targeting main or develop
2. The workflow validates the PR requirements
3. If targeting main, a helpful comment is added
4. The workflow passes, allowing the PR to proceed
5. Other required checks (reviews, status checks) must also pass before merging

## Testing the Setup

To test that branch protection is working:

1. **Test direct commit blocking:**

   ```bash
   git checkout main
   git commit --allow-empty -m "test direct commit"
   git push origin main
   ```

   This should fail with the workflow error.

2. **Test PR workflow:**
   ```bash
   git checkout -b test-branch
   git commit --allow-empty -m "test PR"
   git push origin test-branch
   ```
   Then create a PR to main - this should work and trigger the workflow.

## Integration with Existing Workflows

This branch protection workflow works alongside your existing workflows:

- **`sync-to-main.yml`**: Automatically creates PRs from develop to main
- **`commit.yml`**: Creates PRs from feature branches to develop
- **`branch-protection.yml`**: Enforces protection rules and validates PRs

## Troubleshooting

### Common Issues:

1. **Workflow not running**: Check that the workflow file is in the correct location (`.github/workflows/`)
2. **Branch protection not working**: Ensure you've configured the GitHub repository settings as described above
3. **Permission errors**: Make sure the workflow has the necessary permissions (already configured in the workflow)

### Emergency Override:

If you need to bypass branch protection in an emergency:

1. Go to the repository settings
2. Temporarily disable branch protection rules
3. Make your changes
4. Re-enable protection rules immediately

## Best Practices

1. **Always use feature branches** for new development
2. **Create PRs for all changes** to main or develop
3. **Request reviews** from team members
4. **Write clear PR descriptions** explaining what and why
5. **Keep PRs small and focused** for easier review
6. **Use conventional commit messages** for better changelog generation

## Security Benefits

This setup provides several security benefits:

- **Prevents accidental commits** to production code
- **Ensures code review** for all changes
- **Maintains audit trail** of all changes through PR history
- **Prevents force pushes** to protected branches
- **Requires status checks** to pass before merging
