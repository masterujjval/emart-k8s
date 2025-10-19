node("aws_slave") {
    stage("Cloning") {
checkout scm    
		build job: "sonar_checker"
		sh """
		slack "Sonar check passed. I hereby declare this code legally bug-free (until proven guilty)."
		"""
}
	

    stage("Building") {
        sh '''
		kubectl config use-context minikube
		
		eval $(minikube docker-env)
       		docker build -t hunterzoro/emartapp:latest .
	  	eval $(minikube docker-env)
	   
        
    

    
        
        eval $(minikube docker-env)
	helm uninstall ugchart-release --namespace default || echo "Release not found, skipping uninstall"
     helm upgrade --install ugchart-release ugchart --namespace default || echo "already installed" 
        '''
    }

    stage("Pods") {
        sh '''
		kubectl config use-context minikube
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
				
				

               
                sh '''
				
                echo "Everything is working great!"
				slack "Code and integration are done. If this were a movie, we’d roll credits."

				
                '''

			
            } else {
                echo "Build failed — skipping downstream job."
            }
        }
    }

}
