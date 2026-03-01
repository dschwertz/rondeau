import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  SignUpCommand,
  type ConfirmSignUpCommandInput,
  type InitiateAuthCommandInput,
  type SignUpCommandInput
} from "@aws-sdk/client-cognito-identity-provider"

export const cognitoClient = new CognitoIdentityProviderClient({
  region: import.meta.env.VITE_AWS_REGION
})

export async function signIn(username: string, password: string) {
  const params: InitiateAuthCommandInput = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password
    }
  }

  try {
    const command = new InitiateAuthCommand(params)
    const { AuthenticationResult } = await cognitoClient.send(command)

    if (AuthenticationResult) {
      sessionStorage.setItem("idToken", AuthenticationResult.IdToken || "")
      sessionStorage.setItem("accessToken", AuthenticationResult.AccessToken || "")
      sessionStorage.setItem("refreshToken", AuthenticationResult.RefreshToken || "")

      return AuthenticationResult
    }
  } catch (error) {
    console.error("Error signing in: ", error)
    throw error
  }
}

export async function signUp(email: string, password: string) {
  const params: SignUpCommandInput = {
    ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
    ],
  }
  try {
    const command = new SignUpCommand(params)
    const response = await cognitoClient.send(command)
    console.log("Sign up success: ", response)
    return response
  } catch (error) {
    console.error("Error signing up: ", error)
    throw error
  }
};

export async function confirmSignUp(username: string, code: string) {
  const params: ConfirmSignUpCommandInput = {
    ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    Username: username,
    ConfirmationCode: code,
  }
  try {
    const command = new ConfirmSignUpCommand(params)
    await cognitoClient.send(command)
    console.log("User confirmed successfully")
    return true
  } catch (error) {
    console.error("Error confirming sign up: ", error)
    throw error
  }
};
