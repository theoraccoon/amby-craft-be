import { danger, warn, fail, message } from 'danger';

const CONFIG = {
  MAX_FILES: {
    WARN: 15,
    FAIL: 30,
  },
  MAX_LINES: {
    WARN: 300,
    FAIL: 500,
  },
  COMMIT: {
    HEADER_MAX_LENGTH: 72,
    TYPES: ['feat', 'fix', 'chore', 'docs', 'style', 'refactor', 'test', 'ci', 'build', 'perf', 'revert'],
    SCOPE_PATTERN: '\\w+(-\\w+)*',
  },
  PR: {
    MIN_BODY_LENGTH: 50,
    TITLE_MAX_LENGTH: 72,
  },
};

let filteredFiles;
let totalChanges;
let invalidCommits = [];

const prTitleConventionalCheck = () => {
  const conventionalTitleRegex = new RegExp(`^(${CONFIG.COMMIT.TYPES.join('|')})` + `(\\(${CONFIG.COMMIT.SCOPE_PATTERN}\\))?: .{1,${CONFIG.PR.TITLE_MAX_LENGTH}}$`);

  if (!danger.github.pr.title.match(conventionalTitleRegex)) {
    warn(`PR title must follow Conventional Commits format (max ${CONFIG.PR.TITLE_MAX_LENGTH} chars):  
    **Valid Examples**:  
    - \`feat(api): add login endpoint\`  
    - \`fix(core): resolve auth token expiration\`  
    **Allowed Types**: ${CONFIG.COMMIT.TYPES.join(', ')}`);
  }

  if (danger.github.pr.title.endsWith('.')) {
    warn('PR title should not end with punctuation');
  }
};

const commitValidation = () => {
  const conventionalCommitRegex = new RegExp(`^(${CONFIG.COMMIT.TYPES.join('|')})` + `(\\(${CONFIG.COMMIT.SCOPE_PATTERN}\\))?: .{1,${CONFIG.COMMIT.HEADER_MAX_LENGTH}}$`);

  invalidCommits = danger.git.commits
    .filter(commit => {
      const [header] = commit.message.split('\n');
      return !header.match(conventionalCommitRegex);
    })
    .map(commit => {
      const [header] = commit.message.split('\n');
      return `- \`${header}\` (${commit.sha.slice(0, 7)})`;
    });
};

const sizeValidation = () => {
  filteredFiles = danger.git.modified_files.filter(file => !['project.json', 'project-lock.json'].includes(file));

  totalChanges = danger.github.pr.additions + danger.github.pr.deletions;

  if (filteredFiles.length > CONFIG.MAX_FILES.FAIL) {
    warn(`Changed ${filteredFiles.length} files (max ${CONFIG.MAX_FILES.FAIL}). Split into smaller PRs!`);
  } else if (filteredFiles.length > CONFIG.MAX_FILES.WARN) {
    warn(`Changed ${filteredFiles.length} files (recommended < ${CONFIG.MAX_FILES.WARN}). Consider splitting.`);
  }

  if (totalChanges > CONFIG.MAX_LINES.FAIL) {
    fail(`PR too large (+${danger.github.pr.additions}/-${danger.github.pr.deletions} lines). Break it up!`);
  } else if (totalChanges > CONFIG.MAX_LINES.WARN) {
    warn(`Large PR (+${danger.github.pr.additions}/-${danger.github.pr.deletions} lines). Review carefully.`);
  }
};

const contentValidation = () => {
  if (danger.github.pr.body.length < CONFIG.PR.MIN_BODY_LENGTH) {
    warn(
      `PR description too short (min ${CONFIG.PR.MIN_BODY_LENGTH} chars). Include:\n` +
        '1. **What** changed\n2. **Why** it changed\n3. **How** it was implemented\n' +
        'Use \\\`\\\`\\\`[tasklist]\n- [ ] Checklist\\\`\\\`\\\` for complex PRs',
    );
  }

  const hasSrcChanges = danger.git.modified_files.some(file => file.startsWith('src/'));
  const hasTestChanges = danger.git.modified_files.some(file => file.match(/(test|spec)\/.*\.(ts|js)$/));

  if (hasSrcChanges && !hasTestChanges) {
    warn('Modified source files without test changes. Add tests!');
  }

  const hasDocChanges = danger.git.modified_files.some(file => file.match(/(docs\/|README|CHANGELOG)/));

  if (hasSrcChanges && !hasDocChanges) {
    warn('Behavior-changing PR without docs updates. Update README/CHANGELOG!');
  }
};

const labelValidation = () => {
  const labels = danger.github.pr.labels.map(label => label.name);

  if (!labels.some(label => label.startsWith('type:'))) {
    warn('Add a type label: `type:bug`, `type:enhancement`, etc.');
  }

  if (!labels.some(label => label.startsWith('area:'))) {
    warn('Add an area label: `area:api`, `area:ui`, etc.');
  }
};

const runChecks = () => {
  prTitleConventionalCheck();
  commitValidation();
  sizeValidation();
  contentValidation();
  labelValidation();

  // if (!danger.github.pr.body.includes('[x]')) {
  //   message('ℹ️ Consider adding a checklist using ```[tasklist]\n- [ ] Items\n```');
  // }

  if (filteredFiles.length <= CONFIG.MAX_FILES.WARN && totalChanges <= CONFIG.MAX_LINES.WARN && invalidCommits.length === 0) {
    message('✅ PR meets all quality standards!');
  }
};

runChecks();
