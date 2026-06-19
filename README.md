# Rondeau

## Deployment

The deployment is mostly automated via GitHub Actions, but a few one-time steps are required before the workflow can run successfully.

1. Register your domain with a registrar of your choice and point its nameservers at Route 53. The hosted zone itself is created by the workflow, but registration is manual.
2. Request a certificate in ACM in us-east-1 (required by CloudFront) for your domain. Validate it via DNS by adding the CNAME record Route 53 prompts you with. Store the resulting ARN for the next step.
3. Create an OIDC identity provider in AWS IAM for GitHub Actions, then create a role with a trust policy scoped to this repository. This is what allows the workflow to assume AWS credentials without storing static keys. Store the role ARN for the next step.
4. The workflow uses two environments: production (main branch) and development (dev branch). Populate both with the following variables:

| Variable | Description |
|---|---|
| `OIDC_ROLE_ARN` | Role ARN from step 3 |
| `DOMAIN_NAME` | Your registered domain |
| `DOMAIN_CERTIFICATE_ARN` | Certificate ARN from step 2 |
| `API_STAGE_NAME` | API Gateway stage name |
| `LAMBDA_SOURCE_BUCKET_NAME` | S3 bucket name for Lambda artifacts |
| `FRONTEND_ASSETS_BUCKET_NAME` | S3 bucket name for frontend assets |
| `ALLOWED_ORIGINS` | CORS allowed origins |

Push to main or dev to trigger the workflow. It will:

- Deploy Cognito (auth)
- Deploy IAM roles, S3, API Gateway, and Lambda functions (api)
- Deploy S3, Route 53, WAF, and CloudFront, then build and sync the frontend (frontend)
