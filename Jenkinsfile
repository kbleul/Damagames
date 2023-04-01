pipeline {
    agent any

    stages {

        stage('Set version') {
            steps {
                sh 'php ./jenkins/update-version-file.php'
            }
        }

        stage('Install SSH key') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'SSH_PRIVATE_KEY', keyFileVariable: 'SSH_PRIVATE_KEY_FILE', passphraseVariable: '', usernameVariable: 'REMOTE_USER')]) {
                    sh 'ssh-keyscan $REMOTE_HOST > ~/.ssh/known_hosts'
                    sh 'ssh-add $SSH_PRIVATE_KEY_FILE'
                }
            }
        }

        stage('Create docker context') {
            steps {
                sh 'docker context create test --docker "host=ssh://$REMOTE_USER@$REMOTE_HOST"'
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
