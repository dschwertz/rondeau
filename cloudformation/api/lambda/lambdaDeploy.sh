aws cloudformation deploy \
  --stack-name api-lambda \
  --template-file ./cloudformation/api/lambda/lambda.yaml \
  --parameter-overrides $(cat ./cloudformation/api/lambda/lambdaParameters)
