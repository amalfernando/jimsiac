import * as cdk from 'aws-cdk-lib';
import * as Pipeline from '../lib/pipeline-stack';
import { SynthUtils } from '@aws-cdk/assert';

test('Pipeline Stack', () => {
   const app = new cdk.App();

   const stack = new Pipeline.PipelineStack(app, 'MyTestStack');

   expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
