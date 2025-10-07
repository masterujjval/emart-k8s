node{
    stage("Cloning"){
        git url : "https://github.com/masterujjval/emart-k8s.git", branch: "main"
    }
    stage("Building"){
        sh '''
        docker build -t emartapp:latest .
    '''
    }
    stage("Deployment"){
        sh '''
        helm upgrade ugchart-release ugchart
        '''
    }
    stage("Pods"){
        sh '''
        kubectl get pods
        sleep 10
        '''
    }
  
    stage("done"){
        
        build job: "k8s cd"
        sh '''
        
        echo "Everything is working great!"
        '''
    }
    
    
    
}
