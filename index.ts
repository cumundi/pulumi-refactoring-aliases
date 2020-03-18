import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as gitlab from "@pulumi/gitlab";

const config = new pulumi.Config('gitlab')

const gitlabNamespace = config.getNumber('namespace')

const firstCustomer = new gitlab.Project("FirstCustomer",
    {
        name: "first-customer",
        description: "First Customer code",
        namespaceId: gitlabNamespace,
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

const secondCustomer = new gitlab.Project("SecondCustomer",
    {
        name: "second-customer",
        description: "Second Customer code",
        namespaceId: gitlabNamespace,
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

const secondCustomerProject = new gcp.organizations.Project("SecondCustomer",
    {
        projectId: 'second-customer',
        name: 'Second Customer Infrastructure'
    }
)

const serviceAccountSecondCustomer = new gcp.serviceAccount.Account("ServiceAccountSecondCustomer",
    {
        accountId: 'secondcustomer',
        displayName: 'Service Account for Second Customer project',
        project: secondCustomerProject.projectId
    }
);

const serviceAccountSecondCustomerKey = new gcp.serviceAccount.Key("ServiceAccountSecondCustomerKey",
    {
        serviceAccountId: serviceAccountSecondCustomer.email
    },
    {
        parent: serviceAccountSecondCustomer,
        aliases: [
            { parent: pulumi.rootStackResource }
        ]
    }
);

const secondCustomerGitlabCIVariable = new gitlab.ProjectVariable("SecondCustomerGCPAccess",
    {
        project: secondCustomer.id,
        variableType: 'file',
        key: "GOOGLE_APPLICATION_CREDENTIALS",
        value: serviceAccountSecondCustomerKey.privateKey.apply(value => Buffer.from(value, 'base64').toString('utf-8')),
        protected: true,
        environmentScope: "*"
    },
    {
        parent: secondCustomer,
        aliases: [
            { parent: pulumi.rootStackResource }
        ]
    }
)
