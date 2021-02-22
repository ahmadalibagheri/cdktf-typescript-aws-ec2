# typescript-aws

A CDK for Terraform application in TypeScript.

## Usage

Install project dependencies

```shell
yarn install
```

Generate CDK for Terraform constructs for Terraform provides and modules used in the project.

```bash
cdktf get
```

You can now edit the `main.ts` file if you want to modify any code.

```typescript
vim main.ts
import { Construct } from 'constructs'
import { App, TerraformStack, TerraformOutput } from 'cdktf'
import { AwsProvider, Instance, SecurityGroup } from './.gen/providers/aws'

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id)

    new AwsProvider(this, 'aws', {
      region: 'us-east-1',
    })

    const instancesg = new SecurityGroup(this, 'instancesg', {
      name: "CDKtf-TypeScript-Demo-sg",
      description: "Allows traffic to the instance.", 
      ingress: [{
        protocol: "tcp",
        fromPort: 80,
        toPort: 80,
        cidrBlocks: ["0.0.0.0/0"]
      },{
        protocol: "tcp",
        fromPort: 22,
        toPort: 22,
        cidrBlocks: ["0.0.0.0/0"]
      },{
        protocol: "tcp",
        fromPort: 443,
        toPort: 443,
        cidrBlocks: ["0.0.0.0/0"]
      }],
      egress: [{
        protocol: "-1",
        fromPort: 0,
        toPort: 0,
        cidrBlocks: ["0.0.0.0/0"]
      }],
      tags: {
        Name: 'CDKtf-TypeScript-Demo-sg',
        Team: 'Devops',
        Company: 'Your compnay',
      },
    })

    const instance = new Instance(this, 'compute', {
      ami: 'ami-03d315ad33b9d49c4',       //Ubuntu Server 20.04 LTS (HVM)
      instanceType: 't2.micro', 
      keyName: "Your_keyname",            //You should create Keyname manually before running code
      vpcSecurityGroupIds: [instancesg.id],
      tags: {
        Name: 'CDKtf-TypeScript-Demo',
        Team: 'Devops',
        Company: 'Your compnay',
      },
    })

    new TerraformOutput(this, 'security_ids', {
      value: instancesg.id,
    })

    new TerraformOutput(this, 'public_ip', {
      value: instance.publicIp,
    })
  }
}

const app = new App()
new MyStack(app, 'typescript-aws')
app.synth()
```

Compile the TypeScript application

```bash
tsc
```
At this step you can run code with two different way:

The first way
Generate Terraform configuration

```bash
cdktf synth
```

The above command will create a folder called `cdktf.out` that contains all Terraform JSON configuration that was generated.

Run Terraform commands

```bash
cd cdktf.out
terraform init
terraform plan
terraform apply
```
