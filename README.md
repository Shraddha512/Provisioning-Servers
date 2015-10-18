README
======

Install ansible. Place the inventory file in the ansible folder

### Digital Ocean

-	Token is a dummy value, please replace it with your token.
-	Package.json used for configuration management.
-	'npm install' to install all devDependencies from package.json

Steps to follow

```
node main.js
ansible all -m ping -i ansible/inventory -vvvv
ansible-playbook ansible/ans_playbook.yaml -i ansible/inventory -vvvv
```

### AWS

-	Add your secret key and access key
-	requirement.text is used for configuration management
-	'pip install -r requirement.text' to install all dependencies.

Steps to follow

```
python ec2.py
ansible all -m ping -i ansible/inventory -vvvv
ansible-playbook ansible/ans_playbook.yaml -i ansible/inventory -vvvv
```
