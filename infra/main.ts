import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { getResourceName, organization, stage, tags } from "./setup";

const lambdaRole = new aws.iam.Role(getResourceName("lambdaRole"), {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({ Service: "lambda.amazonaws.com" }),
  tags,
});

// Attach the AWSLambdaBasicExecutionRole
new aws.iam.RolePolicyAttachment(getResourceName("lambdaRolePolicyAttachment"), {
  role: lambdaRole,
  policyArn: aws.iam.ManagedPolicies.AWSLambdaBasicExecutionRole,
});

// Retrieve codesets stack reference, service url output
const codesetsStack = new pulumi.StackReference(`${organization}/codesets/${stage}`);
const codesetsServiceBaseUrl = codesetsStack.getOutput("url");

const lambda = new aws.lambda.Function(getResourceName("lambdaFunction"), {
  runtime: aws.lambda.Runtime.NodeJS18dX,
  role: lambdaRole.arn,
  handler: "app.handler",
  timeout: 30,
  memorySize: 1024,
  code: new pulumi.asset.AssetArchive({
    ".": new pulumi.asset.FileArchive("../dist"),
    node_modules: new pulumi.asset.FileArchive("../node_modules"),
  }),
  tags,
  environment: {
    variables: {
      CODESETS_SERVICE_BASE_URL: pulumi.interpolate`${codesetsServiceBaseUrl}`,
    },
  },
});

const functionUrl = new aws.lambda.FunctionUrl(getResourceName("lambdaFunctionUrl"), {
  functionName: lambda.name,
  authorizationType: "NONE",
});

export const url = functionUrl.functionUrl;
