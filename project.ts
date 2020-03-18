import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as gitlab from "@pulumi/gitlab";
import * as util from 'util';

export interface ProjectArgs {
    // The name of the customer, e.g. "First Customer"
    customer: pulumi.Input<string>;
    // Indication whether we need to create Google Cloud infrastructure for this customer
    needsGoogleInfra: boolean;
    // Namespace in Gitlab to create the repositories in.
    gitlabNamespace?: pulumi.Input<number> | undefined
}

// Pulumi custom resource representing a customer project
export class Project extends pulumi.ComponentResource {
    constructor(name: string, args: ProjectArgs, opts: pulumi.CustomResourceOptions = {}) {
        super('customer:Project', name, {}, opts);

        var customerId = name.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
        var serviceId = name.replace(/([a-zA-Z])(?=[A-Z])/g, '$1').toLowerCase();

        const gitlabProject = new gitlab.Project(name,
            {
                name: customerId,
                description: pulumi.interpolate`${args.customer} code`,
                namespaceId: args.gitlabNamespace,
                visibilityLevel: "private",
                defaultBranch: "master",
                pipelinesEnabled: true,
                issuesEnabled: false,
                wikiEnabled: false,
                snippetsEnabled: false,
                containerRegistryEnabled: false,
                mergeRequestsEnabled: false,
                mergeMethod: "ff",
                onlyAllowMergeIfPipelineSucceeds: true,
                sharedRunnersEnabled: true
            }
        )

        if (args.needsGoogleInfra) {

            const googleCloudProject = new gcp.organizations.Project(name,
                {
                    projectId: customerId,
                    name: pulumi.interpolate`${args.customer} Infrastructure`
                }
            )

            const serviceAccountGoogleCloudProject = new gcp.serviceAccount.Account(`ServiceAccount${name}`,
                {
                    accountId: serviceId,
                    displayName: pulumi.interpolate`Service Account for ${args.customer} project`,
                    project: googleCloudProject.projectId
                }
            );

            const serviceAccountGoogleCloudProjectKey = new gcp.serviceAccount.Key(`ServiceAccount${name}Key`,
                {
                    serviceAccountId: serviceAccountGoogleCloudProject.email
                },
                {
                    parent: serviceAccountGoogleCloudProject,
                    aliases: [
                        { parent: pulumi.rootStackResource }
                    ]
                }
            );

            const gitlabCIVariable = new gitlab.ProjectVariable(`${name}GCPAccess`,
                {
                    project: gitlabProject.id,
                    variableType: 'file',
                    key: "GOOGLE_APPLICATION_CREDENTIALS",
                    value: serviceAccountGoogleCloudProjectKey.privateKey.apply(value => Buffer.from(value, 'base64').toString('utf-8')),
                    protected: true,
                    environmentScope: "*"
                },
                {
                    parent: gitlabProject,
                    aliases: [
                        { parent: pulumi.rootStackResource }
                    ]
                }
            )
        }

    }
}