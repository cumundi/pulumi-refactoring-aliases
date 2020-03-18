Refactoring Pulumi code with `aliases`
======================================

[Pulumi](https://www.pulumi.com) is a tool to implement cloud infrastructures by use of regular programming languages. In regular programming languages, we regularly refactor our code after new features are added as to keep the design clean. Pulumi promises this too, but how can you do this?

This repository offers an example on how you can do this by leveraging the [`aliases`](https://www.pulumi.com/docs/intro/concepts/programming-model/#aliases) property.

We will prepend the description of the subsequent steps so it is directly in sight when checkout out each branch.

# Step 5 - Fix the forgotten parent-child relationships

When introducing the custom resource abstraction, we forgot to set some parent-child relationships. But it is never too late to change this. We add the missing `parent` aliases to the code and run. No changes should be reported in the output, but the relationships in the Pulumi state will be updated.

# Step 4 - Introduce a custom resource abstraction

Implement a subclass of `pulumi.ComponentResource` to create a custom abstraction. All naming has been reworked to prevent changes to the already created resources. Only the component abstractions will be created as new entries in your Pulumi state:

```sh
$ pulumi up
Previewing update (dev):
     Type                 Name                            Plan       
     pulumi:pulumi:Stack  pulumi-refactoring-aliases-dev             
 +   ├─ customer:Project  FirstCustomer                   create     
 +   └─ customer:Project  SecondCustomer                  create     
 
Resources:
    + 2 to create
    7 unchanged

Do you want to perform this update? yes
Updating (dev):
     Type                 Name                            Status      
     pulumi:pulumi:Stack  pulumi-refactoring-aliases-dev              
 +   ├─ customer:Project  SecondCustomer                  created     
 +   └─ customer:Project  FirstCustomer                   created     
 
Resources:
    + 2 created
    7 unchanged

Duration: 3s

Permalink: https://app.pulumi.com/cumundi/pulumi-refactoring-aliases/dev/updates/5
```

# Step 3 - Linking child resources to a more logical parent

Some resources can only be created with another resource as input. This can already help in setting similar parent-child relationships between Pulumi resources. Let's change a few of these relationships.

# Step 2 - Add the resources for the second customer

We add the resources for the second customer as is. The second customer has not only a Gitlab repository, but we also create a Google Cloud project for the customer and allow Gitlab CI to access that project via the linked service account.

# Step 1 - Add the resources for the first customer

For our first customer, we started of with a Gitlab repository where we store the code needed to manage that customer. If you are running this code, you can choose where this Gitlab repository is created. If you do nothing, it will be created under your user account. If you want the repositories to be created in a separate group, you have to configure the Gitlab namespace id of the group:

```sh
$ pulumi config set gitlab:namespace <value>
```

with `<value>` the group ID which is displayed in the web portal underneath the group name.

# Initialization

Let's get started. The code in this repository is written in Typescript, so it is expected to have a working NodeJS distribution on your machine.

If you are reading this on Github, first clone this repository to your machine:

```sh
$ git clone https://github.com/cumundi/pulumi-refactoring-aliases.git
```

Then go into the folder and retrieve all NodeJS dependencies:

```sh
$ cd pulumi-refactoring-aliases
$ npm install # or yarn install
```

This repository only contains the Pulumi project file. You now have to [create a stack](https://www.pulumi.com/docs/reference/cli/pulumi_stack_init/) to test this out, e.g.:

```sh
$ pulumi stack init dev
```

At this point, you should be able to run Pulumi without error:

```sh
$ pulumi up
Previewing update (dev):
     Type                 Name                            Plan       
 +   pulumi:pulumi:Stack  pulumi-refactoring-aliases-dev  create     
 
Resources:
    + 1 to create

Do you want to perform this update? yes
Updating (dev):
     Type                 Name                            Status      
 +   pulumi:pulumi:Stack  pulumi-refactoring-aliases-dev  created     
 
Resources:
    + 1 created

Duration: 2s

Permalink: https://app.pulumi.com/cumundi/pulumi-refactoring-aliases/dev/updates/1
Time: 0h:00m:09s
```

Let's add the first resources. Every of the subsequent refactoring steps are committed to separate branches in this git repository. To continue, checkout branch `step1`:

```sh
$ git checkout step1
```
