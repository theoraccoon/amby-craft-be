const filteredModifiedFiles = danger.git.modified_files.filter(
    (file) => !['project.json', 'project-lock.json'].includes(file)
);

if (danger.github.pr.body.length < 10) {
    warn(
        'Please provide a detailed PR description. Explain the **what**, **why**, and **how**.'
    );
}

const MAX_ALLOWED_FILES = 15;
if (filteredModifiedFiles.length > MAX_ALLOWED_FILES) {
    warn(
        `This PR changes ${filteredModifiedFiles.length} files (max recommended: ${MAX_ALLOWED_FILES}). Consider splitting into smaller PRs.`
    );
}

const conventionalCommitRegex =
    /^(feat|fix|chore|docs|style|refactor|test|ci|build|perf|revert)(\(.+\))?: .+/;

if (!danger.github.pr.title.match(conventionalCommitRegex)) {
    fail(`PR title must follow **Conventional Commits**:  
    Example: \`feat(api): add login endpoint\`  
    Allowed types: feat, fix, chore, docs, style, refactor, test, ci, build, perf, revert`);
}

const invalidCommits = danger.git.commits
    .filter((commit) => !commit.message.match(conventionalCommitRegex))
    .map((commit) => `- "${commit.message}"`);

if (invalidCommits.length > 0) {
    fail(
        `Some commits don't follow Conventional Commits:\n${invalidCommits.join('\n')}`
    );
}

const hasSrcChanges = filteredModifiedFiles.some((file) =>
    file.startsWith('src/')
);
const hasTestChanges = filteredModifiedFiles.some(
    (file) => file.startsWith('test/') || file.startsWith('spec/')
);
const hasDocChanges = filteredModifiedFiles.some(
    (file) => file.startsWith('docs/') || file.includes('README')
);

if (hasSrcChanges && !hasTestChanges) {
    warn(
        'This PR modifies source code but **no tests**. Consider adding tests.'
    );
}

if (hasSrcChanges && !hasDocChanges) {
    warn(
        'This PR modifies behavior but **no docs** (README/CHANGELOG). Consider updating documentation.'
    );
}

const BIG_PR_LINES_THRESHOLD = 300;
if (
    danger.github.pr.additions + danger.github.pr.deletions >
    BIG_PR_LINES_THRESHOLD
) {
    fail(
        `This PR is too large (+${danger.github.pr.additions}, -${danger.github.pr.deletions} lines). Break it into smaller PRs.`
    );
}

const REQUIRED_LABELS = ['bug', 'enhancement', 'documentation'];
const hasRequiredLabel = danger.github.pr.labels.some((label) =>
    REQUIRED_LABELS.includes(label.name)
);

if (!hasRequiredLabel) {
    warn(`Please add one of these labels: ${REQUIRED_LABELS.join(', ')}`);
}

if (danger.github.pr.body.length > 30 && invalidCommits.length === 0) {
    message('✅ Great job! This PR follows all guidelines.');
}
