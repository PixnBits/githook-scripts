pipeline {
  agent any
  
  stages {
    
    stage('checkout') {
      steps {
        //checkout scm
        docker.image('node:argon').inside {
          
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
    }
  }
}
