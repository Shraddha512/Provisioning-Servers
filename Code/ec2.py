import boto.ec2
import config_aws
import time

def main():
    # Create connection obj
    conn = boto.ec2.connect_to_region("us-west-2",
            aws_access_key_id=config_aws.access_key,
            aws_secret_access_key=config_aws.secret_key)

    # Launch instances
    reservation = conn.run_instances('ami-5189a661',
                                        min_count=1,
                                        max_count=1,
                                        key_name='shraddha',
                                        instance_type='t2.micro',
                                        security_groups=['devops'])

    server_list = reservation.instances

    for server in server_list:
        while server.update() != "running":
            time.sleep(5)

        print(server.id)
        print(server.ip_address)
        ipAddress =server.ip_address

    f = open("ansible/inventory","a")
    f.write("\n node0 ansible_ssh_host="+ipAddress +" ansible_ssh_user=ubuntu ansible_ssh_private_key_file=shraddha.pem")
    f.close()

if __name__ == "__main__":
    main()
