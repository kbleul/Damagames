pipeline {
    agent any
    environment {
        DOCKER_HOST = "ssh://${vars.REMOTE_USER}@${vars.REMOTE_HOST}"
        REMOTE_HOST = "${{ vars.REMOTE_HOST }}"
        APP_ENV = "${{ vars.APP_ENV }}"
        APP_URL = "${{ vars.STAGE_REACT_APP_FRONTEND_URL }}"
        DB_CONNECTION = "${{ vars.DB_CONNECTION }}"
        DB_HOST = "${{ vars.DB_HOST }}"
        DB_PORT = "${{ vars.DB_PORT }}"
        DB_DATABASE = "${{ vars.DB_DATABASE }}"
        DB_USERNAME = "${{ vars.DB_USERNAME }}"
        DB_PASSWORD = "${{ secrets.DB_PASSWORD }}"
        RELEASE_VERSION = "${{ vars.RELEASE_VERSION }}"
    }
    when {
        allOf {
            tag "v[0-9]+.[0-9]+.[0-9]+"
            tag "v*-rc[0-9]+"
        }
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Set version') {
            steps {
                sh 'php ./jenkins/update-version-file.php'
            }
        }
        stage('Install SSH key') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'SSH_PRIVATE_KEY', keyFileVariable: 'SSH_PRIVATE_KEY')]) {
                    sh 'ssh-keyscan -t rsa ${REMOTE_HOST} > ~/.ssh/known_hosts'
                }
            }
        }
        stage('Create docker context') {
            steps {
                sh 'docker context create test --docker "${DOCKER_HOST}"'
            }
        }
        stage('Deploy Docker Containers') {
            steps {
                sh 'docker-compose --context test -f docker-compose.stage.yml up --build --remove-orphans -d'
            }
        }
    }
}