pipeline {
  stages {
    // stage('checkout') {
    //   checkout scm
    // }
    
    stage('install') {
      steps {
        sh 'npm version'
        sh 'npm install'
      }
    }
    
    stage('test') {
      steps {
        sh 'npm test'
      }
    }
  }
}
