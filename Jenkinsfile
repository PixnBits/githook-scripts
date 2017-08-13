def ourBuild = {
  stage('checkout') {
    checkout scm
  }
  
  stage('prepare') {
    sh 'git config --global user.name githook-scripts_user'
    sh 'git config --global user.email "githook-scripts_email@example.tld"'
  }

  stage('install') {
    sh 'npm version'
    sh 'npm install'
  }

  stage('test') {
    sh 'npm test'
  }
}

docker.image('node:argon').inside {
  ourBuild()
}

docker.image('node:boron').inside {
  ourBuild()
}
