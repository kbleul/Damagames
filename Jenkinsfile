pipeline {
    agent any

    stages {

        stage("Verify tooling") {
            steps {
                sh '''
                    docker info
                    docker version
                    docker compose version
                '''
            }
        }

        stage("Verify SSH connection to server") {
            steps {
                sshagent(credentials: ['damagames']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no root@13.40.116.143 whoami
                    '''
                }
            }
        }    

        stage("Clear all running docker containers") {
            steps {
                script {
                    try {
                        sh 'docker rm -f $(docker ps -a -q)'
                    } catch (Exception e) {
                        echo 'No running container to clear up...'
                    }
                }
            }
        }
        stage('Deploy Docker Containers') {
            steps {
                withEnv([
                    "DOCKER_HOST=ssh://$REMOTE_USER@$REMOTE_HOST",
                    "REMOTE_HOST=$REMOTE_HOST",
                    "APP_ENV=$APP_ENV",
                    "APP_URL=$STAGE_REACT_APP_FRONTEND_URL",
                    "DB_CONNECTION=$DB_CONNECTION",
                    "DB_HOST=$DB_HOST",
                    "DB_PORT=$DB_PORT",
                    "DB_DATABASE=$DB_DATABASE",
                    "DB_USERNAME=$DB_USERNAME",
                    "DB_PASSWORD=$DB_PASSWORD",
                    "RELEASE_VERSION=$RELEASE_VERSION",
                    "TELEBIRR_APP_ID=$TELEBIRR_APP_ID",
                    "TELEBIRR_APP_KEY=$TELEBIRR_APP_KEY",
                    "TELEBIRR_PUBLIC_KEY=$TELEBIRR_PUBLIC_KEY",
                    "TELEBIRR_SHORT_CODE=$TELEBIRR_SHORT_CODE",
                    "TELEBIRR_TB_APP_URL=$TELEBIRR_TB_APP_URL",
                    "TELEBIRR_TB_WEB_URL=$TELEBIRR_TB_WEB_URL",
                    "TELEBIRR_TB_SDK_URL=$TELEBIRR_TB_SDK_URL",
                    "TELEBIRR_NOTIFY_URL=$TELEBIRR_NOTIFY_URL",
                    "TELEBIRR_RETURN_URL=$TELEBIRR_RETURN_URL",
                    "TELEBIRR_SUBJECT=$TELEBIRR_SUBJECT",
                    "TELEBIRR_RECIEVE_NAME=$TELEBIRR_RECIEVE_NAME",
                    "OTP_URL=$OTP_URL",
                    "OTP_USERNAME=$OTP_USERNAME",
                    "OTP_PASSWORD=$OTP_PASSWORD",
                    "REACT_APP_FRONTEND_URL=$STAGE_REACT_APP_FRONTEND_URL",
                    "REACT_APP_BACKEND_URL=$STAGE_REACT_APP_BACKEND_URL"
                ]) {
                    sh 'docker-compose --context test -f docker-compose.stage.yml up --build --remove-orphans -d'
                }
            }
        }
    }
}
