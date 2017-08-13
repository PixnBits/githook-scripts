docker.image('node:argon').inside {

  stage('checkout') {
    checkout scm
  }

  stage('install') {
    sh 'npm version'
    sh 'npm install'
  }

  stage('test') {
    sh 'npm test'
  }

}
