import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { AwsProvider, ec2 , vpc} from "./.gen/providers/aws";

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AwsProvider(this, "aws", {
      region: "us-east-1",
    });

    const instancesg = new vpc.SecurityGroup(this, "instancesg", {
      name: "CDKtf-TypeScript-Demo-sg",
      description: "Allows traffic to the instance.",
      ingress: [
        {
          protocol: "tcp",
          fromPort: 80,
          toPort: 80,
          cidrBlocks: ["0.0.0.0/0"],
        },
        {
          protocol: "tcp",
          fromPort: 22,
          toPort: 22,
          cidrBlocks: ["0.0.0.0/0"],
        },
        {
          protocol: "tcp",
          fromPort: 443,
          toPort: 443,
          cidrBlocks: ["0.0.0.0/0"],
        },
      ],
      egress: [
        {
          protocol: "-1",
          fromPort: 0,
          toPort: 0,
          cidrBlocks: ["0.0.0.0/0"],
        },
      ],
      tags: {
        Name: this.node.tryGetContext("Name"),
        Team: this.node.tryGetContext("Team"),
        Company: this.node.tryGetContext("Company"),
      },
    });

    new ec2.Instance(this, "compute", {
      ami: "ami-03d315ad33b9d49c4", //Ubuntu Server 20.04 LTS (HVM)
      instanceType: "t2.micro",
      keyName: "DevOps",
      vpcSecurityGroupIds: [instancesg.id],
      tags: {
        Name: this.node.tryGetContext("Name"),
        Team: this.node.tryGetContext("Team"),
        Company: this.node.tryGetContext("Company"),
      },
    });

  }
}

const app = new App({ context: { Name: "CDKtf-TypeScript-Demo" , Team: "DevOps", Company: "Your company"} });
new MyStack(app, "typescript-aws");
app.synth();
