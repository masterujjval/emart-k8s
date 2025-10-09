node {
    stage("Cloning") {
checkout scm    
}

    stage("Building") {
        sh '''
		
       sudo docker build -t emartapp:latest .
	   
        '''
    }

    stage("Deployment") {
        sh '''
	sudo helm uninstall ugchart-release || echo "Release not found, skipping uninstall"
       sudo helm install ugchart-release ugchart
        '''
    }

    stage("Pods") {
        sh '''
        sudo kubectl get pods
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

				

               
                sh '''
                echo "Everything is working great!"
                '''
            } else {
                echo "Build failed — skipping downstream job."
            }
        }
    }
	stage("Post Job"){
		build job: "k8s cd"
	}
}
