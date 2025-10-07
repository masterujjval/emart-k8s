node {
    stage("Cloning") {
        git url: "https://github.com/masterujjval/emart-k8s.git", branch: "main"
    }

    stage("Building") {
        sh '''
        docker build -t emartapp:latest .
        '''
    }

    stage("Deployment") {
        sh '''
        helm install ugchart-release ugchart
        '''
    }

    stage("Pods") {
        sh '''
        kubectl get pods
        sleep 10
        '''
    }

    stage("Testing") {
        script {
            def podStatus = sh(script: "kubectl get pods | grep emart | grep Running", returnStatus: true)
            if (podStatus == 0) {
                currentBuild.result = "SUCCESS"
            } else {
                currentBuild.result = "FAILURE"
            }
        }
    }

    stage("Approval") {
        script {
            if (env.CHANGE_ID && (currentBuild.result == "SUCCESS" || currentBuild.result == null)) {
                input message: "Everything great, wanna merge?", ok: "Merge"
            }
        }
    }

    stage("Done") {
        script {
            if (currentBuild.result == "SUCCESS" || currentBuild.result == null) {
		

                build job: "k8s cd"
                sh '''
                echo "Everything is working great!"
                '''
            } else {
                echo "Build failed — skipping downstream job."
            }
        }
    }
}
