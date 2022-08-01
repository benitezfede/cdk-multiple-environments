import { CDKContext } from '../types';
import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class CdkMultipleEnvironmentsStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps, context: CDKContext) {
    super(scope, id, props);

    // S3 bucket
    const demoBucket = new s3.Bucket(this, 'demoBucket', {
      bucketName: `${context.appName}-${context.environment}-bucket`,
      encryption: context.s3Encrypt ? s3.BucketEncryption.S3_MANAGED: s3.BucketEncryption.UNENCRYPTED,
    });

    // DynamoDB table
    const demoTable = new dynamodb.Table(this, 'demoTable', {
      tableName: `${context.appName}-${context.environment}`,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      pointInTimeRecovery: context.ddbPITRecovery,
    });

    // Stack Outputs
    new CfnOutput(this, 'demoBucketArn', {
      value: demoBucket.bucketArn,
      exportName: `${context.appName}-demoBucketArn-${context.environment}`,
    });
    new CfnOutput(this, 'demoTableArn', {
      value: demoTable.tableArn,
      exportName: `${context.appName}-demoTableArn-${context.environment}`,
    });
  }
}
