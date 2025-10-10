node {
    stage("Cloning") {
checkout scm    
}

    stage("Building") {
        sh '''
		
       # sudo docker build -t emartapp:latest .
	   sudo minikube image build -t emartapp:latest .
	   
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
				gh pr merge $CHANGE_ID --merge --repo masterujjval/emart-k8s
                echo "Everything is working great!"

				
                '''

					stage("Post Job"){
		build job: "sonar_checker"
		build job: "k8s cd"
	}
            } else {
                echo "Build failed — skipping downstream job."
            }
        }
    }

}
