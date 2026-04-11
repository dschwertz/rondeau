#!/bin/bash

set -e

LAMBDA_SRC_DIR="./cloudformation/api/lambda/src"
S3_BUCKET="${Environment}-yeschef-lambda-source-0001"

echo "Building and zipping Lambda functions..."

for func_dir in "$LAMBDA_SRC_DIR"/*/; do
  func_name=$(basename "$func_dir")
  
  echo ""
  echo "Processing: $func_name"

  cd "$func_dir"
  
  # Run npm install
  echo "  Running npm install..."
  npm install --omit=dev
  
  # Zip the contents (not the folder itself)
  echo "  Zipping..."
  zip -r "${func_name}.zip" . --exclude "*.zip"

  # Upload to S3
  echo "  Uploading to S3..."
  aws s3 cp "${func_name}.zip" "s3://${S3_BUCKET}/${func_name}.zip"
  
  rm "${func_name}.zip"

  cd -
done

echo ""
echo "All functions built and zipped."
