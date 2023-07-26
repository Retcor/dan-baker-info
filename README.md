A simple webapp frontend that interfaces with a node backend that acts as a resume in website form

## Local setup

Navigate to root direction where the package.json is located and run `npm i`. Then, run `npm run dev` to start the app using Vite.

## Deploy

Initial deploy, `kubectl apply -f <yaml-filename>` for each file in ./deploy

For changes, build the image from either the root folder where the Dockerfile is: `docker build -t gcr.io/<kubernetes-project-id>/<image-name>:<version> .`

Push the image up to Google Registry. This requires access to the kubernetes project and gcloud authorization as well as
docker config settings updated to communicate with that project: `docker push gcr.io/<kubernetes-project-id>/<image name>:<version>`

Update the deployment `image` property and then apply it to the cluster: `kubectl apply -f <deployment-yaml-filename>`