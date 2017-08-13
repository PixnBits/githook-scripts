
stage('checkout') {
  // checkout scm
  docker.image('node:argon').inside {

    stage('install') {
      sh 'npm version'
      sh 'npm install'
    }

    stage('test') {
      sh 'npm test'
    }

  }
}
