# Rondeau

## Deployment

The deployment is mostly automated via GitHub Actions, but a few one-time steps are required before the workflow can run successfully.

1. Register your domain with a registrar of your choice and point its nameservers at Route 53. The hosted zone itself is created by the workflow, but registration is manual.
2. Request a certificate for the domain (i.e. dev.rondeau.dillonschwertz.dev) in ACM in us-east-1 (required by CloudFront) for your domain. Validate it via DNS by adding the CNAME record Route 53 prompts you with. Store the resulting ARN for future steps.
3. Request a certificate in ACM in _the same region as the ALB is deployed_ (currently us-west-2 Oregon for the ALB. The FQDN for this certificate should be api.domain (i.e. api.dev.rondeau.dillonschwertz.dev). Validate it via DNS by adding the CNAME record Route53 prompts you with. Store the resulting ARN for future steps.
4. Create an OIDC identity provider in AWS IAM for GitHub Actions, then create a role with a trust policy scoped to this repository. This is what allows the workflow to assume AWS credentials without storing static keys. Store the role ARN for the next step.
5. The workflow uses two environments: production (main branch) and development (dev branch). Populate both with the following variables:

| Variable | Description |
|---|---|
| `OIDC_ROLE_ARN` | Role ARN from step 3 |
| `DOMAIN_NAME` | Your registered domain |
| `DOMAIN_CERTIFICATE_ARN` | Certificate ARN from step 2 |
| `API_CERTIFICATE_ARN` | Certificate ARN from step 3 |
| `FRONTEND_ASSETS_BUCKET_NAME` | S3 bucket name for frontend assets |
| `ALLOWED_ORIGINS` | CORS allowed origins |

Push to main or dev to trigger the workflow. It will:

- Deploy auth services: Cognito
- Deploy frontend services: S3, Route 53, WAF, and CloudFront, then build and sync the frontend
