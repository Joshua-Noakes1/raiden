require('dotenv').config();
const {
    writeJSON
} = require('../../../bin/readWrite'),
    path = require('path');

async function writeDebug() {
    const e = process.env;
    const dockerDebug = {
        success: true,
        name: e.GITHUB_WORKFLOW,
        id: e.GITHUB_RUN_ID,
        job: e.GITHUB_JOB,
        actor: e.GITHUB_ACTOR,
        repo: e.GITHUB_REPOSITORY,
        sha: e.GITHUB_SHA,
        runnerName: e.RUNNER_NAME,
        runnerOS: e.RUNNER_OS,
        runnerArch: e.RUNNER_ARCH,
    }

    await writeJSON(path.join(__dirname, 'docker.json'), dockerDebug, true);
}

writeDebug();