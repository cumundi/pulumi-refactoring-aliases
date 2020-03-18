import * as pulumi from "@pulumi/pulumi";
import * as customer from './project';

const config = new pulumi.Config('gitlab')
const gitlabNamespace = config.getNumber('namespace')

const firstCustomer = new customer.Project("FirstCustomer",
    {
        customer: 'First Customer',
        needsGoogleInfra: false,
        gitlabNamespace: gitlabNamespace
    }
)

const secondCustomerProject = new customer.Project('SecondCustomer',
    {
        customer: 'Second Customer',
        needsGoogleInfra: true,
        gitlabNamespace: gitlabNamespace
    }
)
