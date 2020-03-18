Refactoring Pulumi code with `aliases`
======================================

[Pulumi](https://www.pulumi.com) is a tool to implement cloud infrastructures by use of regular programming languages. In regular programming languages, we regularly refactor our code after new features are added as to keep the design clean. Pulumi promises this too, but how can you do this?

This repository offers an example on how you can do this by leveraging the [`aliases`](https://www.pulumi.com/docs/intro/concepts/programming-model/#aliases) property.

We will prepend the description of the subsequent steps so it is directly in sight when checkout out each branch.

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
