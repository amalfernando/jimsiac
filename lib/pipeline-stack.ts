import { SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import { BuildSpec, LinuxBuildImage, PipelineProject } from 'aws-cdk-lib/aws-codebuild';
import { Artifact, Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import { CloudFormationCreateUpdateStackAction, CodeBuildAction, GitHubSourceAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { Construct } from 'constructs';
 

export class PipelineStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		const pipeline = new Pipeline(this, 'Pipeline', {
			pipelineName: 'Pipeline',
			crossAccountKeys: false
		});

		const sourceOutput = new Artifact('SourceOutput');

		pipeline.addStage({
			stageName: 'Source',
			actions: [
				new GitHubSourceAction({
					actionName: 'Pipeline_Source',
					owner: 'amalfernando',
					repo: 'jimsiac',
					branch: 'main',
					oauthToken: SecretValue.secretsManager('github-access-token'),
					output: sourceOutput
				})
			]
		});

		const cdkBuildOutput = new Artifact('CdkBuildOutput');

		pipeline.addStage({
			stageName: 'Build',
			actions: [
				new CodeBuildAction({
					actionName: 'Pipeline_Build',
					input: sourceOutput,
					outputs:[cdkBuildOutput],
					project: new PipelineProject(this, 'CdkBuildProject', {
						environment: {
							buildImage: LinuxBuildImage.STANDARD_5_0
						},
						buildSpec: BuildSpec.fromSourceFilename('build-specs/cdk-build-spec.yml')
					})
				})
			]
		});

		pipeline.addStage({
			stageName: 'Update',
			actions:[
				new CloudFormationCreateUpdateStackAction({
					actionName: 'Pipeline_Update',
					stackName: 'PipelineStack',
					templatePath: cdkBuildOutput.atPath('PipelineStack.template.json'),
					adminPermissions: true
				})
			]
		});
	}
}
